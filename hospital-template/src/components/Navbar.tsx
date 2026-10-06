import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, Globe, Ambulance, CalendarPlus, User, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import { languages } from '../i18n/translations';
import { siteConfig } from '../config/site.config';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { key: 'home', labelKey: 'nav.home' },
  { key: 'about', labelKey: 'nav.about' },
  { key: 'departments', labelKey: 'nav.departments' },
  { key: 'doctors', labelKey: 'nav.doctors' },
  { key: 'gallery', labelKey: 'nav.gallery' },
  { key: 'contact', labelKey: 'nav.contact' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { t, language } = useTranslation();
  const { setLanguage, isMobileMenuOpen, setMobileMenuOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-brand-deep text-white/80 text-xs hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:${siteConfig.contact.emergency}`} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
              <Ambulance size={14} className="animate-pulse" />
              <span className="font-semibold">{t('top.emergency')}:</span>
              <span dir="ltr">{siteConfig.contact.emergency}</span>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={13} /> <span dir="ltr">{siteConfig.contact.phone}</span>
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={13} /> {siteConfig.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Globe size={13} />
                {languages.find((l) => l.code === language)?.nativeName}
                <ChevronDown size={11} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`absolute top-full mt-2 ${language === 'ar' ? 'left-0' : 'right-0'} bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden z-50 min-w-[140px]`}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                        className={`w-full px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                          language === l.code ? 'bg-brand/10 text-brand font-semibold' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{l.flag}</span> {l.nativeName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(10,43,38,0.15)]'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-brand/25 group-hover:scale-105 transition-transform">
                {siteConfig.brand.logoText}
              </div>
              <div className="text-start">
                <h1 className="font-display font-bold text-lg leading-tight text-brand-deep">
                  {siteConfig.brand.name}
                </h1>
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-accent font-semibold">
                  Private Healthcare
                </p>
              </div>
            </button>

            {/* Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentPage === item.key
                      ? 'text-brand bg-brand/8'
                      : 'text-gray-600 hover:text-brand hover:bg-brand/5'
                  }`}
                >
                  {t(item.labelKey)}
                  {currentPage === item.key && (
                    <motion.div layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('myAppointments')}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  currentPage === 'myAppointments' ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={t('nav.myAppointments')}
              >
                <User size={16} />
                <span className="hidden xl:inline">{t('nav.myAppointments')}</span>
              </button>
              <button
                onClick={() => onNavigate('appointment')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white text-sm font-semibold shadow-lg shadow-brand-accent/30 transition-all hover:scale-[1.03]"
              >
                <CalendarPlus size={16} />
                <span className="hidden sm:inline">{t('nav.appointment')}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 text-brand-deep"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: language === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-80 h-full bg-white shadow-2xl overflow-y-auto`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display font-bold text-xl text-brand-deep">{siteConfig.brand.name}</h2>
                  <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => { onNavigate(item.key); setMobileMenuOpen(false); }}
                      className={`w-full text-start px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        currentPage === item.key ? 'bg-brand/10 text-brand' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t(item.labelKey)}
                    </button>
                  ))}
                  <button
                    onClick={() => { onNavigate('myAppointments'); setMobileMenuOpen(false); }}
                    className="w-full text-start px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t('nav.myAppointments')}
                  </button>
                </div>
                <button
                  onClick={() => { onNavigate('appointment'); setMobileMenuOpen(false); }}
                  className="w-full mt-6 py-4 rounded-2xl bg-brand-accent text-white font-semibold shadow-lg shadow-brand-accent/30"
                >
                  {t('nav.appointment')}
                </button>
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <a href={`tel:${siteConfig.contact.emergency}`} className="flex items-center gap-2 text-red-500 font-semibold">
                    <Ambulance size={16} /> {siteConfig.contact.emergency}
                  </a>
                  <div className="flex gap-2">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`px-4 py-2 rounded-full text-sm ${
                          language === l.code ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {l.flag} {l.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
