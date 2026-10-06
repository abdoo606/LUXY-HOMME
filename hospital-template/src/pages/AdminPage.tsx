import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarCheck, Users, MessageSquare, LogOut, Lock, Mail,
  Shield, Search, CheckCircle, Clock, TrendingUp, Bell,
} from 'lucide-react';
import { useStore, type Appointment } from '../store/useStore';
import { useAdminStore, ADMIN_CREDENTIALS } from '../store/adminStore';
import { formatDate } from '../utils/slots';
import { siteConfig } from '../config/site.config';

interface Props {
  onExit: () => void;
}

type Tab = 'dashboard' | 'appointments' | 'doctors' | 'messages';

export default function AdminPage({ onExit }: Props) {
  return <AdminShell onExit={onExit} />;
}

function AdminShell({ onExit }: Props) {
  const isAdmin = useAdminStore((s) => s.isAdminAuthenticated);
  return isAdmin ? <Dashboard onExit={onExit} /> : <Login />;
}

/* ------------------------------ LOGIN ------------------------------ */
function Login() {
  const adminLogin = useAdminStore((s) => s.adminLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (!adminLogin(email, password)) setError('Invalid email or password');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--brand-deep)' }}>
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, var(--brand-accent) 0, transparent 40%)' }} />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
              <Shield size={30} />
            </div>
            <h1 className="text-2xl font-display font-bold text-brand-deep">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">{siteConfig.brand.name}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3.5 mb-5">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ADMIN_CREDENTIALS.email}
                  className="w-full ps-11 pe-4 py-3.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-11 pe-4 py-3.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none text-sm"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand hover:bg-brand-deep text-white font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? '…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Demo: <span className="font-mono text-gray-500">{ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------------------- DASHBOARD ---------------------------- */
