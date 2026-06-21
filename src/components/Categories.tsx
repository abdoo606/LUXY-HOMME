import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

interface CategoriesProps {
  onNavigate: (page: string, category?: string) => void;
}

const categoryData = [
  {
    key: 'suits',
    image: 'https://images.pexels.com/photos/9210383/pexels-photo-9210383.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500',
    icon: '👔',
  },
  {
    key: 'casual',
    image: 'https://images.pexels.com/photos/31618286/pexels-photo-31618286.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500',
    icon: '👕',
  },
  {
    key: 'shoes',
    image: 'https://images.pexels.com/photos/10259873/pexels-photo-10259873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=600&w=500',
    icon: '👞',
  },
  {
    key: 'accessories',
    image: 'https://images.pexels.com/photos/13273982/pexels-photo-13273982.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=600&w=500',
    icon: '⌚',
  },
  {
    key: 'sportswear',
    image: 'https://images.pexels.com/photos/29205183/pexels-photo-29205183.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500',
    icon: '🏋️',
  },
  {
    key: 'outerwear',
    image: 'https://images.pexels.com/photos/6461703/pexels-photo-6461703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500',
    icon: '🧥',
  },
];

export default function Categories({ onNavigate }: CategoriesProps) {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <section className={`py-20 lg:py-28 ${isDark ? 'bg-dark' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">{t('cat.subtitle')}</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 ${isDark ? 'text-white' : 'text-primary'}`}>
            {t('cat.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {categoryData.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNavigate('products', cat.key)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={t(`cat.${cat.key}`)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <h3 className="text-white text-lg lg:text-xl font-display font-bold">
                  {t(`cat.${cat.key}`)}
                </h3>
                <div className="w-0 group-hover:w-12 h-0.5 bg-accent mt-2 transition-all duration-500" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
