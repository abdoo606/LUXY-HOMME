import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { departments } from '../config/content';
import { useAdminStore } from '../store/adminStore';
import DoctorCard from '../components/DoctorCard';
import type { Doctor } from '../config/content';

interface Props {
  onBookDoctor: (doctor: Doctor) => void;
  onDoctorProfile: (doctor: Doctor) => void;
}

export default function DoctorsPage({ onBookDoctor, onDoctorProfile }: Props) {
  const { t, language } = useTranslation();
  const getDoctors = useAdminStore((s) => s.getDoctors);
  const doctors = getDoctors();
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? doctors : doctors.filter((d) => d.department === filter)),
    [filter, doctors]
  );

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 40%, var(--brand-accent) 0, transparent 35%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('doctors.sub')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{t('doctors.title')}</h1>
            <p className="mt-4 text-white/65 text-lg max-w-2xl">{t('doctors.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pt-12 pb-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-brand text-white shadow-lg shadow-brand/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('doctors.all')}
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setFilter(d.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === d.id ? 'bg-brand text-white shadow-lg shadow-brand/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.name[language]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((doc, i) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                lang={language}
                index={i}
                onBook={onBookDoctor}
                onProfile={onDoctorProfile}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-20">{language === 'ar' ? 'لا يوجد أطباء في هذا القسم.' : 'No doctors in this department.'}</p>
          )}
        </div>
      </section>
    </>
  );
}
