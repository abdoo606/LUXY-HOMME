import { motion } from 'framer-motion';
import { Award, Users, Globe, Gem } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">{t('about.subtitle')}</span>
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 ${isDark ? 'text-white' : 'text-primary'}`}>
            {t('about.title')}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="https://images.pexels.com/photos/11210196/pexels-photo-11210196.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
              alt="About"
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <p className={`text-base lg:text-lg leading-relaxed mb-6 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {t('about.p1')}
            </p>
            <p className={`text-base lg:text-lg leading-relaxed mb-8 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {t('about.p2')}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Award, title: t('about.mission'), desc: t('about.missionText') },
                { icon: Gem, title: t('about.vision'), desc: t('about.visionText') },
              ].map((item) => (
                <div key={item.title} className={`p-5 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                  <item.icon size={28} className="text-accent mb-3" />
                  <h3 className={`font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '50K+', label: t('about.customers'), icon: Users },
            { value: '200+', label: t('about.products'), icon: Gem },
            { value: '30+', label: t('about.countries'), icon: Globe },
            { value: '15+', label: t('about.awards'), icon: Award },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`text-center p-8 rounded-2xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}
            >
              <stat.icon size={32} className="text-accent mx-auto mb-4" />
              <div className="text-3xl lg:text-4xl font-bold text-accent font-display mb-2">{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
