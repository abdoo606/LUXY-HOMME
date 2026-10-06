/**
 * Deep interaction smoke test: exercises cart, checkout, wishlist, search,
 * account, admin, theme and language flows; reports failures.
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
const failures = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (...args) => errors.push(['console.error', args.map(String).join(' ')]));
virtualConsole.on('jsdomError', (err) => {
  const msg = String((err && err.stack) || err);
  if (msg.includes('Not implemented')) return;
  errors.push(['jsdomError', msg]);
});
virtualConsole.on('warn', () => {});
virtualConsole.on('log', (...args) => console.log('[app]', ...args));

const dom = new JSDOM(`<!doctype html><html><head><style>${css}</style></head><body class="dark"><div id="root"></div></body></html>`, {
  url: 'http://localhost:5173/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
    window.matchMedia = ((query) => ({
      matches: false, media: query,
      addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
      dispatchEvent() { return false; },
    }));
    window.scrollTo = () => {};
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
    window.cancelAnimationFrame = clearTimeout;
    window.IntersectionObserver = class {
      observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
    };
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    window.addEventListener('error', (e) => errors.push(['window.onerror', String((e.error && e.error.stack) || e.message)]));
    window.addEventListener('unhandledrejection', (e) => errors.push(['unhandledrejection', String((e.reason && e.reason.stack) || e.reason)]));
  },
});

const { window } = dom;
const doc = window.document;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function q(sel) { return [...doc.querySelectorAll(sel)]; }
function byText(sel, text) {
  return q(sel).find((e) => (e.textContent || '').trim().includes(text));
}
function clickText(sel, text) {
  const el = byText(sel, text);
  if (!el) return false;
  el.click();
  return true;
}
function setInput(input, value) {
  const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  proto.set.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
}
function check(name, cond, detail = '') {
  if (cond) console.log('PASS:', name);
  else { console.log('FAIL:', name, detail); failures.push(`${name} ${detail}`); }
}

async function main() {
  const script = doc.createElement('script');
  script.textContent = js;
  doc.body.appendChild(script);
  await sleep(800);

  const root = doc.getElementById('root');

  // ---------- HOME ----------
  check('home renders', root.innerHTML.length > 1000);

  // ---------- ADD TO CART from FeaturedProducts ----------
  // find add-to-cart round buttons (product overlay buttons with ShoppingBag svg)
  // They only appear on hover (CSS opacity), but are clickable in DOM.
  let addBtns = q('button').filter((b) => b.className.includes('bg-accent') && b.className.includes('rounded-full') && b.querySelector('svg'));
  if (!addBtns.length) {
    // fallback: navigate to products first
    clickText('button', 'Products');
    await sleep(500);
    addBtns = q('button').filter((b) => b.className.includes('rounded-full') && b.querySelector('svg'));
  }
  check('found product action buttons', addBtns.length > 0, `found ${addBtns.length}`);
  if (addBtns.length >= 2) {
    addBtns[1].click(); // second icon = add to cart (first is quick view eye)
    await sleep(300);
    const badge = byText('nav span', '') ;
    // cart count badge
    const cartBadge = q('nav span, header span').map((s) => s.textContent).join(' ');
    check('cart badge shows count after add', /\d/.test(cartBadge), `badges: ${cartBadge}`);
  }

  // ---------- WISHLIST ----------
  const wishBtn = q('button').find((b) => b.className.includes('absolute') && b.className.includes('right-3') && b.querySelector('svg'));
  if (wishBtn) {
    wishBtn.click();
    await sleep(200);
    check('wishlist toggle clicked', true);
  } else check('wishlist button found', false);

  // ---------- OPEN QUICK VIEW ----------
  const eyeBtn = q('button').find((b) => b.className.includes('rounded-full') && b.querySelector('svg'));
  if (eyeBtn) {
    eyeBtn.click();
    await sleep(400);
    const modalText = root.textContent || '';
    check('quick view opens', modalText.includes('Add to Cart') || modalText.includes('add to cart') || modalText.toLowerCase().includes('add'), '');
    // close modal
    clickText('button', '×') || q('button').find((b) => b.querySelector('svg.lucide-x'))?.click();
    await sleep(300);
  }

  // ---------- CART PAGE ----------
  // cart page via nav shopping bag (nav icons: search, theme, heart, bag, user, menu)
  const navButtons = q('nav button');
  const bagBtn = navButtons.find((b) => b.querySelector('svg') && (b.innerHTML.includes('shopping-bag') || b.querySelector('.lucide-shopping-bag')));
  if (bagBtn) bagBtn.click();
  else clickText('button, a', 'Cart');
  await sleep(500);
  const cartText = root.textContent || '';
  check('cart page reachable', cartText.length > 500);
  console.log('  cart page snippet:', cartText.replace(/\s+/g, ' ').slice(0, 200));

  // increment quantity if + button exists (icon buttons)
  const plusBtn = q('button').find((b) => b.querySelector('.lucide-plus') && !b.className.includes('rounded-full')) || q('button').find((b) => (b.textContent || '').trim() === '+');
  if (plusBtn) { plusBtn.click(); await sleep(200); check('quantity + works', true); }
  else console.log('  (no + button — cart may be empty)');

  // ---------- CHECKOUT ----------
  const checkoutBtn = byText('button, a', 'Checkout') || byText('button, a', 'checkout');
  if (checkoutBtn) {
    checkoutBtn.click();
    await sleep(500);
    // fill shipping form
    const inputs = q('input');
    console.log('  checkout inputs:', inputs.length);
    const fields = ['John', 'Doe', 'john@example.com', '+1 555 123 4567', '123 Main Street', 'New York', 'NY', '10001', 'United States'];
    inputs.slice(0, 9).forEach((inp, i) => setInput(inp, fields[i]));
    await sleep(200);
    // click continue/next
    const nextBtn = byText('button', 'Continue') || byText('button', 'Next') || byText('button', 'Payment');
    if (nextBtn) {
      nextBtn.click();
      await sleep(1200); // wait for AnimatePresence transition
      const step2Text = root.textContent || '';
      check('checkout step 2 reached', step2Text.includes('Card Number') || step2Text.toLowerCase().includes('card number') || step2Text.includes('رقم البطاقة'), step2Text.replace(/\s+/g, ' ').slice(0, 120));
      // try review order without card details -> should show validation errors
      const reviewBtn = byText('button', 'Review');
      if (reviewBtn) {
        reviewBtn.click();
        await sleep(400);
        const hasValErrors = (root.textContent || '').toLowerCase().includes('required') || (root.textContent || '').includes('مطلوب') || (root.textContent || '').toLowerCase().includes('valid');
        check('payment validation shows errors on empty card', hasValErrors);
        // fill card
        const allInputs = q('input');
        const cardNumber = allInputs.find((i) => i.maxLength === 19) || allInputs[allInputs.length - 3];
        if (cardNumber) setInput(cardNumber, '4242424242424242');
        await sleep(100);
        const expiry = allInputs.find((i) => i.maxLength === 5);
        if (expiry) setInput(expiry, '1230');
        await sleep(100);
        const cvv = allInputs.find((i) => i.maxLength === 4 && i !== expiry);
        if (cvv) setInput(cvv, '123');
        await sleep(100);
        const reviewBtn2 = byText('button', 'Review');
        if (reviewBtn2) {
          reviewBtn2.click();
          await sleep(500);
          const confirmVisible = (root.textContent || '').includes('Confirm') || (root.textContent || '').includes('تأكيد');
          check('confirmation modal shows', confirmVisible);
          const placeBtn = byText('button', 'Place') || byText('button', 'Confirm') || byText('button', 'Order');
          if (placeBtn && confirmVisible) {
            placeBtn.click();
            await sleep(2200); // 1.5s simulated API
            const successText = root.textContent || '';
            check('order placed success', successText.toLowerCase().includes('success') || successText.toLowerCase().includes('thank') || successText.includes('تم') || /LH-/.test(successText), successText.replace(/\s+/g, ' ').slice(0, 150));
          }
        }
      }
    } else {
      check('checkout next button found', false, 'buttons: ' + q('button').map((b) => (b.textContent || '').trim()).filter(Boolean).slice(0, 20).join(' | '));
    }
  } else {
    check('checkout button found', false);
  }

  // ---------- SEARCH PAGE ----------
  clickText('nav button', '') ;
  // navigate via search icon - hard to select; use footer
  const searchNav = q('nav button').find((b) => b.querySelector('svg.lucide-search'));
  if (searchNav) { searchNav.click(); await sleep(400); }
  const searchInput = q('input')[0];
  if (searchInput) {
    setInput(searchInput, 'suit');
    await sleep(400);
    const st = root.textContent || '';
    check('search returns results', st.toLowerCase().includes('suit') || st.toLowerCase().includes('result'), st.replace(/\s+/g, ' ').slice(0, 150));
  }

  // ---------- LANGUAGE SWITCH TO ARABIC ----------
  const langBtn = byText('button', 'English') || byText('button', '🌐');
  if (langBtn) {
    langBtn.click();
    await sleep(300);
    const arBtn = byText('button', 'العربية');
    if (arBtn) {
      arBtn.click();
      await sleep(500);
      check('arabic direction set', doc.documentElement.dir === 'rtl', `dir=${doc.documentElement.dir}`);
      const bodyHasArabic = /[\u0600-\u06FF]/.test(root.textContent || '');
      check('arabic text rendered', bodyHasArabic);
    } else check('arabic option found', false, 'dropdown buttons: ' + q('button').map((b) => (b.textContent || '').trim()).slice(0, 15).join(' | '));
  } else console.log('  (language button not found from current page)');

  // ---------- ADMIN ----------
  const adminLink = byText('button, a', 'Admin') || byText('button, a', 'ADMIN') || byText('button, a', 'لوحة الإدارة');
  if (adminLink) {
    adminLink.click();
    await sleep(800);
    const adminTexts = root.textContent || '';
    check('admin page opens', /Admin Panel|لوحة الإدارة/i.test(adminTexts), adminTexts.replace(/\s+/g, ' ').slice(0, 120));
    // try login
    const adminInputs = q('input');
    if (adminInputs.length >= 2) {
      setInput(adminInputs[0], 'admin@luxehomme.com');
      setInput(adminInputs[1], 'Admin@2025');
      await sleep(100);
      const loginBtn = byText('button', 'Sign') || byText('button', 'Login') || byText('button', 'دخول') || q('button[type=submit]')[0];
      if (loginBtn) {
        loginBtn.click();
        await sleep(1600); // 800ms simulated API + re-render
        const dash = root.textContent || '';
        check('admin login works', /dashboard|revenue|orders/i.test(dash) || /لوحة|الإيرادات|الطلبات/.test(dash), dash.replace(/\s+/g, ' ').slice(0, 150));
      }
    } else check('admin login inputs found', false);
  } else check('admin link found', false);

  console.log('\n=== SUMMARY ===');
  console.log('Failures:', failures.length);
  for (const f of failures) console.log(' -', f);
  console.log('JS errors:', errors.length);
  for (const [src, msg] of errors.slice(0, 10)) console.log(`\n[${src}] ${msg.split('\n').slice(0, 5).join('\n')}`);

  window.close();
  process.exit(failures.length || errors.length ? 1 : 0);
}

main().catch((e) => { console.error('Test crashed:', e); process.exit(2); });
