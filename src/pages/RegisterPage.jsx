import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AppBackground from '../components/AppBackground';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { warning } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      warning('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      warning('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register(fullName, email, password, confirmPassword);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
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
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Create an Account</h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            Join PlanPulse AI to streamline your productivity and goals
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF7F2] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF7F2] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF7F2] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <span>Create Account</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-[#EDE9FE] text-xs text-[#64748B] font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-[#7C3AED] hover:text-[#6D28D9]">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
