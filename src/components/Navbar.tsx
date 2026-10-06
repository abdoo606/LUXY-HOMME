import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Moon, Sun, Globe, ChevronDown, Heart, User } from 'lucide-react';
import { useStore, currencies } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import { languages } from '../i18n/translations';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { t } = useTranslation();
  const {
    theme, toggleTheme,
    language, setLanguage,
    currency, setCurrency,
    getCartCount,
    isMobileMenuOpen, setMobileMenuOpen,
    wishlist,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [currDropdown, setCurrDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'home', label: t('nav.home'), page: 'home' },
    { key: 'products', label: t('nav.products'), page: 'products' },
    { key: 'about', label: t('nav.about'), page: 'about' },
    { key: 'contact', label: t('nav.contact'), page: 'contact' },
  ];

  const isDark = theme === 'dark';
  const cartCount = getCartCount();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDark
              ? 'bg-dark/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
              : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-black/5'
            : 'bg-transparent'
        }`}
      >
        {/* Top Bar */}
        <div className={`hidden lg:block text-xs py-1.5 transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden py-0' : ''} ${isDark ? 'bg-accent/10 text-accent' : 'bg-accent/10 text-accent-dark'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>{t('feat.shipping')} • {t('feat.shippingDesc')}</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => { setLangDropdown(!langDropdown); setCurrDropdown(false); }}
                  className="flex items-center gap-1 hover:text-accent-light transition-colors"
                >
                  <Globe size={12} />
                  <span>{languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.nativeName}</span>
                  <ChevronDown size={10} />
                </button>
                <AnimatePresence>
                  {langDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`absolute top-full mt-2 ${language === 'ar' ? 'left-0' : 'right-0'} rounded-lg shadow-xl overflow-hidden z-50 min-w-[180px] ${isDark ? 'bg-dark-card border border-white/10' : 'bg-white border border-gray-200'}`}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setLangDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors text-sm ${
                            language === lang.code
                              ? 'bg-accent/20 text-accent'
                              : isDark ? 'hover:bg-white/5 text-white/70' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => { setCurrDropdown(!currDropdown); setLangDropdown(false); }}
                  className="flex items-center gap-1 hover:text-accent-light transition-colors"
                >
                  <span>{currencies.find(c => c.code === currency)?.symbol} {currency}</span>
                  <ChevronDown size={10} />
                </button>
                <AnimatePresence>
                  {currDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`absolute top-full mt-2 ${language === 'ar' ? 'left-0' : 'right-0'} rounded-lg shadow-xl overflow-hidden z-50 min-w-[160px] ${isDark ? 'bg-dark-card border border-white/10' : 'bg-white border border-gray-200'}`}
                    >
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCurrency(c.code); setCurrDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-left flex items-center gap-2 transition-colors text-sm ${
                            currency === c.code
                              ? 'bg-accent/20 text-accent'
                              : isDark ? 'hover:bg-white/5 text-white/70' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{c.symbol}</span>
                          <span>{c.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg font-display">L</span>
              </div>
              <div>
                <h1 className={`text-xl lg:text-2xl font-bold font-display tracking-wider ${isDark ? 'text-white' : 'text-primary'}`}>
                  LUXE <span className="text-accent">HOMME</span>
                </h1>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => onNavigate(link.page)}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors ${
                    currentPage === link.page
                      ? 'text-accent'
                      : isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {currentPage === link.page && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => onNavigate('search')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Search size={20} />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors hidden sm:block ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className={`p-2 rounded-lg transition-colors relative hidden sm:block ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className={`p-2 rounded-lg transition-colors relative ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => onNavigate('account')}
                className={`p-2 rounded-lg transition-colors hidden sm:block ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <User size={20} />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors lg:hidden ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: language === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-80 h-full ${isDark ? 'bg-dark' : 'bg-white'} shadow-2xl overflow-y-auto`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    LUXE <span className="text-accent">HOMME</span>
                  </h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={24} className={isDark ? 'text-white' : 'text-gray-900'} />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.key}
                      onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        currentPage === link.page
                          ? 'bg-accent/10 text-accent'
                          : isDark ? 'text-white/70 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{isDark ? t('theme.dark') : t('theme.light')}</span>
                    <button onClick={toggleTheme} className="p-2 rounded-lg bg-accent/10 text-accent">
                      {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>

                  <div className="mb-4">
                    <span className={`text-sm font-medium block mb-2 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{t('general.language')}</span>
                    <div className="grid grid-cols-2 gap-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                            language === lang.code
                              ? 'bg-accent text-white'
                              : isDark ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={`text-sm font-medium block mb-2 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{t('general.currency')}</span>
                    <div className="grid grid-cols-3 gap-1">
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setCurrency(c.code)}
                          className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                            currency === c.code
                              ? 'bg-accent text-white'
                              : isDark ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {c.symbol} {c.code}
                        </button>
                      ))}
                    </div>
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
