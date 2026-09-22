import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ListTree, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  BrainCircuit, 
  BarChart3, 
  Clock, 
  Check, 
  Layers,
  Compass,
  Target,
  LineChart,
  Zap,
  ChevronRight,
  Menu,
  X,
  Laptop,
  CheckSquare,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';
import AppBackground from '../components/AppBackground';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] font-sans antialiased selection:bg-[#DDD6FE] selection:text-[#0F172A] overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. NAVIGATION BAR                                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EDE9FE] transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-lavender-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-[#0F172A] text-lg leading-tight block tracking-tight">
                PlanPulse <span className="text-[#7C3AED]">AI</span>
              </span>
              <span className="text-[11px] font-bold text-[#FF5A5F] tracking-wide block">
                Productivity Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#475569]">
            <a href="#home" className="hover:text-[#7C3AED] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#7C3AED] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#7C3AED] transition-colors">How It Works</a>
            <a href="#about" className="hover:text-[#7C3AED] transition-colors">About</a>
          </nav>

          {/* Actions: Log In & Sign Up */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-[#475569] hover:text-[#7C3AED] transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] text-white text-sm font-bold rounded-2xl shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-2xl text-[#0F172A] hover:bg-[#EDE9FE] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] border-b border-[#EDE9FE] px-6 py-5 space-y-4 animate-fade-in shadow-card-hover">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-[#475569]">
              <a 
                href="#home" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#7C3AED] transition-colors"
              >
                Home
              </a>
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#7C3AED] transition-colors"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#7C3AED] transition-colors"
              >
                How It Works
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#7C3AED] transition-colors"
              >
                About
              </a>
            </nav>
            <div className="pt-3 border-t border-[#EDE9FE] flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-[#0F172A] bg-[#FAF7F2] rounded-2xl hover:bg-[#EDE9FE] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] rounded-2xl shadow-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2 & 3. HERO SECTION WITH LAVENDER & PEACH ABSTRACT SHAPES                 */}
      {/* ========================================================================= */}
      <section id="home" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        
        {/* Modern SaaS Background: Abstract Organic Lavender & Peach Shapes + Dot Matrix */}
        <AppBackground variant="hero" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Typography & Highlights */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE]/90 backdrop-blur-md border border-[#DDD6FE] text-[#7C3AED] text-xs font-black shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A5F]" />
                <span>Deep Learning NLP & Productivity Suite</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
                Plan Smarter. <br />
                Work Better. <br />
                <span className="relative inline-block text-[#7C3AED]">
                  Achieve More.
                  {/* Subtle Underline */}
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#FF5A5F]" 
                    viewBox="0 0 250 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M2.5 9.5C50 3.5 150 1.5 247.5 7.5" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mx-auto lg:mx-0 font-semibold pt-1">
                An intelligent productivity assistant designed with a calm, elegant workspace. Prioritize tasks, break down complex goals, and forecast schedule risks using real PyTorch neural pipelines.
              </p>

              {/* Four Feature Highlights with Pastel Accents */}
              <div className="grid grid-cols-2 gap-3.5 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
                
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-sm border border-[#EDE9FE] shadow-sm hover:border-[#DDD6FE] hover:shadow-card transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shrink-0">
                    <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Smart Prioritization</span>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-sm border border-[#EDE9FE] shadow-sm hover:border-[#BBF7D0] hover:shadow-card transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shrink-0">
                    <ListTree className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">AI Task Breakdown</span>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-sm border border-[#EDE9FE] shadow-sm hover:border-[#FFCCC7] hover:shadow-card transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#FFE4E1] flex items-center justify-center text-[#E03E44] shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Deadline Risk Radar</span>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-sm border border-[#EDE9FE] shadow-sm hover:border-[#FFD6BA] hover:shadow-card transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#FFEBDC] flex items-center justify-center text-[#EA580C] shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Velocity Analytics</span>
                </div>

              </div>

              {/* Prominent CTA Button */}
              <div className="pt-3 flex justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] text-white rounded-2xl text-base font-extrabold shadow-md shadow-lavender-500/25 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign Up Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Right Column: Premium Laptop Mockup */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Laptop Hardware Container */}
              <div className="w-full max-w-lg bg-[#0F172A] rounded-t-3xl p-3 sm:p-4 shadow-2xl border border-[#334155] relative z-10">
                
                {/* Laptop Camera dot */}
                <div className="w-2 h-2 rounded-full bg-[#64748B] mx-auto mb-2" />

                {/* Laptop Screen / Dashboard UI */}
                <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EDE9FE] text-[#0F172A] shadow-inner text-xs">
                  
                  {/* Mockup Top Navigation Bar */}
                  <div className="bg-[#FFFDF9] px-4 py-2.5 border-b border-[#EDE9FE] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF7875]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                      </div>
                      <span className="font-black text-[#0F172A] text-[11px] ml-2">PlanPulse AI Dashboard</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-extrabold border border-[#DDD6FE]">
                      Neural Engine Ready
                    </span>
                  </div>

                  {/* Mockup Body Content */}
                  <div className="p-3.5 sm:p-4 space-y-3.5 bg-[#FAF7F2]">
                    
                    {/* Top Stats Cards Row */}
                    <div className="grid grid-cols-3 gap-2">
                      
                      <div className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#EDE9FE] shadow-2xs">
                        <span className="text-[10px] font-bold text-[#64748B] block">Total Tasks</span>
                        <span className="text-base font-black text-[#0F172A]">18</span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#BBF7D0]/60 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#64748B] block">Completed</span>
                        <span className="text-base font-black text-[#15803D]">11</span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#FFCCC7]/60 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#64748B] block">High Priority</span>
                        <span className="text-base font-black text-[#E03E44]">4</span>
                      </div>

                    </div>

                    {/* Today's Focus & Overall Progress */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EDE9FE] space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span className="font-extrabold text-[#0F172A] text-[11px]">Today's Focus: Deep Learning Final Report</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#FFF1F0] text-[#E03E44] text-[9px] font-extrabold border border-[#FFCCC7]">
                          HIGH
                        </span>
                      </div>

                      {/* Progress Indicator */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[#64748B] font-bold">
                          <span>Sprint Progress</span>
                          <span className="font-black text-[#0F172A]">78%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#EDE9FE] overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Active Task List Snippet */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">
                        AI Recommended Schedule
                      </span>

                      <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-md bg-[#15803D] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="text-[11px] font-medium text-[#0F172A] line-through opacity-70">
                            Format LaTeX research bibliography
                          </span>
                        </div>
                        <span className="text-[9px] text-[#64748B] font-bold">1.0h</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#DDD6FE] flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-md border border-[#DDD6FE] bg-[#FAF7F2]" />
                          <span className="text-[11px] font-extrabold text-[#0F172A]">
                            Run Attention Layer ablation benchmarks
                          </span>
                        </div>
                        <span className="text-[9px] font-black text-[#7C3AED]">2.5h • Next</span>
                      </div>

                    </div>

                    {/* AI Insights Snippet */}
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#EDE9FE] to-[#FFEBDC] border border-[#DDD6FE] flex items-start gap-2 text-[#0F172A]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#FF5A5F]" />
                      <div className="text-[10px] leading-tight">
                        <span className="font-extrabold text-[#7C3AED]">AI Deadline Radar:</span> 2 key milestones due tomorrow. Schedule is on track with 99.7% confidence.
                      </div>
                    </div>

                  </div>
                </div>

                {/* Laptop Base Stand */}
                <div className="h-3 bg-[#334155] rounded-b-2xl mx-auto mt-2 w-36" />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTELLIGENT PRODUCTIVITY ENGINE (4 ELEGANT PASTEL CARDS)               */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-[#FFFDF9]/80 border-t border-[#EDE9FE] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Intelligent Productivity Engine
            </h2>
            <p className="text-base text-[#64748B] font-semibold">
              Everything you need to stay focused, organized, and ahead of every deadline.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Organize (Mint) */}
            <div className="bg-[#FAF7F2] rounded-3xl p-7 border border-[#EDE9FE] shadow-card hover:shadow-card-hover hover:border-[#BBF7D0] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D] mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2">1. Organize</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Bring all your tasks and goals in one place with frictionless structuring and dynamic categories.
              </p>
            </div>

            {/* Card 2: Prioritize (Lavender) */}
            <div className="bg-[#FAF7F2] rounded-3xl p-7 border border-[#EDE9FE] shadow-card hover:shadow-card-hover hover:border-[#DDD6FE] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#C4B5FD] flex items-center justify-center text-[#7C3AED] mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Sparkles className="w-6 h-6 text-[#FF5A5F]" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2">2. Prioritize</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Focus on what really matters using deep learning NLP models that calculate true urgency and effort.
              </p>
            </div>

            {/* Card 3: Analyze (Coral/Pink) */}
            <div className="bg-[#FAF7F2] rounded-3xl p-7 border border-[#EDE9FE] shadow-card hover:shadow-card-hover hover:border-[#FFCCC7] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE4E1] border border-[#FFA39E] flex items-center justify-center text-[#E03E44] mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2">3. Analyze</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Get AI-powered insights and risk alerts to prevent deadline slips before bottlenecks emerge.
              </p>
            </div>

            {/* Card 4: Achieve (Warm Peach) */}
            <div className="bg-[#FAF7F2] rounded-3xl p-7 border border-[#EDE9FE] shadow-card hover:shadow-card-hover hover:border-[#FFD6BA] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEBDC] border border-[#FFBA88] flex items-center justify-center text-[#EA580C] mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2">4. Achieve</h3>
              <p className="text-sm text-[#64748B] leading-relaxed font-medium">
                Turn complex plans into real results with step-by-step goal decomposition and velocity analytics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (FOUR STEP TIMELINE)                                     */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#FAF7F2] via-[#EDE9FE]/20 to-[#FAF7F2] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#7C3AED]">
              Step-by-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
              How PlanPulse AI Transforms Your Workday
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EDE9FE] space-y-3 relative shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <h4 className="font-extrabold text-base text-[#0F172A]">Input Your Goals</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                Type natural language task descriptions without worrying about rigid structuring or manual tagging.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EDE9FE] space-y-3 relative shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <h4 className="font-extrabold text-base text-[#0F172A]">Deep Learning Prioritization</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                Our PyTorch neural model evaluates text context, deadlines, and urgency to assign calibrated priority scores.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EDE9FE] space-y-3 relative shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FB923C] to-[#EA580C] text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </div>
              <h4 className="font-extrabold text-base text-[#0F172A]">Subtask Decomposition</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                Large deliverables are automatically divided into phased, manageable milestones with effort estimates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EDE9FE] space-y-3 relative shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#22C55E] to-[#15803D] text-white font-black text-sm flex items-center justify-center shadow-xs">
                4
              </div>
              <h4 className="font-extrabold text-base text-[#0F172A]">Real-Time Risk Monitoring</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                Stay protected with continuous risk score auditing and prescriptive mitigation recommendations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ABOUT SECTION (PHILOSOPHY & EXPLAINABLE AI)                            */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 bg-[#FFFDF9]/80 border-t border-[#EDE9FE]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#EDE9FE] shadow-card space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black border border-[#DDD6FE]">
              <BrainCircuit className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>Transparent & Explainable AI</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Built to Eliminate Cognitive Overload
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-semibold">
              Traditional to-do apps leave the burden of prioritization entirely on your shoulders, leading to decision fatigue and missed deadlines. PlanPulse AI uses a multi-task neural network architecture with Bi-directional LSTM and self-attention to assess textual nuance, combining machine learning precision with transparent explainability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EDE9FE]">
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#7C3AED]">88.4%</span>
                <p className="text-xs text-[#64748B] font-bold">Model Benchmark Accuracy</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#FF5A5F]">&lt; 15ms</span>
                <p className="text-xs text-[#64748B] font-bold">Local PyTorch Inference Latency</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#15803D]">100%</span>
                <p className="text-xs text-[#64748B] font-bold">Private & Transparent Logic</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CALL TO ACTION BANNER                                            */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] rounded-3xl p-8 sm:p-12 text-white text-center shadow-card-hover space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Master Your Productivity?
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-[#FAF7F2] leading-relaxed font-semibold">
              Join PlanPulse AI today and experience the clarity of intelligent task prioritization, automated breakdown, and proactive risk protection.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#0F172A] rounded-2xl text-base font-black shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-[#0F172A] text-[#94A3B8] py-12 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1E293B]">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base leading-tight block">
                  PlanPulse <span className="text-[#A78BFA]">AI</span>
                </span>
                <span className="text-[11px] text-[#FF7875] font-bold">Productivity Suite</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#DDD6FE] font-bold">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
              <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] font-medium gap-4">
            <p>© 2026 PlanPulse AI. Powered by PyTorch Deep Learning & NLP.</p>
            <p className="text-center sm:text-right">Built for Deep Focus & Peak Performance.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
