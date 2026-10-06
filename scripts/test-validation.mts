// Unit checks for validation.ts expiry logic
import { validatePaymentForm } from '../src/utils/validation.ts';

const now = new Date();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const yy = String(now.getFullYear() % 100).padStart(2, '0');

// 1. Card expiring THIS month must be accepted
let e = validatePaymentForm({ cardNumber: '4242424242424242', cardExpiry: `${mm}/${yy}`, cardCvv: '123' }, 'credit');
console.log('current-month expiry accepted:', Object.keys(e).length === 0, JSON.stringify(e));

// 2. Card expired last month must be rejected
const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const lm = String(lastMonthDate.getMonth() + 1).padStart(2, '0');
const ly = String(lastMonthDate.getFullYear() % 100).padStart(2, '0');
e = validatePaymentForm({ cardNumber: '4242424242424242', cardExpiry: `${lm}/${ly}`, cardCvv: '123' }, 'credit');
console.log('last-month expiry rejected:', 'cardExpiry' in e, JSON.stringify(e));

// 3. Future expiry accepted
e = validatePaymentForm({ cardNumber: '4242424242424242', cardExpiry: '12/99', cardCvv: '123' }, 'credit');
console.log('future expiry accepted:', Object.keys(e).length === 0, JSON.stringify(e));

// 4. Empty card details rejected
e = validatePaymentForm({ cardNumber: '', cardExpiry: '', cardCvv: '' }, 'credit');
console.log('empty card rejected:', Object.keys(e).length === 3, JSON.stringify(e));

// 5. Non-credit method skips card validation
e = validatePaymentForm({ cardNumber: '', cardExpiry: '', cardCvv: '' }, 'cod');
console.log('cod skips card validation:', Object.keys(e).length === 0);
