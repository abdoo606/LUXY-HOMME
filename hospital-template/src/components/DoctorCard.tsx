import { motion } from 'framer-motion';
import { Star, CalendarPlus, Eye, Globe } from 'lucide-react';
import type { Doctor } from '../config/content';
import type { Lang } from '../config/site.config';
import { departments } from '../config/content';

interface Props {
  doctor: Doctor;
  lang: Lang;
  onBook: (doctor: Doctor) => void;
  onProfile: (doctor: Doctor) => void;
  index?: number;
}

export default function DoctorCard({ doctor, lang, onBook, onProfile, index = 0 }: Props) {
  const dept = departments.find((d) => d.id === doctor.department);
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-16px_rgba(10,43,38,0.16)] hover-lift"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 start-4 end-4 flex items-end justify-between">
          <div>
            <p className="text-white font-display font-bold text-lg leading-tight">{doctor.name}</p>
            <p className="text-white/80 text-xs">{doctor.title[lang]}</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25">
            <Star size={11} className="text-amber-300 fill-amber-300" />
            <span className="text-white text-xs font-semibold">{doctor.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {dept && (
            <span className="px-2.5 py-1 rounded-full bg-brand/8 text-brand text-[11px] font-semibold">
              {dept.name[lang]}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[11px] font-semibold">
            {doctor.experience}+ {lang === 'ar' ? 'سنة' : 'yrs'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Globe size={12} className="text-brand-accent" />
          {doctor.languages.join(' · ')}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onBook(doctor)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand hover:bg-brand-deep text-white text-sm font-semibold transition-colors"
          >
            <CalendarPlus size={15} />
            {lang === 'ar' ? 'حجز' : 'Book'}
          </button>
          <button
            onClick={() => onProfile(doctor)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-brand hover:text-brand text-sm font-semibold text-gray-600 transition-colors"
          >
            <Eye size={15} />
            {lang === 'ar' ? 'الملف' : 'Profile'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