function Dashboard({ onExit }: Props) {
  const { appointments } = useStore();
  const { adminUser, adminLogout, getDoctors } = useAdminStore();
  const doctors = getDoctors();
  const messages = useStore((s) => s.contactMessages);
  const updateStatus = (id: string, status: Appointment['status']) => {
    useStore.setState((s) => ({
      appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  };

  const [tab, setTab] = useState<Tab>('dashboard');
  const [query, setQuery] = useState('');

  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  const filtered = appointments.filter((a) =>
    `${a.ref} ${a.patient.firstName} ${a.patient.lastName} ${a.doctorName}`.toLowerCase().includes(query.toLowerCase())
  );

  const nav: { key: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'appointments', label: 'Appointments', icon: CalendarCheck, badge: pending },
    { key: 'doctors', label: 'Doctors', icon: Users },
    { key: 'messages', label: 'Messages', icon: MessageSquare, badge: messages.length },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex" dir="ltr">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen flex flex-col fixed inset-y-0 start-0 z-40 text-white" style={{ background: 'var(--brand-deep)' }}>
        <div className="p-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg" style={{ background: 'var(--brand-primary)' }}>
              {siteConfig.brand.logoText}
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">{siteConfig.brand.name}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.18em]">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === item.key ? 'bg-white/12 text-white' : 'text-white/55 hover:bg-white/6 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {!!item.badge && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--brand-accent)] text-white">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/8">
          <button
            onClick={() => { adminLogout(); onExit(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/12 transition-colors text-sm font-medium"
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ms-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-black/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">{tab}</h2>
              <p className="text-gray-400 text-sm">Welcome back, {adminUser?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 relative">
                <Bell size={18} />
                {pending > 0 && (
                  <span className="absolute -top-1 -end-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {pending}
                  </span>
                )}
              </button>
              <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold" style={{ background: 'var(--brand-primary)' }}>
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* DASHBOARD TAB */}
            {tab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {[
                    { label: 'Total Appointments', value: appointments.length, icon: CalendarCheck, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Pending', value: pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
                    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'from-blue-500 to-indigo-600' },
                    { label: 'Completed', value: completed, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`rounded-2xl p-6 bg-gradient-to-br ${s.color} text-white relative overflow-hidden`}
                    >
                      <s.icon size={22} className="opacity-80" />
                      <p className="text-white/80 text-xs font-medium mt-3">{s.label}</p>
                      <p className="text-3xl font-bold mt-1">{s.value}</p>
                      <div className="absolute -bottom-4 -end-4 opacity-15"><s.icon size={90} /></div>
                    </motion.div>
                  ))}
                </div>

                {/* Simple bar chart — appointments per status */}
                <div className="bg-white rounded-2xl border border-black/5 p-6">
                  <h3 className="font-bold text-gray-800 mb-5">Appointments Overview</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Pending', value: pending, color: 'bg-amber-400' },
                      { label: 'Confirmed', value: confirmed, color: 'bg-blue-500' },
                      { label: 'Completed', value: completed, color: 'bg-emerald-500' },
                      { label: 'Cancelled', value: cancelled, color: 'bg-red-400' },
                    ].map((row, i) => {
                      const max = Math.max(appointments.length, 1);
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <span className="w-20 text-xs text-gray-500 font-medium">{row.label}</span>
                          <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(row.value / max) * 100}%` }}
                              transition={{ duration: 0.8, delay: i * 0.12 }}
                              className={`h-full rounded-full ${row.color}`}
                            />
                          </div>
                          <span className="w-8 text-end text-sm font-bold text-gray-700">{row.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent appointments */}
                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                  <div className="p-6 border-b border-black/5 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Recent Appointments</h3>
                    <button onClick={() => setTab('appointments')} className="text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>
                      View All →
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Reference', 'Patient', 'Doctor', 'Date', 'Status'].map((h) => (
                          <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((a) => (
                        <tr key={a.id} className="border-t border-black/5 hover:bg-gray-50/70">
                          <td className="px-6 py-3.5 font-mono text-xs font-bold" style={{ color: 'var(--brand-primary)' }}>{a.ref}</td>
                          <td className="px-6 py-3.5 text-gray-700">{a.patient.firstName} {a.patient.lastName}</td>
                          <td className="px-6 py-3.5 text-gray-500">{a.doctorName}</td>
                          <td className="px-6 py-3.5 text-gray-500">{formatDate(a.date, 'en')} · {a.time}</td>
                          <td className="px-6 py-3.5">
                            <StatusBadge status={a.status} />
                          </td>
                        </tr>
                      ))}
                      {appointments.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No appointments yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* APPOINTMENTS TAB */}
            {tab === 'appointments' && (
              <motion.div key="appts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="relative max-w-sm">
                  <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search appointments…"
                    className="w-full ps-11 pe-4 py-3 rounded-xl border border-black/10 bg-white outline-none text-sm focus:border-[var(--brand-primary)]"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Reference', 'Patient', 'Doctor', 'Date', 'Reason', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a) => (
                        <tr key={a.id} className="border-t border-black/5 hover:bg-gray-50/70">
                          <td className="px-5 py-4 font-mono text-xs font-bold" style={{ color: 'var(--brand-primary)' }}>{a.ref}</td>
                          <td className="px-5 py-4">
                            <p className="text-gray-800 font-medium">{a.patient.firstName} {a.patient.lastName}</p>
                            <p className="text-gray-400 text-xs">{a.patient.phone}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{a.doctorName}</td>
                          <td className="px-5 py-4 text-gray-600">{formatDate(a.date, 'en')}<br /><span className="text-xs text-gray-400">{a.time}</span></td>
                          <td className="px-5 py-4 text-gray-500 max-w-[160px] truncate">{a.patient.reason}</td>
                          <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                          <td className="px-5 py-4">
                            <select
                              value={a.status}
                              onChange={(e) => updateStatus(a.id, e.target.value as Appointment['status'])}
                              className="text-xs rounded-lg border border-black/10 px-2.5 py-2 bg-white outline-none focus:border-[var(--brand-primary)]"
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="confirmed">✓ Confirmed</option>
                              <option value="completed">✅ Completed</option>
                              <option value="cancelled">❌ Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No appointments found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* DOCTORS TAB */}
            {tab === 'doctors' && (
              <motion.div key="docs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {doctors.map((d) => (
                    <div key={d.id} className="bg-white rounded-2xl border border-black/5 p-5 flex items-center gap-4">
                      <img src={d.photo} alt="" className="w-14 h-14 rounded-2xl object-cover object-top" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400 truncate">{d.title.en}</p>
                        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--brand-primary)' }}>
                          {d.experience}+ yrs · ⭐ {d.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-gray-400 max-w-2xl leading-relaxed">
                  💡 Tip: doctors are managed in <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">src/config/content.ts</span> —
                  edit names, photos, schedules and departments there for each client. Changes appear instantly across the site.
                </p>
              </motion.div>
            )}

            {/* MESSAGES TAB */}
            {tab === 'messages' && (
              <motion.div key="msgs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {messages.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-black/5 p-12 text-center text-gray-400">
                    <MessageSquare size={36} className="mx-auto mb-4 text-gray-200" />
                    No messages yet — contact form submissions will appear here.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="bg-white rounded-2xl border border-black/5 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">{m.name} <span className="text-gray-400 font-normal text-xs">· {m.subject}</span></p>
                          <p className="text-xs text-gray-400 mt-0.5">{m.email} · {m.phone}</p>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{m.message}</p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const styles: Record<Appointment['status'], string> = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
