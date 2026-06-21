import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/9198316/pexels-photo-9198316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black/90 via-black/70 to-black/40' : 'bg-gradient-to-r from-white/95 via-white/80 to-white/30'}`} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 w-full pt-32 pb-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium tracking-widest mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              {t('hero.subtitle')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[0.95] mb-6 ${isDark ? 'text-white' : 'text-primary'}`}
          >
            {t('hero.title')}
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-lg ${isDark ? 'text-white/60' : 'text-gray-600'}`}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => onNavigate('products')}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium text-base transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
            >
              {t('hero.cta')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 border ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-gray-300 text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Play size={18} className="text-accent" />
              {t('hero.cta2')}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`flex gap-8 sm:gap-12 mt-16 pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
          >
            {[
              { value: '50K+', label: 'Customers' },
              { value: '200+', label: 'Products' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-accent font-display">{stat.value}</div>
                <div className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${isDark ? 'border-white/20' : 'border-gray-300'}`}
        >
          <div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
