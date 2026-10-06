import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, ArrowRight, Stethoscope } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { departments, doctors } from '../config/content';
import DepartmentCard from '../components/DepartmentCard';
import DoctorCard from '../components/DoctorCard';
import type { Doctor } from '../config/content';

interface Props {
  onNavigate: (page: string, payload?: string) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onDoctorProfile: (doctor: Doctor) => void;
  initialDepartment?: string | null;
}

export default function DepartmentsPage({ onNavigate, onBookDoctor, onDoctorProfile, initialDepartment }: Props) {
  const { t, language } = useTranslation();
  const [selected, setSelected] = useState<string | null>(initialDepartment ?? null);

  const dept = useMemo(() => departments.find((d) => d.id === selected) || null, [selected]);
  const deptDoctors = useMemo(
    () => (selected ? doctors.filter((d) => d.department === selected) : []),
    [selected]
  );

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, var(--brand-accent) 0, transparent 40%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('dept.sub')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{t('dept.title')}</h1>
            <p className="mt-4 text-white/65 text-lg max-w-2xl">{t('dept.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((d, i) => (
              <DepartmentCard key={d.id} department={d} lang={language} index={i} onSelect={setSelected} />
            ))}
          </div>
        </div>
      </section>

      {/* Department detail modal */}
      <AnimatePresence>
        {dept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-start justify-center"
          >
            <div className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="relative w-full max-w-3xl my-8 bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="relative h-56">
                <img src={dept.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-5 start-6 end-6">
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-white">{dept.name[language]}</h2>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <p className="text-gray-600 leading-relaxed text-lg">{dept.description[language]}</p>

                <button
                  onClick={() => { setSelected(null); onNavigate('appointment', dept.id); }}
                  className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white font-semibold shadow-lg shadow-brand-accent/25 transition-all hover:scale-[1.02]"
                >
                  <CalendarPlus size={17} /> {t('dept.book')}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>

                {deptDoctors.length > 0 && (
                  <>
                    <div className="hairline my-8" />
                    <h3 className="font-display font-bold text-lg text-brand-deep flex items-center gap-2 mb-5">
                      <Stethoscope size={18} className="text-brand-accent" />
                      {t('dept.doctors')}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {deptDoctors.map((doc, i) => (
                        <DoctorCard
                          key={doc.id}
                          doctor={doc}
                          lang={language}
                          index={i}
                          onBook={(d) => { setSelected(null); onBookDoctor(d); }}
                          onProfile={(d) => { setSelected(null); onDoctorProfile(d); }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
