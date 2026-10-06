import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Lang } from '../config/site.config';

interface Stat {
  value: number;
  suffix: string;
  label: Record<Lang, string>;
}

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

function StatCard({ stat, index, lang }: { stat: Stat; index: number; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const value = useCountUp(stat.value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.55 }}
      className="text-center px-4 py-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-accent/40 transition-colors"
    >
      <div className="font-display font-bold text-4xl lg:text-5xl text-white">
        {value}
        <span className="text-brand-accent">{stat.suffix}</span>
      </div>
      <p className="mt-2 text-white/60 text-sm lg:text-base">{stat.label[lang]}</p>
    </motion.div>
  );
}

export default function StatsGrid({ items, lang }: { items: Stat[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {items.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} lang={lang} />
      ))}
    </div>
  );
}
