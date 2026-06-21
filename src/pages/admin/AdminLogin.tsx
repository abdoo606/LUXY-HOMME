import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Shield } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const { adminLogin } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    const success = adminLogin(email, password);
    if (success) {
      onLogin();
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-card border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-accent" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Admin Panel</h1>
            <p className="text-white/40 text-sm mt-2">LUXE HOMME Management System</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-colors"
                  placeholder="admin@luxehomme.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={18} />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/30 text-xs text-center">
              Secure Admin Access • LUXE HOMME © 2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
