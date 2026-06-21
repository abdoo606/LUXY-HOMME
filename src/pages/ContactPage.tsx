import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

export default function ContactPage() {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const contactInfo = [
    { icon: MapPin, title: t('contact.address'), value: '123 Fashion Avenue, New York, NY 10001' },
    { icon: Phone, title: t('contact.phone'), value: '+1 (555) 123-4567' },
    { icon: Mail, title: t('checkout.email'), value: 'abdu1rhmant2le@gmail.com' },
    { icon: Clock, title: t('contact.hours'), value: t('contact.hoursText') },
  ];

  return (
    <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">{t('contact.subtitle')}</span>
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 ${isDark ? 'text-white' : 'text-primary'}`}>
            {t('contact.title')}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className={`p-8 rounded-2xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                        : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    required
                    className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                        : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                    }`}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                      : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                  }`}
                />
              </div>
              <div className="mb-6">
                <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {t('contact.message')}
                </label>
                <textarea
                  rows={5}
                  required
                  className={`w-full px-4 py-3 rounded-lg text-sm outline-none resize-none transition-colors ${
                    isDark
                      ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                      : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/25"
              >
                {sent ? (
                  <>
                    <CheckCircle size={18} />
                    {t('general.success')}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {t('contact.send')}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex gap-4 p-6 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <info.icon size={22} className="text-accent" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {info.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    {info.value}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className={`h-64 rounded-xl overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-gray-100'}`}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={40} className="text-accent mx-auto mb-3" />
                  <p className={`font-medium ${isDark ? 'text-white/60' : 'text-gray-500'}`}>123 Fashion Avenue</p>
                  <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>New York, NY 10001</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
