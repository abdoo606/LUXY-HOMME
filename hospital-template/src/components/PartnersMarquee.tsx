import { insurance } from '../config/content';

/** Infinite marquee of insurance partner names (styled as wordmarks) */
export default function PartnersMarquee() {
  const row = [...insurance, ...insurance];
  return (
    <div className="overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex gap-14 w-max animate-marquee">
        {row.map((name, i) => (
          <span
            key={i}
            className="text-xl lg:text-2xl font-display font-semibold text-gray-300 hover:text-brand-accent transition-colors whitespace-nowrap tracking-wide"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
