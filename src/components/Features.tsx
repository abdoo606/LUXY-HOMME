import { motion } from 'framer-motion';
import { Truck, RotateCcw, Headphones, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

export default function Features() {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  const features = [
    { icon: Truck, title: t('feat.shipping'), desc: t('feat.shippingDesc') },
    { icon: RotateCcw, title: t('feat.returns'), desc: t('feat.returnsDesc') },
    { icon: Headphones, title: t('feat.support'), desc: t('feat.supportDesc') },
    { icon: Shield, title: t('feat.secure'), desc: t('feat.secureDesc') },
  ];

  return (
    <section className={`py-16 ${isDark ? 'bg-dark-surface' : 'bg-light'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                isDark ? 'bg-dark-card hover:bg-dark-card/80' : 'bg-white hover:shadow-gray-200/50'
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <feat.icon size={24} className="text-accent" />
              </div>
              <h3 className={`font-bold text-sm lg:text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {feat.title}
              </h3>
              <p className={`text-xs lg:text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
