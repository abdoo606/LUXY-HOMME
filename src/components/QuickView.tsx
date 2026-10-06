import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const { t, language } = useTranslation();
  const { formatPrice } = useCurrency();
  const { theme, addToCart } = useStore();
  const isDark = theme === 'dark';

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ product, quantity, size: selectedSize, color: selectedColor.name });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-dark-card' : 'bg-white'}`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 end-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name[language]}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-accent' : isDark ? 'border-white/10' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                ))}
                <span className={`text-sm ml-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  ({product.reviews} {t('prod.reviews')})
                </span>
              </div>

              <h2 className={`text-2xl lg:text-3xl font-display font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {product.name[language]}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-accent">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className={`text-lg line-through ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                {product.description[language]}
              </p>

              {/* Size */}
              <div className="mb-4">
                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {t('prod.size')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-accent text-white'
                          : isDark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-4">
                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {t('prod.color')}: {selectedColor.name}
                </label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor.name === color.name ? 'border-accent scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {t('prod.quantity')}
                </label>
                <div className={`inline-flex items-center rounded-lg overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`px-3 py-2 ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-700'}`}>
                    <Minus size={16} />
                  </button>
                  <span className={`px-4 py-2 font-medium min-w-[3rem] text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className={`px-3 py-2 ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-700'}`}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full py-4 rounded-xl font-medium text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/25'
                }`}
              >
                {added ? (
                  <>✓ {t('general.added')}</>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    {t('prod.addToCart')}
                  </>
                )}
              </button>

              {/* Features */}
              <div className={`grid grid-cols-3 gap-3 mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="text-center">
                  <Truck size={18} className="text-accent mx-auto mb-1" />
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{t('prod.free_shipping')}</span>
                </div>
                <div className="text-center">
                  <RotateCcw size={18} className="text-accent mx-auto mb-1" />
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{t('prod.returns')}</span>
                </div>
                <div className="text-center">
                  <Shield size={18} className="text-accent mx-auto mb-1" />
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{t('prod.authentic')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
