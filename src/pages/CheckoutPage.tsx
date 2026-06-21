import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Building, Smartphone, Bitcoin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/adminStore';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';
import {
  validateShippingForm,
  validatePaymentForm,
  hasErrors,
  formatCardNumber,
  formatExpiry,
  type ShippingFormData,
  type PaymentFormData,
  type ValidationErrors,
} from '../utils/validation';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { t, language } = useTranslation();
  const { formatPrice } = useCurrency();
  const { theme, cart, getCartTotal, clearCart } = useStore();
  const { addOrder } = useAdminStore();
  const isDark = theme === 'dark';

  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('credit');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Form data
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  // Validation errors
  const [shippingErrors, setShippingErrors] = useState<ValidationErrors>({});
  const [paymentErrors, setPaymentErrors] = useState<ValidationErrors>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    { key: 'credit', label: t('pay.credit'), icon: CreditCard, color: 'bg-blue-500' },
    { key: 'paypal', label: t('pay.paypal'), icon: CreditCard, color: 'bg-blue-600' },
    { key: 'apple', label: t('pay.apple'), icon: Smartphone, color: 'bg-gray-800' },
    { key: 'google', label: t('pay.google'), icon: Smartphone, color: 'bg-green-600' },
    { key: 'stripe', label: t('pay.stripe'), icon: CreditCard, color: 'bg-purple-600' },
    { key: 'crypto', label: t('pay.crypto'), icon: Bitcoin, color: 'bg-orange-500' },
    { key: 'bank', label: t('pay.bank'), icon: Building, color: 'bg-teal-600' },
    { key: 'cod', label: t('pay.cod'), icon: Truck, color: 'bg-accent' },
    { key: 'klarna', label: t('pay.klarna'), icon: CreditCard, color: 'bg-pink-500' },
  ];

  const handleShippingChange = (field: keyof ShippingFormData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (shippingErrors[field]) {
      setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePaymentChange = (field: keyof PaymentFormData, value: string) => {
    let formattedValue = value;
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'cardExpiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cardCvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    setPaymentData((prev) => ({ ...prev, [field]: formattedValue }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    const errors = validateShippingForm(shippingData, language);
    setShippingErrors(errors);
    if (!hasErrors(errors)) {
      setStep(2);
    }
  };

  const handleShowConfirmation = () => {
    const errors = validatePaymentForm(paymentData, selectedPayment, language);
    setPaymentErrors(errors);
    if (!hasErrors(errors)) {
      setShowConfirmation(true);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));

    // Create order in admin store
    const order = addOrder({
      customer: shippingData,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name.en,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.image,
      })),
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: selectedPayment,
    });

    setOrderNumber(order.orderNumber);
    setOrderPlaced(true);
    clearCart();
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <section className={`pt-28 lg:pt-36 pb-20 min-h-screen flex items-center justify-center ${isDark ? 'bg-dark' : 'bg-light'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
          </motion.div>
          <h2 className={`text-3xl font-display font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('checkout.success')}
          </h2>
          <p className={`mb-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {t('checkout.successDesc')}
          </p>
          <div className={`py-4 px-6 rounded-xl mb-8 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
            <p className={`text-sm mb-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{t('checkout.orderNumber')}</p>
            <p className="text-accent font-bold text-xl font-mono">{orderNumber}</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25"
          >
            {t('cart.continueShopping')}
          </button>
        </motion.div>
      </section>
    );
  }

  const InputField = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    colSpan = 1,
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    colSpan?: number;
  }) => (
    <div className={colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
          error
            ? 'border-2 border-red-500 bg-red-500/5'
            : isDark
              ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
              : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent'
        }`}
        placeholder={placeholder || label}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );

  return (
    <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl lg:text-4xl font-display font-bold mb-10 ${isDark ? 'text-white' : 'text-primary'}`}
        >
          {t('checkout.title')}
        </motion.h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-accent text-white' : isDark ? 'bg-white/10 text-white/40' : 'bg-gray-200 text-gray-400'
              }`}>
                {s}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-accent' : isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {s === 1 ? t('checkout.shipping_info') : t('checkout.payment')}
              </span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-accent' : isDark ? 'bg-white/10' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-6 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}
                >
                  <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('checkout.shipping_info')}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField
                      label={t('checkout.firstName')}
                      value={shippingData.firstName}
                      onChange={(v) => handleShippingChange('firstName', v)}
                      error={shippingErrors.firstName}
                    />
                    <InputField
                      label={t('checkout.lastName')}
                      value={shippingData.lastName}
                      onChange={(v) => handleShippingChange('lastName', v)}
                      error={shippingErrors.lastName}
                    />
                    <InputField
                      label={t('checkout.email')}
                      type="email"
                      value={shippingData.email}
                      onChange={(v) => handleShippingChange('email', v)}
                      error={shippingErrors.email}
                      placeholder="email@example.com"
                    />
                    <InputField
                      label={t('checkout.phone')}
                      type="tel"
                      value={shippingData.phone}
                      onChange={(v) => handleShippingChange('phone', v)}
                      error={shippingErrors.phone}
                      placeholder="+1 (555) 123-4567"
                    />
                    <InputField
                      label={t('checkout.address')}
                      value={shippingData.address}
                      onChange={(v) => handleShippingChange('address', v)}
                      error={shippingErrors.address}
                      colSpan={2}
                    />
                    <InputField
                      label={t('checkout.city')}
                      value={shippingData.city}
                      onChange={(v) => handleShippingChange('city', v)}
                      error={shippingErrors.city}
                    />
                    <InputField
                      label={t('checkout.state')}
                      value={shippingData.state}
                      onChange={(v) => handleShippingChange('state', v)}
                      error={shippingErrors.state}
                    />
                    <InputField
                      label={t('checkout.zip')}
                      value={shippingData.zip}
                      onChange={(v) => handleShippingChange('zip', v)}
                      error={shippingErrors.zip}
                    />
                    <InputField
                      label={t('checkout.country')}
                      value={shippingData.country}
                      onChange={(v) => handleShippingChange('country', v)}
                      error={shippingErrors.country}
                    />
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25"
                  >
                    {t('general.next')}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-6 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}
                >
                  <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('checkout.payment')}
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.key}
                        onClick={() => setSelectedPayment(pm.key)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedPayment === pm.key
                            ? 'border-accent bg-accent/10'
                            : isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${pm.color} flex items-center justify-center`}>
                          <pm.icon size={20} className="text-white" />
                        </div>
                        <span className={`text-xs font-medium text-center ${
                          selectedPayment === pm.key ? 'text-accent' : isDark ? 'text-white/60' : 'text-gray-600'
                        }`}>
                          {pm.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedPayment === 'credit' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                          Card Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
                            paymentErrors.cardNumber
                              ? 'border-2 border-red-500 bg-red-500/5'
                              : isDark
                                ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                                : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                          }`}
                        />
                        {paymentErrors.cardNumber && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {paymentErrors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                            Expiry <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardExpiry}
                            onChange={(e) => handlePaymentChange('cardExpiry', e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
                              paymentErrors.cardExpiry
                                ? 'border-2 border-red-500 bg-red-500/5'
                                : isDark
                                  ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                                  : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                            }`}
                          />
                          {paymentErrors.cardExpiry && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {paymentErrors.cardExpiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                            CVV <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardCvv}
                            onChange={(e) => handlePaymentChange('cardCvv', e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
                              paymentErrors.cardCvv
                                ? 'border-2 border-red-500 bg-red-500/5'
                                : isDark
                                  ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                                  : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                            }`}
                          />
                          {paymentErrors.cardCvv && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {paymentErrors.cardCvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className={`px-6 py-4 rounded-xl font-medium transition-colors ${
                        isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('general.back')}
                    </button>
                    <button
                      onClick={handleShowConfirmation}
                      className="flex-1 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className={`p-6 rounded-xl sticky top-28 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('checkout.orderSummary')}
              </h3>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <img src={item.product.image} alt="" className="w-12 h-14 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product.name[language]}</p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>x{item.quantity}</p>
                    </div>
                    <span className="text-accent text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className={`space-y-2 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-white/60' : 'text-gray-600'}>{t('cart.subtotal')}</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-white/60' : 'text-gray-600'}>{t('cart.shipping')}</span>
                  <span className={shipping === 0 ? 'text-emerald-500' : isDark ? 'text-white' : 'text-gray-900'}>
                    {shipping === 0 ? t('cart.free') : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-white/60' : 'text-gray-600'}>{t('cart.tax')}</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(tax)}</span>
                </div>
                <div className={`flex justify-between pt-3 border-t font-bold ${isDark ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>
                  <span>{t('cart.total')}</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmation(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg rounded-2xl p-6 ${isDark ? 'bg-dark-card' : 'bg-white'}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Confirm Your Order
              </h3>

              <div className={`space-y-4 mb-6 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div>
                  <p className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Shipping To:</p>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {shippingData.firstName} {shippingData.lastName}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    {shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.zip}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    {shippingData.email} • {shippingData.phone}
                  </p>
                </div>

                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Payment Method:</p>
                  <p className={`text-sm capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentMethods.find((p) => p.key === selectedPayment)?.label}
                  </p>
                </div>

                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total Amount:</span>
                    <span className="text-accent font-bold text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('general.back')}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    t('checkout.placeOrder')
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
