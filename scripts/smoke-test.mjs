/**
 * Runtime smoke test: executes the IIFE test build (dist-test/) in jsdom,
 * captures console errors / uncaught exceptions, and exercises basic interactions.
 */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const outDir = resolve(process.cwd(), 'dist-test');
const jsPath = join(outDir, 'app.js');
if (!existsSync(jsPath)) {
  console.error('dist-test/app.js not found. Run `npm run build:test` first.');
  process.exit(1);
}

const js = readFileSync(jsPath, 'utf8');
const cssFile = readdirSync(outDir).find((f) => f.endsWith('.css'));
const css = cssFile ? readFileSync(join(outDir, cssFile), 'utf8') : '';

const errors = [];
const warnings = [];

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (...args) => errors.push(['console.error', args.map(String).join(' ')]));
virtualConsole.on('jsdomError', (err) => {
  const msg = String(err && err.stack || err);
  // jsdom "Not implemented" stubs are environment limitations, not app bugs
  if (msg.includes('Not implemented')) {
    warnings.push(msg.split('\n')[0]);
    return;
  }
  errors.push(['jsdomError', msg]);
});
virtualConsole.on('warn', (...args) => warnings.push(args.map(String).join(' ')));
virtualConsole.on('log', (...args) => console.log('[app log]', ...args));

const dom = new JSDOM(`<!doctype html><html><head><style>${css}</style></head><body class="dark"><div id="root"></div></body></html>`, {
  url: 'http://localhost:5173/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
    window.matchMedia = window.matchMedia || ((query) => ({
      matches: false,
      media: query,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() { return false; },
    }));
    window.scrollTo = () => {};
    window.requestAnimationFrame = window.requestAnimationFrame || ((cb) => setTimeout(() => cb(Date.now()), 16));
    window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
    window.IntersectionObserver = class {
      observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
    };
    window.ResizeObserver = class {
      observe() {} unobserve() {} disconnect() {}
    };
    window.addEventListener('error', (e) => {
      errors.push(['window.onerror', String(e.error && e.error.stack || e.message)]);
    });
    window.addEventListener('unhandledrejection', (e) => {
      errors.push(['unhandledrejection', String(e.reason && e.reason.stack || e.reason)]);
    });
  },
});

const { window } = dom;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function clickByText(selector, text) {
  const els = [...window.document.querySelectorAll(selector)];
  const el = els.find((e) => (e.textContent || '').trim().includes(text));
  if (el) { el.click(); return true; }
  return false;
}

function clickFirstButtonWithSvg() {
  const b = [...window.document.querySelectorAll('button')].find((x) => x.querySelector('svg'));
  if (b) { b.click(); return true; }
  return false;
}

async function main() {
  // Execute the bundle
  const script = window.document.createElement('script');
  script.textContent = js;
  window.document.body.appendChild(script);

  await sleep(1000);

  const root = window.document.getElementById('root');
  let len = root ? root.innerHTML.length : 0;
  console.log('Rendered root innerHTML length:', len);
  if (len < 100) {
    errors.push(['render', 'App did not render (root is empty or nearly empty)']);
  }

  // Navigate through pages using footer/nav links
  for (const label of ['Products', 'About', 'Contact', 'Home']) {
    const ok = clickByText('button', label);
    await sleep(500);
    len = root.innerHTML.length;
    console.log(`After clicking "${label}" (${ok}), root length: ${len}`);
    if (len < 100) errors.push(['navigate', `Page "${label}" rendered empty`]);
  }

  // Wishlist page via nav heart (nav action buttons have svg icons)
  // Cart page via footer "Cart" text or nav
  for (const label of ['Cart', 'Wishlist', 'Search', 'Account', 'Checkout']) {
    const ok = clickByText('button, a', label);
    await sleep(500);
    len = root.innerHTML.length;
    console.log(`After clicking "${label}" (${ok}), root length: ${len}`);
  }

  // Admin page: try clicking admin link in footer
  const adminOk = clickByText('button, a', 'Admin');
  await sleep(600);
  console.log('Admin nav click:', adminOk, 'root length:', root.innerHTML.length);

  console.log('\n=== RESULT ===');
  console.log('Errors:', errors.length);
  for (const [src, msg] of errors) {
    console.log(`\n[${src}]\n${msg}`);
  }
  if (warnings.length) {
    console.log('\nWarnings:', warnings.length);
    for (const w of warnings.slice(0, 10)) console.log(' -', w.slice(0, 300));
  }

  window.close();
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error('Smoke test crashed:', e);
  process.exit(2);
});
