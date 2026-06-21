import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

export default function Newsletter() {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/33574357/pexels-photo-33574357.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 lg:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-primary'}`}>
            {t('news.title')}
          </h2>
          <p className={`text-base lg:text-lg mb-8 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {t('news.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('news.placeholder')}
              className={`flex-1 px-5 py-4 rounded-xl text-base outline-none transition-colors ${
                isDark
                  ? 'bg-white/10 text-white placeholder:text-white/30 focus:bg-white/15 border border-white/10'
                  : 'bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-accent border border-gray-200'
              }`}
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-accent/25"
            >
              {submitted ? (
                <>
                  <Check size={18} />
                  {t('news.success')}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t('news.subscribe')}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
