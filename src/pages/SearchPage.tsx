import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/adminStore';
import type { Product } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';

export default function SearchPage() {
  const { t, language } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const { products } = useAdminStore();
  const [query, setQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) =>
      p.name[language].toLowerCase().includes(q) ||
      p.name.en.toLowerCase().includes(q) ||
      p.description[language].toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [query, language, products]);

  return (
    <>
      <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="relative">
              <Search size={22} className={`absolute start-5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder={t('nav.search')}
                className={`w-full ps-14 pe-12 py-5 rounded-2xl text-lg outline-none transition-colors ${
                  isDark
                    ? 'bg-dark-card text-white placeholder:text-white/30 border border-white/10 focus:border-accent'
                    : 'bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:border-accent shadow-sm'
                }`}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className={`absolute end-5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </motion.div>

          {query && (
            <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              {t('search.results').replace('{count}', String(results.length)).replace('{query}', query)}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {results.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                index={i}
              />
            ))}
          </div>

          {query && results.length === 0 && (
            <div className="text-center py-20">
              <Search size={64} className={`mx-auto mb-6 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
              <p className={`text-lg ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {t('search.noResults').replace('{query}', query)}
              </p>
            </div>
          )}

          {!query && (
            <div className="text-center py-20">
              <Search size={64} className={`mx-auto mb-6 ${isDark ? 'text-white/10' : 'text-gray-200'}`} />
              <p className={`text-lg ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                {t('nav.search')}
              </p>
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
