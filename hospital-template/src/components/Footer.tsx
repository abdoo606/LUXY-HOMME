import { Phone, Mail, MapPin, HeartPulse, ShieldCheck, Award, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { siteConfig } from '../config/site.config';
import { departments } from '../config/content';

interface FooterProps {
  onNavigate: (page: string) => void;
}

// Lucide dropped brand icons — use clean letter marks instead
const socialIcons = [
  { label: 'f', url: siteConfig.social.facebook },
  { label: 'IG', url: siteConfig.social.instagram },
  { label: 'in', url: siteConfig.social.linkedin },
  { label: 'X', url: siteConfig.social.x },
  { label: 'YT', url: siteConfig.social.youtube },
];

export default function Footer({ onNavigate }: FooterProps) {
  const { t, language } = useTranslation();

  return (
    <footer className="bg-brand-deep text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center font-display font-bold text-xl text-brand-accent">
                {siteConfig.brand.logoText}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">{siteConfig.brand.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-accent">{siteConfig.brand.tagline[language]}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">{t('footer.about')}</p>
            <div className="flex gap-2.5">
              {socialIcons.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/8 hover:bg-brand-accent flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110 text-xs font-bold"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {[ShieldCheck, Award, HeartPulse, Clock].map((Icon, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-[10px] text-white/50 uppercase tracking-wider">
                  <Icon size={11} className="text-brand-accent" />
                  {['JCI', 'ISO 9001', '24/7 Care', 'Since 2001'][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-base mb-5">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {[
                { label: t('nav.home'), page: 'home' },
                { label: t('nav.about'), page: 'about' },
                { label: t('nav.doctors'), page: 'doctors' },
                { label: t('nav.gallery'), page: 'gallery' },
                { label: t('nav.appointment'), page: 'appointment' },
                { label: t('nav.contact'), page: 'contact' },
              ].map((link) => (
                <li key={link.page}>
                  <button onClick={() => onNavigate(link.page)} className="text-white/55 hover:text-brand-accent transition-colors text-sm">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="font-semibold text-base mb-5">{t('nav.departments')}</h3>
            <ul className="space-y-2.5">
              {departments.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <button onClick={() => onNavigate('departments')} className="text-white/55 hover:text-brand-accent transition-colors text-sm">
                    {d.name[language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-5">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-accent mt-0.5 flex-shrink-0" />
                <span className="text-white/60">{siteConfig.contact.address[language]}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-accent flex-shrink-0" />
                <a href={`tel:${siteConfig.contact.phone}`} className="text-white/60 hover:text-white" dir="ltr">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-accent flex-shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="text-white/60 hover:text-white">{siteConfig.contact.email}</a>
              </li>
            </ul>
            <div className="mt-5 space-y-2">
              {siteConfig.hours.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-white/50">{h.days[language]}</span>
                  <span className="text-white/80 font-medium" dir="ltr">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hairline my-8 opacity-30" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {new Date().getFullYear()} {siteConfig.brand.fullName}. {t('footer.rights')}</p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
