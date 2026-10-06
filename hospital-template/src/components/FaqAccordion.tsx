import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqs } from '../config/content';
import type { Lang } from '../config/site.config';

export default function FaqAccordion({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl border transition-colors overflow-hidden ${
              isOpen ? 'border-brand-accent/50 bg-white shadow-[0_12px_40px_-16px_rgba(10,43,38,0.15)]' : 'border-gray-200 bg-white/70'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start"
            >
              <span className={`font-semibold ${isOpen ? 'text-brand' : 'text-brand-deep'}`}>
                {faq.question[lang]}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isOpen ? 'bg-brand text-white rotate-180' : 'bg-brand/8 text-brand'
                }`}
              >
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{faq.answer[lang]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
