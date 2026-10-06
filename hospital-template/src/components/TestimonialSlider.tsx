import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../config/content';
import type { Lang } from '../config/site.config';

export default function TestimonialSlider({ lang }: { lang: Lang }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const item = testimonials[index];

  return (
    <div
      className="relative max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -top-6 start-6 text-brand-accent/20">
        <Quote size={90} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.45 }}
          className="text-center px-4"
        >
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} size={18} className="text-brand-accent fill-brand-accent" />
            ))}
          </div>
          <p className={`text-lg lg:text-2xl leading-relaxed font-light ${lang === 'ar' ? 'leading-[2.2]' : ''} text-white/90`}>
            “{item.text[lang]}”
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
              {item.avatar}
            </span>
            <div className="text-start">
              <p className="text-white font-semibold">{item.name}</p>
              <p className="text-white/50 text-xs">{item.country}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-10">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center"
        >
          <ChevronLeft size={18} className="rtl:rotate-180" />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-brand-accent' : 'w-2.5 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center"
        >
          <ChevronRight size={18} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
