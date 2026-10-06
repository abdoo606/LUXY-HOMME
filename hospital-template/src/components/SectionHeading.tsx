import { motion } from 'framer-motion';

interface SectionHeadingProps {
  sub: string;
  title: string;
  desc?: string;
  light?: boolean;
  align?: 'center' | 'start';
}

export default function SectionHeading({ sub, title, desc, light = false, align = 'center' }: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto items-center' : 'text-start items-start';
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55 }}
      className={`flex flex-col max-w-2xl mb-12 lg:mb-16 ${alignCls}`}
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
        {sub}
      </span>
      <h2 className={`text-3xl sm:text-4xl lg:text-[2.6rem] font-display font-bold leading-tight ${light ? 'text-white' : 'text-brand-deep'}`}>
        {title}
      </h2>
      {desc && (
        <p className={`mt-4 text-base lg:text-lg leading-relaxed ${light ? 'text-white/65' : 'text-gray-500'}`}>
          {desc}
        </p>
      )}
    </motion.div>
  );
}
