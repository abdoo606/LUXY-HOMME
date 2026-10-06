import { Ambulance } from 'lucide-react';
import { siteConfig } from '../config/site.config';
import { useTranslation } from '../hooks/useTranslation';

/** Floating 24/7 emergency call button with pulse ring */
export default function EmergencyButton() {
  const { t } = useTranslation();
  return (
    <a
      href={`tel:${siteConfig.contact.emergency}`}
      className="fixed bottom-6 end-6 z-40 flex items-center gap-2.5 px-5 py-4 rounded-full bg-red-600 text-white shadow-[0_16px_40px_-8px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:scale-105 transition-all group"
    >
      <span className="relative flex items-center justify-center w-6 h-6 text-red-600">
        <span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" />
        <Ambulance size={18} className="relative z-10 text-white" />
      </span>
      <div className="leading-tight hidden sm:block">
        <p className="text-[10px] uppercase tracking-wider opacity-80">{t('top.emergency')}</p>
        <p className="text-sm font-bold" dir="ltr">{siteConfig.contact.emergency}</p>
      </div>
    </a>
  );
}
