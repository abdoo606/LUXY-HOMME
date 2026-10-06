import { motion } from 'framer-motion';
import { Award, Gem, Globe, ShieldCheck, HeartPulse, Microscope, Users } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { siteConfig } from '../config/site.config';
import { stats, timeline } from '../config/content';
import SectionHeading from '../components/SectionHeading';
import StatsGrid from '../components/StatsGrid';

export default function AboutPage() {
  const { t, language } = useTranslation();

  const values = [
    { icon: HeartPulse, title: { en: 'Compassion', ar: 'الرحمة' }, desc: { en: 'Every patient is treated as family.', ar: 'كل مريض يعامل كأنه من العائلة.' } },
    { icon: Microscope, title: { en: 'Innovation', ar: 'الابتكار' }, desc: { en: 'We invest in the technology that heals better.', ar: 'نستثمر في التقنيات التي تشفّي بشكل أفضل.' } },
    { icon: ShieldCheck, title: { en: 'Safety', ar: 'السلامة' }, desc: { en: 'International protocols at every step.', ar: 'بروتوكولات دولية في كل خطوة.' } },
    { icon: Users, title: { en: 'Teamwork', ar: 'العمل الجماعي' }, desc: { en: 'Multidisciplinary teams, one shared goal.', ar: 'فرق متعددة التخصصات وهدف واحد.' } },
  ];

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(circle at 15% 30%, var(--brand-accent) 0, transparent 35%), radial-gradient(circle at 85% 60%, var(--brand-primary) 0, transparent 40%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('about.sub')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              {t('about.title')}
            </h1>
            <p className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed">
              {siteConfig.brand.tagline[language]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img src={siteConfig.photos.about} alt="" className="rounded-[2rem] w-full h-[480px] object-cover shadow-[0_30px_80px_-24px_rgba(10,43,38,0.4)]" />
            <div className="absolute -bottom-7 end-7 bg-white rounded-3xl shadow-2xl px-8 py-6 border border-black/5">
              <p className="font-display font-bold text-4xl text-brand">25+</p>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mt-1">{t('hero.stat1')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-deep leading-tight">
              {t('about.mission')}
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed text-lg">{t('about.missionText')}</p>

            <div className="hairline my-8" />

            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-deep leading-tight">
              {t('about.vision')}
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed text-lg">{t('about.visionText')}</p>

            <div className="mt-8 p-6 rounded-2xl bg-brand-cream/70 border border-brand-accent/15">
              <p className="text-gray-600 leading-relaxed">{t('about.p1')}</p>
              <p className="text-gray-600 leading-relaxed mt-3">{t('about.p2')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-cream/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <SectionHeading sub="OUR VALUES" title={t('about.values')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 hover-lift border border-black/[0.04]"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/12 text-brand-accent flex items-center justify-center mb-5">
                  <v.icon size={21} />
                </div>
                <h3 className="font-display font-bold text-lg text-brand-deep">{v.title[language]}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{v.desc[language]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <SectionHeading sub="OUR JOURNEY" title={t('about.timeline')} />
          <div className="relative">
            <div className="absolute top-0 bottom-0 start-[22px] w-[2px] bg-gradient-to-b from-brand-accent via-brand to-transparent" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex gap-6"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-accent shadow-lg flex items-center justify-center">
                      <Award size={17} className="text-brand-accent" />
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <p className="font-display font-bold text-2xl text-brand">{item.year}</p>
                    <p className="mt-1.5 text-gray-500 leading-relaxed">{item.text[language]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="rounded-[2rem] bg-brand-deep p-8 lg:p-10">
            <div className="flex items-center justify-center gap-2 mb-8 text-white/50 text-xs uppercase tracking-[0.22em]">
              <Gem size={14} className="text-brand-accent" /> {t('about.stats')}
            </div>
            <StatsGrid items={stats} lang={language} />
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {[Globe, ShieldCheck, Award].map((Icon, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 text-white/55 text-xs">
                  <Icon size={13} className="text-brand-accent" />
                  {['JCI Accredited', 'ISO 9001 Certified', 'Best Private Hospital Award'][i]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
