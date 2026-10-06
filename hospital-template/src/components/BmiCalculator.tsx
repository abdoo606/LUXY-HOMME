import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale } from 'lucide-react';
import type { Lang } from '../config/site.config';

const categories = [
  { max: 18.5, label: { en: 'Underweight', ar: 'نحافة' }, color: 'text-sky-500' },
  { max: 25, label: { en: 'Normal', ar: 'وزن طبيعي' }, color: 'text-emerald-500' },
  { max: 30, label: { en: 'Overweight', ar: 'زيادة وزن' }, color: 'text-amber-500' },
  { max: 99, label: { en: 'Obese', ar: 'سمنة' }, color: 'text-red-500' },
];

export default function BmiCalculator({ lang }: { lang: Lang }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calc = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) setBmi(Math.round((w / (h * h)) * 10) / 10);
  };

  const category = bmi ? categories.find((c) => bmi < c.max) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white p-8 shadow-[0_16px_50px_-18px_rgba(10,43,38,0.22)] border border-brand-accent/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-brand-accent/12 text-brand-accent flex items-center justify-center">
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-brand-deep">BMI Calculator</h3>
          <p className="text-xs text-gray-500">
            {lang === 'ar' ? 'احسب مؤشر كتلة الجسم في ثوانٍ' : 'Check your body mass index in seconds'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs font-medium text-gray-500 block mb-1.5">
            {lang === 'ar' ? 'الطول (سم)' : 'Height (cm)'}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs font-medium text-gray-500 block mb-1.5">
            {lang === 'ar' ? 'الوزن (كغ)' : 'Weight (kg)'}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="72"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
          />
        </div>
        <button
          onClick={calc}
          className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-deep text-white text-sm font-semibold transition-colors"
        >
          {lang === 'ar' ? 'احسب' : 'Calculate'}
        </button>
      </div>

      {bmi !== null && category && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-brand-cream/70 border border-gray-100"
        >
          <Scale size={22} className="text-brand" />
          <div>
            <p className={`text-2xl font-display font-bold ${category.color}`}>BMI {bmi}</p>
            <p className="text-sm text-gray-600">{category.label[lang]}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
