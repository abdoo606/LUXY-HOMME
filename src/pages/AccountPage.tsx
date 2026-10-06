import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/adminStore';
import { useTranslation } from '../hooks/useTranslation';

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const { t } = useTranslation();
  const { theme, isAuthenticated, user, login, logout, wishlist } = useStore();
  const { orders } = useAdminStore();
  const isDark = theme === 'dark';
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || 'John Doe', email || 'john@luxehomme.com');
  };

  if (isAuthenticated && user) {
    return (
      <section className={`pt-28 lg:pt-36 pb-20 min-h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`p-8 rounded-2xl mb-8 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <User size={28} className="text-accent" />
                </div>
                <div>
                  <h2 className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.name}
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{user.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Package, label: t('account.orders'), count: orders.length },
                  { icon: Heart, label: t('wishlist.title'), count: wishlist.length, page: 'wishlist' },
                  { icon: Settings, label: t('account.settings'), count: 0 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.page && onNavigate(item.page)}
                    className={`p-5 rounded-xl flex items-center gap-4 transition-colors ${
                      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={22} className="text-accent" />
                    <div className="text-left">
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                      {item.count > 0 && (
                        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{item.count} {t('cart.items')}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              {t('auth.logout')}
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`pt-28 lg:pt-36 pb-20 min-h-screen flex items-center justify-center ${isDark ? 'bg-dark' : 'bg-light'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className={`p-8 rounded-2xl ${isDark ? 'bg-dark-card' : 'bg-white shadow-lg'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-accent" />
            </div>
            <h2 className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isLogin ? t('auth.login') : t('auth.register')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                  {t('contact.name')}
                </label>
                <div className="relative">
                  <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none ${
                      isDark
                        ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                        : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                {t('checkout.email')}
              </label>
              <div className="relative">
                <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none ${
                    isDark
                      ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                      : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium mb-1.5 block ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                <input
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none ${
                    isDark
                      ? 'bg-white/5 text-white border border-white/10 focus:border-accent'
                      : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-accent text-sm hover:underline">{t('auth.forgotPassword')}</a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25"
            >
              {isLogin ? t('auth.login') : t('auth.register')}
            </button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">
              {isLogin ? t('auth.register') : t('auth.login')}
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
