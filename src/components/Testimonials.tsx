import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Testimonials() {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  const testimonials = [
    {
      name: 'James Richardson',
      role: 'Business Executive',
      text: 'LUXE HOMME has completely transformed my wardrobe. The quality of their suits is unmatched, and the fit is always perfect.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Ahmed Al-Rashid',
      role: 'Entrepreneur',
      text: 'من أفضل المتاجر التي تعاملت معها. جودة عالية وخدمة ممتازة. أنصح بشدة!',
      rating: 5,
      avatar: '🧔',
    },
    {
      name: 'Pierre Dubois',
      role: 'Creative Director',
      text: "L'élégance et la qualité de LUXE HOMME sont remarquables. Chaque pièce est un chef-d'œuvre.",
      rating: 5,
      avatar: '👨‍🎨',
    },
  ];

  return (
    <section className={`py-20 lg:py-28 ${isDark ? 'bg-dark-surface' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">TESTIMONIALS</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 ${isDark ? 'text-white' : 'text-primary'}`}>
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`p-8 rounded-2xl relative ${isDark ? 'bg-dark-card' : 'bg-light-surface'}`}
            >
              <Quote size={32} className="text-accent/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
