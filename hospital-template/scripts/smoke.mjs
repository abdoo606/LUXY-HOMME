/**
 * Runtime smoke test: executes the built bundle in jsdom and checks for errors.
 * Run: node scripts/smoke.mjs  (after npm run build)
 */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const outDir = resolve(process.cwd(), 'dist');
if (!existsSync(outDir)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

// find built assets
const files = readdirSync(join(outDir, 'assets'));
const jsFile = files.find((f) => f.endsWith('.js'));
const cssFile = files.find((f) => f.endsWith('.css'));
const js = readFileSync(join(outDir, 'assets', jsFile), 'utf8');
const css = cssFile ? readFileSync(join(outDir, 'assets', cssFile), 'utf8') : '';

const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (...args) => errors.push(['console.error', args.map(String).join(' ')]));
virtualConsole.on('jsdomError', (err) => {
  const msg = String((err && err.stack) || err);
  if (msg.includes('Not implemented')) return;
  errors.push(['jsdomError', msg]);
});
virtualConsole.on('warn', () => {});

const dom = new JSDOM(
  `<!doctype html><html><head><style>${css}</style></head><body><div id="root"></div></body></html>`,
  {
    url: 'http://localhost:5174/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.matchMedia = (q) => ({
        matches: false, media: q,
        addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
        dispatchEvent() { return false; },
      });
      window.scrollTo = () => {};
      window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
      window.cancelAnimationFrame = clearTimeout;
      window.IntersectionObserver = class {
        observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
      };
      window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.print = () => {};
      window.addEventListener('error', (e) => errors.push(['window.onerror', String((e.error && e.error.stack) || e.message)]));
      window.addEventListener('unhandledrejection', (e) => errors.push(['unhandledrejection', String((e.reason && e.reason.stack) || e.reason)]));
    },
  }
);

const { window } = dom;
const doc = window.document;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => [...doc.querySelectorAll(s)];
function clickText(sel, text) {
  const el = q(sel).find((e) => (e.textContent || '').includes(text));
  if (el) { el.click(); return true; }
  return false;
}
function check(name, cond, detail = '') {
  console.log(`${cond ? 'PASS' : 'FAIL'}: ${name}${cond ? '' : ' — ' + detail}`);
  return cond;
}

async function main() {
  const s = doc.createElement('script');
  s.textContent = js;
  doc.body.appendChild(s);
  await sleep(1200);

  const root = doc.getElementById('root');
  let ok = true;
  ok = check('home renders', root.innerHTML.length > 2000, String(root.innerHTML.length));
  ok = check('hero text present', /Excellence in|التميز/.test(root.textContent)) && ok;

  // Navigate all pages
  for (const label of ['About Us', 'Departments', 'Doctors', 'Gallery', 'Contact']) {
    clickText('nav button', label);
    await sleep(450);
    ok = check(`page "${label}" renders`, root.innerHTML.length > 800, String(root.innerHTML.length)) && ok;
  }

  // Book appointment flow
  clickText('button', 'Book Appointment');
  await sleep(500);
  ok = check('appointment wizard opens', /Department|القسم|Cardiology|أمراض القلب/.test(root.textContent)) && ok;

  // pick first department
  const deptBtn = q('button').find((b) => /Cardiology|أمراض القلب/.test(b.textContent || ''));
  if (deptBtn) {
    deptBtn.click();
    await sleep(200);
    const continueBtn = q('button').find((b) => (b.textContent || '').trim().startsWith('Continue'));
    if (continueBtn) {
      continueBtn.click();
      await sleep(500);
      ok = check('step 2 (doctor & time) reached', /Choose a doctor|اختر الطبيب/.test(root.textContent)) && ok;
    }
  }

  // Arabic switch — open language dropdown first (top bar), then pick العربية
  clickText('button', 'English');
  await sleep(300);
  const arBtn = q('button').find((b) => (b.textContent || '').includes('العربية'));
  if (arBtn) { arBtn.click(); } else { check('arabic option found', false, 'dropdown not opened'); }
  await sleep(450);
  ok = check('arabic RTL active', doc.documentElement.dir === 'rtl', doc.documentElement.dir) && ok;
  ok = check('arabic content renders', /[\u0600-\u06FF]/.test(root.textContent)) && ok;

  console.log('\n=== RESULT ===');
  console.log('JS errors:', errors.length);
  for (const [src, msg] of errors.slice(0, 8)) console.log(`\n[${src}]\n${msg.split('\n').slice(0, 4).join('\n')}`);
  window.close();
  process.exit(ok && errors.length === 0 ? 0 : 1);
}

main().catch((e) => { console.error('Smoke crashed:', e); process.exit(2); });
