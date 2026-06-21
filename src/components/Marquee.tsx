import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';

export default function Marquee() {
  const { t } = useTranslation();
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  const items = [
    t('feat.shipping'),
    '★',
    t('prod.authentic'),
    '★',
    t('feat.returns'),
    '★',
    t('feat.secure'),
    '★',
    t('feat.support'),
    '★',
  ];

  const repeated = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden py-3 ${isDark ? 'bg-accent/5 border-y border-accent/10' : 'bg-accent/5 border-y border-accent/10'}`}>
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`mx-4 text-xs font-medium tracking-widest uppercase ${
              item === '★' ? 'text-accent' : isDark ? 'text-white/40' : 'text-gray-500'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
