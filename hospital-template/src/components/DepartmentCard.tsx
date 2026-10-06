import { motion } from 'framer-motion';
import { HeartPulse, Brain, Bone, Ribbon, Baby, Flower2, Eye, Sparkles, ArrowRight } from 'lucide-react';
import type { Department } from '../config/content';
import type { Lang } from '../config/site.config';

const iconMap: Record<string, typeof HeartPulse> = {
  'heart-pulse': HeartPulse,
  brain: Brain,
  bone: Bone,
  ribbon: Ribbon,
  baby: Baby,
  'flower-2': Flower2,
  eye: Eye,
  sparkles: Sparkles,
};

interface Props {
  department: Department;
  lang: Lang;
  onSelect: (id: string) => void;
  index?: number;
}

export default function DepartmentCard({ department, lang, onSelect, index = 0 }: Props) {
  const Icon = iconMap[department.icon] || HeartPulse;
  return (
    <motion.button
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={() => onSelect(department.id)}
      className="group relative overflow-hidden rounded-3xl text-start hover-lift bg-white shadow-[0_10px_40px_-16px_rgba(10,43,38,0.18)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={department.image}
          alt={department.name[lang]}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-brand-deep/25 to-transparent" />
        <div className="absolute top-4 start-4 w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-lg text-brand-deep group-hover:text-brand transition-colors">
          {department.name[lang]}
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3">{department.description[lang]}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent">
          {lang === 'ar' ? 'اكتشف المزيد' : 'Learn more'}
          <ArrowRight size={15} className="rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </div>
      </div>
    </motion.button>
  );
}
