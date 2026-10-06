import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/adminStore';
import type { Product } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';

interface ProductsPageProps {
  initialCategory?: string;
}

export default function ProductsPage({ initialCategory }: ProductsPageProps) {
  const { t, language } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const { products } = useAdminStore();
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showSort, setShowSort] = useState(false);

  // Sync initialCategory when it changes (e.g. from Categories page)
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    { key: 'all', label: t('prod.all') },
    { key: 'suits', label: t('cat.suits') },
    { key: 'casual', label: t('cat.casual') },
    { key: 'shoes', label: t('cat.shoes') },
    { key: 'accessories', label: t('cat.accessories') },
    { key: 'sportswear', label: t('cat.sportswear') },
    { key: 'outerwear', label: t('cat.outerwear') },
  ];

  const sortOptions = [
    { key: 'newest', label: t('prod.sortNewest') },
    { key: 'priceLow', label: t('prod.sortPriceLow') },
    { key: 'priceHigh', label: t('prod.sortPriceHigh') },
    { key: 'popular', label: t('prod.sortPopular') },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = activeCategory === 'all'
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [activeCategory, sortBy, products]);

  return (
    <>
      <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">{t('prod.subtitle')}</span>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 ${isDark ? 'text-white' : 'text-primary'}`}>
              {t('nav.products')}
            </h1>
          </motion.div>

          {/* Filters & Sort Bar */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.key
                      ? 'bg-accent text-white shadow-md shadow-accent/25'
                      : isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal size={16} />
                {t('prod.sort')}
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`absolute top-full mt-2 ${language === 'ar' ? 'left-0' : 'right-0'} rounded-lg shadow-xl overflow-hidden z-20 min-w-[200px] ${isDark ? 'bg-dark-surface border border-white/10' : 'bg-white border border-gray-200'}`}
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          sortBy === opt.key
                            ? 'bg-accent/10 text-accent'
                            : isDark ? 'text-white/60 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results Count */}
          <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            {filteredProducts.length} {t('cart.items')}
          </p>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                index={i}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {t('search.noCategory')}
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
