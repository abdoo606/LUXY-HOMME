import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/adminStore';
import type { Product } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  onNavigate: (page: string) => void;
}

export default function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const { products } = useAdminStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featured = products.filter((p) => p.isNew || p.isSale).slice(0, 8);

  return (
    <>
      <section className={`py-20 lg:py-28 ${isDark ? 'bg-dark-card' : 'bg-light-surface'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">{t('prod.subtitle')}</span>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 ${isDark ? 'text-white' : 'text-primary'}`}>
              {t('prod.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                index={i}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => onNavigate('products')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-accent/25"
            >
              {t('prod.viewAll')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
}
