import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, CalendarPlus, Printer, CalendarCheck, RefreshCw, Stethoscope, Clock, AlertCircle, UserPlus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/useStore';
import type { Appointment } from '../store/useStore';
import { departments } from '../config/content';
import { useAdminStore } from '../store/adminStore';
import { generateSlots, upcomingDates, formatDate } from '../utils/slots';
import { validatePatient, hasErrors, type PatientForm, type Errors } from '../utils/validation';
// note: generateSlots & upcomingDates are used inside the step-2 JSX

interface Props {
  onNavigate: (page: string) => void;
  initialDepartment?: string | null;
  initialDoctor?: string | null;
}

const emptyForm: PatientForm = {
  firstName: '', lastName: '', email: '', phone: '', dob: '', reason: '', notes: '', isNew: true,
};

export default function AppointmentPage({ onNavigate, initialDepartment, initialDoctor }: Props) {
  const { t, language } = useTranslation();
  const { appointments, addAppointment } = useStore();
  const getDoctors = useAdminStore((s) => s.getDoctors);
  const doctors = getDoctors();

  const [step, setStep] = useState(1);
  const [departmentId, setDepartmentId] = useState<string | null>(initialDepartment ?? null);
  const [doctorId, setDoctorId] = useState<string | null>(initialDoctor ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<PatientForm>(emptyForm);
  const [errors, setErrors] = useState<Errors<PatientForm>>({});
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  // Prefill doctor's department when arriving from a doctor card
  useEffect(() => {
    if (initialDoctor) {
      const doc = doctors.find((d) => d.id === initialDoctor);
      if (doc && !departmentId) setDepartmentId(doc.department);
      if (doc) setDoctorId(doc.id);
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDoctor]);

  const department = useMemo(() => departments.find((d) => d.id === departmentId) || null, [departmentId]);
  const deptDoctors = useMemo(() => doctors.filter((d) => d.department === departmentId), [doctors, departmentId]);
  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId) || null, [doctors, doctorId]);

  // auto-select first date when doctor chosen
  useEffect(() => {
    if (doctor && !date) {
      const ds = upcomingDates(doctor, 1);
      if (ds[0]) setDate(ds[0]);
    }
  }, [doctor, date]);

  const handleConfirm = () => {
    const errs = validatePatient(form, t);
    setErrors(errs);
    if (hasErrors(errs) || !doctor || !department || !date || !time) return;
    const appt = addAppointment({
      departmentId: department.id,
      departmentName: department.name[language],
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      patient: { ...form, isNew: true },
    });
    setConfirmed(appt);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetWizard = () => {
    setConfirmed(null);
    setStep(1);
    setDepartmentId(null);
    setDoctorId(null);
    setDate(null);
    setTime(null);
    setForm(emptyForm);
    setErrors({});
  };

  const steps = [t('appt.step1'), t('appt.step2'), t('appt.step3'), t('appt.step4')];

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-brand-deep" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 75% 30%, var(--brand-accent) 0, transparent 40%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/10 text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> {t('appt.sub')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white">{t('appt.title')}</h1>
          </motion.div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-0 mt-10 overflow-x-auto px-2">
            {steps.map((label, i) => {
              const n = i + 1;
              const state = step > n ? 'done' : step === n ? 'active' : 'todo';
              return (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[86px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        state === 'done'
                          ? 'bg-brand-accent text-white'
                          : state === 'active'
                            ? 'bg-white text-brand-deep ring-4 ring-white/25'
                            : 'bg-white/10 text-white/40 border border-white/20'
                      }`}
                    >
                      {state === 'done' ? <CheckCircle2 size={18} /> : n}
                    </div>
                    <span className={`mt-2 text-[11px] font-medium whitespace-nowrap ${state === 'todo' ? 'text-white/35' : 'text-white/85'}`}>
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-10 lg:w-16 h-[2px] mx-1 mb-6 rounded ${step > n ? 'bg-brand-accent' : 'bg-white/15'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wizard body */}
      <section className="py-14 min-h-[50vh]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <AnimatePresence mode="wait">
            {/* STEP 1 — Department */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
                <h2 className="text-2xl font-display font-bold text-brand-deep mb-6">{t('appt.chooseDept')}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {departments.map((d) => {
                    const selected = departmentId === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => { setDepartmentId(d.id); setDoctorId(null); setTime(null); setDate(null); }}
                        className={`text-start p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                          selected ? 'border-brand bg-brand/5 shadow-lg shadow-brand/10' : 'border-gray-200 hover:border-brand/40 bg-white'
                        }`}
                      >
                        <img src={d.image} alt="" className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${selected ? 'text-brand' : 'text-brand-deep'}`}>{d.name[language]}</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{d.description[language]}</p>
                        </div>
                        {selected && <CheckCircle2 size={20} className="text-brand flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    disabled={!departmentId}
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand hover:bg-brand-deep text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('appt.continue')} <ChevronRight size={17} className="rtl:rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Doctor, date & time */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
                <h2 className="text-2xl font-display font-bold text-brand-deep mb-6">{t('appt.chooseDoctor')}</h2>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  <button
                    onClick={() => { setDoctorId(null); setTime(null); }}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      doctorId === null ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/40 bg-white'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                      <Stethoscope size={18} />
                    </div>
                    <div className="text-start">
                      <p className="font-semibold text-brand-deep text-sm">{t('appt.anyDoctor')}</p>
                      <p className="text-xs text-gray-500">{department?.name[language]}</p>
                    </div>
                    {doctorId === null && <CheckCircle2 size={18} className="text-brand ms-auto" />}
                  </button>
                  {deptDoctors.map((d) => {
                    const selected = doctorId === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => { setDoctorId(d.id); setTime(null); setDate(null); }}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                          selected ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/40 bg-white'
                        }`}
                      >
                        <img src={d.photo} alt="" className="w-11 h-11 rounded-full object-cover object-top" />
                        <div className="text-start">
                          <p className="font-semibold text-brand-deep text-sm">{d.name}</p>
                          <p className="text-xs text-gray-500">{d.title[language]}</p>
                        </div>
                        {selected && <CheckCircle2 size={18} className="text-brand ms-auto" />}
                      </button>
                    );
                  })}
                </div>

                {/* If "any doctor" selected — resolve to first doctor for scheduling */}
                {(() => {
                  const activeDoctor = doctor || (departmentId ? deptDoctors[0] ?? null : null);
                  if (!activeDoctor) return null;
                  return (
                    <>
                      <h2 className="text-2xl font-display font-bold text-brand-deep mb-4 flex items-center gap-2">
                        <CalendarPlus size={20} className="text-brand-accent" /> {t('appt.chooseDate')}
                      </h2>
                      <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
                        {upcomingDates(activeDoctor, 8).map((d) => (
                          <button
                            key={d}
                            onClick={() => { if (doctorId === null) setDoctorId(activeDoctor.id); setDate(d); setTime(null); }}
                            className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                              date === d ? 'border-brand bg-brand text-white' : 'border-gray-200 bg-white hover:border-brand/40 text-gray-600'
                            }`}
                          >
                            {formatDate(d, language)}
                          </button>
                        ))}
                      </div>

                      {date && (
                        <>
                          <h2 className="text-2xl font-display font-bold text-brand-deep mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-brand-accent" /> {t('appt.chooseTime')}
                          </h2>
                          {(() => {
                            const activeBooked = appointments.filter((a) => a.doctorId === activeDoctor.id && a.date === date && a.status !== 'cancelled').map((a) => a.time);
                            const activeSlots = generateSlots(activeDoctor, date, activeBooked);
                            if (activeSlots.length === 0) {
                              return <p className="text-amber-600 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">{t('appt.noSlots')}</p>;
                            }
                            return (
                              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                                {activeSlots.map((s) => (
                                  <button
                                    key={s.time}
                                    disabled={s.booked}
                                    onClick={() => { if (doctorId === null) setDoctorId(activeDoctor.id); setTime(s.time); }}
                                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                                      s.booked
                                        ? 'bg-gray-100 text-gray-300 line-through cursor-not-allowed'
                                        : time === s.time
                                          ? 'bg-brand text-white shadow-lg shadow-brand/25'
                                          : 'bg-white border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'
                                    }`}
                                    dir="ltr"
                                  >
                                    {s.time}
                                  </button>
                                ))}
                              </div>
                            );
                          })()}
                        </>
                      )}
                    </>
                  );
                })()}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={17} className="rtl:rotate-180" /> {t('appt.back')}
                  </button>
                  <button
                    disabled={!doctor && !deptDoctors.length || !date || !time}
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand hover:bg-brand-deep text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('appt.continue')} <ChevronRight size={17} className="rtl:rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Patient details */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
                <h2 className="text-2xl font-display font-bold text-brand-deep mb-6">{t('appt.step3')}</h2>

                {/* summary strip */}
                <div className="mb-8 p-5 rounded-2xl bg-brand-cream/70 border border-brand-accent/15 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: t('appt.step1'), value: department?.name[language] || '—' },
                    { label: t('appt.chooseDoctor'), value: (doctor || deptDoctors[0])?.name || '—' },
                    { label: t('appt.chooseDate'), value: date ? formatDate(date, language) : '—' },
                    { label: t('appt.chooseTime'), value: time || '—' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.label}</p>
                      <p className="text-sm font-semibold text-brand-deep mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {([
                    { key: 'firstName', type: 'text' },
                    { key: 'lastName', type: 'text' },
                    { key: 'email', type: 'email' },
                    { key: 'phone', type: 'tel' },
                    { key: 'dob', type: 'date' },
                    { key: 'reason', type: 'text' },
                  ] as const).map((f) => (
                    <div key={f.key}>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        {t(`appt.${f.key}`)} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={(e) => {
                          setForm({ ...form, [f.key]: e.target.value });
                          if (errors[f.key]) setErrors({ ...errors, [f.key]: undefined });
                        }}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-colors border ${
                          errors[f.key] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15'
                        }`}
                      />
                      {errors[f.key] && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('appt.notes')}</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none transition-colors"
                    />
                  </div>

                  <label className="sm:col-span-2 flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:border-brand/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                      className="w-4.5 h-4.5 accent-[var(--brand-primary)]"
                    />
                    <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <UserPlus size={15} className="text-brand-accent" /> {t('appt.newPatient')}
                    </span>
                  </label>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={17} className="rtl:rotate-180" /> {t('appt.back')}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white font-semibold shadow-lg shadow-brand-accent/30 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 size={18} /> {t('appt.confirm')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Confirmation */}
            {step === 4 && confirmed && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="text-center max-w-lg mx-auto">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15, bounce: 0.5 }}>
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={42} />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold text-brand-deep">{t('appt.success')}</h2>
                  <p className="mt-3 text-gray-500 leading-relaxed">{t('appt.successDesc')}</p>

                  {/* Appointment card — printable */}
                  <div className="mt-8 p-6 rounded-3xl bg-white border-2 border-brand-accent/25 shadow-[0_20px_60px_-18px_rgba(10,43,38,0.25)] text-start">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">{t('appt.ref')}</p>
                        <p className="text-xl font-mono font-bold text-brand">{confirmed.ref}</p>
                      </div>
                      <div className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center font-display font-bold">
                        <CalendarCheck size={20} />
                      </div>
                    </div>
                    <div className="hairline mb-5 opacity-60" />
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: t('appt.chooseDoctor'), value: confirmed.doctorName },
                        { label: t('appt.step1'), value: confirmed.departmentName },
                        { label: t('appt.chooseDate'), value: formatDate(confirmed.date, language) },
                        { label: t('appt.chooseTime'), value: confirmed.time },
                        { label: t('contact.name'), value: `${confirmed.patient.firstName} ${confirmed.patient.lastName}` },
                        { label: t('contact.phone'), value: confirmed.patient.phone },
                      ].map((item, i) => (
                        <div key={i}>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.label}</p>
                          <p className="text-sm font-semibold text-brand-deep mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <Printer size={17} /> {t('appt.print')}
                    </button>
                    <button
                      onClick={() => onNavigate('myAppointments')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand hover:bg-brand-deep text-white font-semibold transition-colors"
                    >
                      <CalendarCheck size={17} /> {t('appt.addCalendar')}
                    </button>
                    <button
                      onClick={resetWizard}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-accent hover:bg-[#b8931f] text-white font-semibold transition-colors"
                    >
                      <RefreshCw size={16} /> {t('appt.another')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
