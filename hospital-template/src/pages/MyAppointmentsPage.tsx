import { motion } from 'framer-motion';
import { CalendarX, CalendarPlus, CalendarCheck, Clock, MapPin, Stethoscope, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/useStore';
import { formatDate } from '../utils/slots';

interface Props {
  onNavigate: (page: string) => void;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  completed: 'bg-blue-50 text-blue-600 border-blue-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
};

export default function MyAppointmentsPage({ onNavigate }: Props) {
  const { t, language } = useTranslation();
  const { appointments, cancelAppointment } = useStore();

  const sorted = [...appointments].sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, var(--brand-accent) 0, transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('my.sub')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{t('my.title')}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-14 min-h-[45vh]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {sorted.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-brand-cream text-brand-accent flex items-center justify-center mx-auto mb-6">
                <CalendarX size={36} />
              </div>
              <p className="text-gray-500 text-lg">{t('my.empty')}</p>
              <button
                onClick={() => onNavigate('appointment')}
                className="mt-7 inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white font-semibold shadow-lg shadow-brand-accent/30 transition-all hover:scale-[1.03]"
              >
                <CalendarPlus size={18} /> {t('my.bookNow')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {sorted.map((appt, i) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`p-6 rounded-3xl bg-white border shadow-[0_12px_40px_-18px_rgba(10,43,38,0.14)] ${
                    appt.status === 'cancelled' ? 'opacity-60' : 'border-black/[0.05]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-mono text-xs font-bold text-brand bg-brand/8 px-2.5 py-1 rounded-full">{appt.ref}</span>
                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusStyles[appt.status]}`}>
                          {t(`my.status.${appt.status}`)}
                        </span>
                      </div>
                      <p className="text-xl font-display font-bold text-brand-deep">{appt.doctorName}</p>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><Stethoscope size={13} className="text-brand-accent" /> {appt.departmentName}</span>
                        <span className="flex items-center gap-1.5"><CalendarCheck size={13} className="text-brand-accent" /> {formatDate(appt.date, language)}</span>
                        <span className="flex items-center gap-1.5"><Clock size={13} className="text-brand-accent" /> <span dir="ltr">{appt.time}</span></span>
                      </div>
                      {appt.patient.reason && (
                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1.5">
                          <MapPin size={13} className="text-brand-accent" /> {appt.patient.reason}
                        </p>
                      )}
                    </div>

                    {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold transition-colors"
                      >
                        <Trash2 size={14} /> {t('my.cancel')}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="text-center pt-6">
                <button
                  onClick={() => onNavigate('appointment')}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-brand hover:bg-brand-deep text-white font-semibold transition-colors"
                >
                  <CalendarPlus size={18} /> {t('my.bookNow')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
