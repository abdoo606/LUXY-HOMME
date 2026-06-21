import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/adminStore';
import type { Product } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';

interface WishlistPageProps {
  onNavigate: (page: string) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { t } = useTranslation();
  const { theme, wishlist } = useStore();
  const { products } = useAdminStore();
  const isDark = theme === 'dark';
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Heart size={40} className="text-accent mx-auto mb-4" />
            <h1 className={`text-3xl lg:text-4xl font-display font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
              Wishlist
            </h1>
            <p className={`mt-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              {wishlistProducts.length} {t('cart.items')}
            </p>
          </motion.div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart size={64} className={`mx-auto mb-6 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
              <p className={`text-lg mb-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                Your wishlist is empty
              </p>
              <button
                onClick={() => onNavigate('products')}
                className="px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25"
              >
                {t('prod.viewAll')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {wishlistProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
}
