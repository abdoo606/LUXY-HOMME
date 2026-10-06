import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Ambulance, MessageCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/useStore';
import { siteConfig } from '../config/site.config';
import { validateContact, hasErrors, type ContactForm, type Errors } from '../utils/validation';

const emptyForm: ContactForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const { t, language } = useTranslation();
  const addMessage = useStore((s) => s.addMessage);
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [errors, setErrors] = useState<Errors<ContactForm>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(form, t);
    setErrors(errs);
    if (hasErrors(errs)) return;
    addMessage(form);
    setSent(true);
    setForm(emptyForm);
    setTimeout(() => setSent(false), 4000);
  };

  const set = (key: keyof ContactForm, value: string) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const infoCards = [
    { icon: Phone, title: t('contact.phoneTitle'), value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}`, ltr: true },
    { icon: Mail, title: t('contact.emailTitle'), value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: MapPin, title: t('contact.addressTitle'), value: siteConfig.contact.address[language] },
    { icon: Ambulance, title: t('contact.emergencyTitle'), value: siteConfig.contact.emergency, href: `tel:${siteConfig.contact.emergency}`, ltr: true, danger: true },
  ];

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, var(--brand-accent) 0, transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('contact.sub')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{t('contact.title')}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-5 gap-10">
          {/* Info side */}
          <div className="lg:col-span-2 space-y-4">
            {infoCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-2xl bg-white border hover-lift ${card.danger ? 'border-red-200 bg-red-50/50' : 'border-black/[0.05]'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.danger ? 'bg-red-100 text-red-600' : 'bg-brand/10 text-brand'}`}>
                    <card.icon size={19} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${card.danger ? 'text-red-400' : 'text-gray-400'}`}>{card.title}</p>
                    {card.href ? (
                      <a
                        href={card.href}
                        className={`mt-1 block font-semibold ${card.danger ? 'text-red-600 hover:text-red-700' : 'text-brand-deep hover:text-brand'}`}
                        dir={card.ltr ? 'ltr' : undefined}
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-semibold text-brand-deep">{card.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Working hours */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.32 }}
              className="p-5 rounded-2xl bg-brand-deep text-white"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                <Clock size={13} className="text-brand-accent" /> {t('contact.hoursTitle')}
              </p>
              <div className="space-y-2.5">
                {siteConfig.hours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/65">{h.days[language]}</span>
                    <span className="font-semibold" dir="ltr">{h.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
            >
              <MessageCircle size={18} /> {t('contact.whatsapp')}
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <motion.form
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="p-7 lg:p-9 rounded-3xl bg-white border border-black/[0.05] shadow-[0_18px_60px_-20px_rgba(10,43,38,0.18)]"
            >
              <h2 className="text-2xl font-display font-bold text-brand-deep mb-6">{t('contact.title')}</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {([
                  { key: 'name', type: 'text' },
                  { key: 'email', type: 'email' },
                  { key: 'phone', type: 'tel' },
                  { key: 'subject', type: 'text' },
                ] as const).map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      {t(`contact.${f.key}`)} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none border transition-colors ${
                        errors[f.key] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15'
                      }`}
                    />
                    {errors[f.key] && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} /> {errors[f.key]}</p>
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    {t('contact.message')} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none border resize-none transition-colors ${
                      errors.message ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} /> {errors.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-brand hover:bg-brand-deep text-white font-semibold shadow-lg shadow-brand/25 transition-all hover:scale-[1.01]"
              >
                {sent ? (
                  <><CheckCircle size={18} /> {t('contact.sent')}</>
                ) : (
                  <><Send size={17} /> {t('contact.send')}</>
                )}
              </button>
            </motion.form>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 rounded-3xl overflow-hidden border border-black/[0.05] h-[320px] bg-gray-100"
            >
              <iframe
                title={t('contact.mapTitle')}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.contact.mapQuery)}&z=13&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
