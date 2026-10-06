import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Clock, Award, HeartHandshake, CalendarPlus, Phone, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { siteConfig } from '../config/site.config';
import { departments, doctors, stats, whyUs } from '../config/content';
import SectionHeading from '../components/SectionHeading';
import StatsGrid from '../components/StatsGrid';
import DepartmentCard from '../components/DepartmentCard';
import DoctorCard from '../components/DoctorCard';
import TestimonialSlider from '../components/TestimonialSlider';
import FaqAccordion from '../components/FaqAccordion';
import PartnersMarquee from '../components/PartnersMarquee';
import BmiCalculator from '../components/BmiCalculator';
import type { Doctor } from '../config/content';

interface Props {
  onNavigate: (page: string, payload?: string) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onDoctorProfile: (doctor: Doctor) => void;
}

const whyIcons: Record<string, typeof Award> = {
  award: Award,
  clock: Clock,
  'shield-check': ShieldCheck,
  'heart-handshake': HeartHandshake,
};

export default function HomePage({ onNavigate, onBookDoctor, onDoctorProfile }: Props) {
  const { t, language } = useTranslation();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={siteConfig.photos.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/95 via-brand-deep/75 to-brand-deep/35 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/60 via-transparent to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-6 pt-32 pb-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-xs font-medium tracking-wider uppercase mb-7"
            >
              <ShieldCheck size={14} className="text-brand-accent" />
              {t('hero.badge')}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="font-display font-bold text-white leading-[1.05] text-[2.7rem] sm:text-6xl lg:text-7xl"
            >
              {t('hero.title1')}{' '}
              <span className="text-gradient">{t('hero.title2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mt-6 text-white/75 text-lg lg:text-xl leading-relaxed max-w-xl"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
              className="flex flex-wrap gap-4 mt-9"
            >
              <button
                onClick={() => onNavigate('appointment')}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white font-semibold shadow-[0_18px_45px_-10px_rgba(201,162,39,0.55)] transition-all hover:scale-[1.03]"
              >
                <CalendarPlus size={19} />
                {t('hero.cta')}
              </button>
              <button
                onClick={() => onNavigate('departments')}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/25 text-white hover:bg-white/10 font-semibold transition-colors"
              >
                {t('hero.cta2')}
                <ArrowRight size={18} className="rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* trust mini-cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-3 mt-12"
            >
              {[
                { icon: ShieldCheck, text: 'JCI Accredited' },
                { icon: Clock, text: '24/7 Emergency' },
                { icon: Sparkles, text: '50K+ Patients / Year' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass text-white/85 text-xs font-medium">
                  <item.icon size={14} className="text-brand-accent" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <div className="w-[26px] h-11 rounded-full border-2 border-white/30 flex justify-center pt-2.5">
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-1 h-2 rounded-full bg-white/80"
            />
          </div>
        </motion.div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative -mt-14 z-10 max-w-6xl mx-auto px-4 lg:px-6">
        <div className="rounded-[2rem] bg-brand-deep p-6 lg:p-8 shadow-[0_30px_80px_-20px_rgba(10,43,38,0.45)]">
          <StatsGrid items={stats} lang={language} />
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="py-24 bg-brand-cream/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <SectionHeading sub={t('home.whySub')} title={t('home.why')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => {
              const Icon = whyIcons[item.icon] || Award;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-3xl p-7 hover-lift border border-black/[0.04]"
                >
                  <div className="w-13 h-13 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-5">
                    <Icon size={23} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-deep">{item.title[language]}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc[language]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DEPARTMENTS ============ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <SectionHeading sub={t('home.departmentsSub')} title={t('home.departments')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.slice(0, 4).map((d, i) => (
              <DepartmentCard key={d.id} department={d} lang={language} index={i} onSelect={(id) => onNavigate('departments', id)} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('departments')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-brand/20 text-brand font-semibold hover:bg-brand hover:text-white hover:border-brand transition-all"
            >
              {t('home.viewAll')} <ChevronRight size={17} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ BMI + APPOINTMENT CTA ============ */}
      <section className="py-20 bg-brand-cream/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <BmiCalculator lang={language} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden min-h-[380px] flex"
          >
            <img src={siteConfig.photos.appointment} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/92 via-brand-deep/55 to-transparent" />
            <div className="relative mt-auto p-8 lg:p-10">
              <h3 className="font-display font-bold text-white text-2xl lg:text-3xl leading-tight">
                {t('home.ctaTitle')}
              </h3>
              <p className="mt-3 text-white/75">{t('home.ctaDesc')}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => onNavigate('appointment')}
                  className="px-7 py-3.5 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white font-semibold shadow-lg shadow-brand-accent/30 transition-all hover:scale-[1.03]"
                >
                  {t('home.ctaBtn')}
                </button>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 font-semibold transition-colors"
                >
                  <Phone size={17} /> <span dir="ltr">{siteConfig.contact.phone}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ DOCTORS ============ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <SectionHeading sub={t('home.doctorsSub')} title={t('home.doctors')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} lang={language} index={i} onBook={onBookDoctor} onProfile={onDoctorProfile} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-brand/20 text-brand font-semibold hover:bg-brand hover:text-white hover:border-brand transition-all"
            >
              {t('home.viewAll')} <ChevronRight size={17} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 bg-brand-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, var(--brand-accent) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--brand-primary) 0, transparent 45%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <SectionHeading sub={t('home.testimonialsSub')} title={t('home.testimonials')} light />
          <TestimonialSlider lang={language} />
        </div>
      </section>

      {/* ============ INSURANCE ============ */}
      <section className="py-14 border-y border-black/5">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mb-2">
          {t('home.insurance')}
        </p>
        <PartnersMarquee />
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-24 bg-brand-cream/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <SectionHeading sub={t('home.faqSub')} title={t('home.faq')} />
          <FaqAccordion lang={language} />
          <p className="text-center mt-8 text-gray-500 text-sm">{t('faq.more')}</p>
        </div>
      </section>
    </>
  );
}
