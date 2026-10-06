import { X, Star, Globe, GraduationCap, CalendarDays, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { departments } from '../config/content';
import type { Doctor } from '../config/content';

const dayNames = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

interface Props {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export default function DoctorProfileModal({ doctor, onClose, onBook }: Props) {
  const { t, language } = useTranslation();
  const dept = doctor ? departments.find((d) => d.id === doctor.department) : null;

  return (
    <AnimatePresence>
      {doctor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] overflow-y-auto p-4 flex items-start justify-center"
        >
          <div className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            className="relative w-full max-w-2xl my-8 bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="relative h-64">
              <img src={doctor.photo} alt="" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/25 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-5 start-6 end-6">
                <p className="text-white font-display font-bold text-2xl">{doctor.name}</p>
                <p className="text-white/80 text-sm">
                  {doctor.title[language]}
                  {dept ? ` · ${dept.name[language]}` : ''}
                </p>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                  <Star size={12} className="fill-amber-500 text-amber-500" /> {doctor.rating} · {doctor.reviews} {t('doctors.reviews')}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-brand/8 text-brand text-xs font-semibold">
                  {doctor.experience}+ {t('doctors.experience')}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">{doctor.bio[language]}</p>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-brand-cream/70 border border-black/[0.04]">
                  <p className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <GraduationCap size={13} className="text-brand-accent" /> {t('doctors.education')}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{doctor.education[language]}</p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-cream/70 border border-black/[0.04]">
                  <p className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <Globe size={13} className="text-brand-accent" /> {t('doctors.languages')}
                  </p>
                  <p className="text-sm text-gray-700">{doctor.languages.join(' · ')}</p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl border border-brand-accent/20 bg-brand-accent/5">
                <p className="flex items-center gap-2 text-xs font-semibold text-brand-accent uppercase tracking-wider mb-3">
                  <CalendarDays size={13} /> {t('doctors.available')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {doctor.workingDays.map((d) => (
                    <span key={d} className="px-3.5 py-1.5 rounded-full bg-white border border-brand-accent/25 text-brand-deep text-xs font-medium">
                      {dayNames[language][d]}
                    </span>
                  ))}
                  <span className="px-3.5 py-1.5 rounded-full bg-brand text-white text-xs font-semibold" dir="ltr">
                    {doctor.hours.start} – {doctor.hours.end}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onBook(doctor)}
                className="mt-7 w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-brand-accent hover:bg-[#b8931f] text-white font-semibold shadow-lg shadow-brand-accent/25 transition-all hover:scale-[1.01]"
              >
                <CalendarPlus size={18} /> {t('doctors.book')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
