import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { t, language } = useTranslation();
  const { formatPrice } = useCurrency();
  const { theme, cart, updateQuantity, removeFromCart, getCartTotal } = useStore();
  const isDark = theme === 'dark';

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <section className={`pt-28 lg:pt-36 pb-20 min-h-screen flex items-center justify-center ${isDark ? 'bg-dark' : 'bg-light'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className={`mx-auto mb-6 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
          <h2 className={`text-2xl font-display font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('cart.empty')}
          </h2>
          <p className={`text-base mb-8 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            {t('cart.emptyDesc')}
          </p>
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

  return (
    <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl lg:text-4xl font-display font-bold mb-10 ${isDark ? 'text-white' : 'text-primary'}`}
        >
          {t('cart.title')} <span className={`text-base font-normal ${isDark ? 'text-white/40' : 'text-gray-400'}`}>({cart.length} {t('cart.items')})</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex gap-4 p-4 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name[language]}
                  className="w-24 h-28 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm lg:text-base mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.product.name[language]}
                  </h3>
                  <p className={`text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                    {t('prod.size')}: {item.size} • {t('prod.color')}: {item.color}
                  </p>
                  <p className="text-accent font-bold">{formatPrice(item.product.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className={`inline-flex items-center rounded-lg overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className={`px-2.5 py-1.5 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={`px-3 py-1.5 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className={`px-2.5 py-1.5 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                      className="text-red-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl sticky top-28 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}
            >
              <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('checkout.orderSummary')}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-gray-600'}>{t('cart.subtotal')}</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-gray-600'}>{t('cart.shipping')}</span>
                  <span className={shipping === 0 ? 'text-emerald-500 font-medium' : isDark ? 'text-white' : 'text-gray-900'}>
                    {shipping === 0 ? t('cart.free') : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-gray-600'}>{t('cart.tax')}</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(tax)}</span>
                </div>
                <div className={`flex justify-between pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('cart.total')}</span>
                  <span className="text-accent font-bold text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/25"
              >
                {t('cart.checkout')}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className={`w-full py-3 mt-3 rounded-xl text-sm font-medium transition-colors ${
                  isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('cart.continueShopping')}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
