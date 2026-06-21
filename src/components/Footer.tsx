import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <footer className={`${isDark ? 'bg-[#0a0a0a] border-t border-white/5' : 'bg-gray-900 border-t border-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">L</span>
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                LUXE <span className="text-accent">HOMME</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {t('footer.aboutDesc')}
            </p>
            <div className="flex gap-3">
              {['𝕏', 'f', 'in', '📷'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-accent/20 flex items-center justify-center text-white/40 hover:text-accent transition-colors text-sm font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), page: 'home' },
                { label: t('nav.products'), page: 'products' },
                { label: t('nav.about'), page: 'about' },
                { label: t('nav.contact'), page: 'contact' },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-white/40 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-3">
              {[
                t('footer.faq'),
                t('footer.shippingInfo'),
                t('footer.returnPolicy'),
                t('footer.sizeGuide'),
                t('footer.privacy'),
                t('footer.terms'),
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-accent transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('checkout.payment')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Visa', bg: 'bg-blue-600' },
                { name: 'MC', bg: 'bg-red-600' },
                { name: 'PayPal', bg: 'bg-blue-500' },
                { name: 'Apple', bg: 'bg-gray-700' },
                { name: 'Google', bg: 'bg-green-600' },
                { name: 'Stripe', bg: 'bg-purple-600' },
                { name: 'BTC', bg: 'bg-orange-500' },
                { name: 'Bank', bg: 'bg-teal-600' },
                { name: 'COD', bg: 'bg-accent' },
              ].map((pm) => (
                <div
                  key={pm.name}
                  className={`${pm.bg} rounded-lg py-2 px-3 text-center text-white text-[10px] font-bold`}
                >
                  {pm.name}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-white/60 text-sm mb-2">{t('contact.phone')}</h4>
              <p className="text-accent font-medium">+1 (555) 123-4567</p>
              <h4 className="text-white/60 text-sm mt-3 mb-2">{t('checkout.email')}</h4>
              <p className="text-accent font-medium text-sm">abdu1rhmant2le@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2025 LUXE HOMME. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="text-white/20 text-xs hover:text-accent transition-colors"
            >
              Admin Panel
            </button>
            <p className="text-white/20 text-xs">
              Made with ❤️ for modern gentlemen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
