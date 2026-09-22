import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppBackground from '../components/AppBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = 'demo@productivity.ai';
    const demoPass = 'DemoPassword123!';
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    let res = await login(demoEmail, demoPass);
    if (!res.success) {
      res = await register('Demo User', demoEmail, demoPass, demoPass);
    }
    setLoading(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* SaaS Pastel Background: Lavender & Peach Organic Shapes */}
      <AppBackground variant="auth" />

      <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl shadow-card-hover border border-[#EDE9FE] p-8 sm:p-10 space-y-6 animate-scale-in relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white mx-auto shadow-md shadow-lavender-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            Sign in to access your PlanPulse AI productivity workspace
          </p>
        </div>

        {/* Demo Login Quick Action */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EDE9FE] to-[#FFEBDC] border border-[#DDD6FE] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5A5F] shrink-0" />
            <span className="text-xs font-bold text-[#0F172A]">Want a quick test drive?</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="text-xs font-extrabold text-[#7C3AED] hover:text-[#6D28D9] bg-[#FFFDF9] px-3.5 py-1.5 rounded-xl border border-[#DDD6FE] shadow-2xs transition-all hover:bg-[#FFFFFF] cursor-pointer"
          >
            Instant Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF7F2] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF7F2] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            <span>Sign In</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-[#EDE9FE] text-xs text-[#64748B] font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-extrabold text-[#7C3AED] hover:text-[#6D28D9]">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
