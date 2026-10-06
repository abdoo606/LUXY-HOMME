import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { siteConfig } from '../config/site.config';

type Filter = 'all' | 'facility' | 'care' | 'team';

export default function GalleryPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Photos from site.config — clients replace these with their own
  const photos = siteConfig.photos.gallery.map((src, i) => ({
    src,
    // demo categories cycle — edit freely per client
    category: (['facility', 'care', 'team', 'facility'] as const)[i % 4],
    span: i % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : '',
  }));

  const visible = filter === 'all' ? photos : photos.filter((p) => p.category === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('gallery.filter.all') },
    { key: 'facility', label: t('gallery.filter.facility') },
    { key: 'care', label: t('gallery.filter.care') },
    { key: 'team', label: t('gallery.filter.team') },
  ];

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 30%, var(--brand-accent) 0, transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('gallery.sub')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{t('gallery.title')}</h1>
            <p className="mt-4 text-white/65 text-lg max-w-2xl">{t('gallery.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pt-12 pb-2">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === f.key ? 'bg-brand text-white shadow-lg shadow-brand/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[190px] gap-4">
            {visible.map((photo, i) => (
              <motion.button
                key={`${filter}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setLightbox(i)}
                className={`group relative overflow-hidden rounded-3xl ${photo.span}`}
              >
                <img src={photo.src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-brand-deep/0 group-hover:bg-brand-deep/35 transition-colors duration-400 flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full bg-white/0 group-hover:bg-white/90 text-transparent group-hover:text-brand-deep flex items-center justify-center transition-all duration-400">
                    <ZoomIn size={18} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-brand-deep/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 end-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setLightbox((i) => ((i ?? 0) - 1 + visible.length) % visible.length)}
              className="absolute start-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              src={visible[lightbox]?.src}
              alt=""
              className="max-w-[88vw] max-h-[82vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightbox((i) => ((i ?? 0) + 1) % visible.length)}
              className="absolute end-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={20} className="rtl:rotate-180" />
            </button>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs">
              {lightbox + 1} / {visible.length} · {siteConfig.brand.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
