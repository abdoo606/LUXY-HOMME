import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const { t, language } = useTranslation();
  const { formatPrice } = useCurrency();
  const { theme, addToCart, wishlist, toggleWishlist } = useStore();
  const isDark = theme === 'dark';
  const [isAdding, setIsAdding] = useState(false);
  const isWished = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0].name,
    });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="product-card group"
    >
      <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-dark-card' : 'bg-white'} shadow-sm hover:shadow-xl transition-all duration-500`}>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name[language]}
            className="product-image w-full h-full object-cover transition-transform duration-700"
          />
          
          {/* Overlay Actions */}
          <div className="product-overlay absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-accent hover:text-white transition-colors shadow-lg"
            >
              <Eye size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-dark transition-colors shadow-lg"
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                {t('prod.new')}
              </span>
            )}
            {product.isSale && product.originalPrice && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWished
                ? 'bg-red-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={16} fill={isWished ? 'currentColor' : 'none'} />
          </button>

          {/* Adding feedback */}
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-accent/80 flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">✓ {t('general.added')}</span>
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
              />
            ))}
            <span className={`text-xs ml-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              ({product.reviews})
            </span>
          </div>

          <h3 className={`font-medium text-sm lg:text-base line-clamp-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.name[language]}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className={`text-sm line-through ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Colors Preview */}
          <div className="flex items-center gap-1.5 mt-3">
            {product.colors.map((color) => (
              <div
                key={color.name}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
