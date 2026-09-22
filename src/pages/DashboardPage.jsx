import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpCircle, 
  Plus, 
  Sparkles, 
  ListTree, 
  BarChart3, 
  Calendar as CalendarIcon,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  Inbox,
  Target,
  ChevronLeft,
  ChevronRight,
  Flame,
  Check,
  Circle,
  Zap,
  BookOpen,
  Coffee,
  Laptop
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import PriorityBadge from '../components/PriorityBadge';
import RiskBadge from '../components/RiskBadge';
import api from '../api/client';

const PRIORITY_COLORS = {
  High: '#FF5A5F',
  Medium: '#8B5CF6',
  Low: '#22C55E',
};

const customTooltipStyle = {
  backgroundColor: '#FFFDF9',
  borderColor: '#EDE9FE',
  borderRadius: '16px',
  color: '#0F172A',
  boxShadow: '0 8px 30px rgba(124,58,237,0.12)',
  fontSize: '12px',
  fontWeight: '700'
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { onOpenNewTask, onEditTask } = useOutletContext();
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTask();

  const [summaryData, setSummaryData] = useState(null);
  const [productivityData, setProductivityData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const loadData = async () => {
    fetchTasks();
    try {
      setLoadingAnalytics(true);
      const [sumRes, prodRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/productivity'),
      ]);
      setSummaryData(sumRes.data);
      setProductivityData(prodRes.data);
    } catch (err) {
      console.error('Failed to load analytics on dashboard:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const userName = user?.full_name?.split(' ')[0] || 'Nandini';

  // Filter pending active tasks
  const pendingTasks = tasks.filter((t) => t.completion_status !== 'Completed');
  const activeTasks = pendingTasks.slice(0, 4);

  const priorityChartData = (summaryData?.priority_distribution || []).map((item) => ({
    name: item.priority,
    value: item.count,
    color: PRIORITY_COLORS[item.priority] || '#C4B5FD',
  }));

  const weeklyChartData = productivityData?.weekly_history || [];

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. HERO / WELCOME SECTION (WARM PEACH, LAVENDER & CORAL GRADIENT MESH)   */}
      {/* ========================================================================= */}
      <div className="relative bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] rounded-3xl p-6 sm:p-8 sm:py-10 border border-[#EDE9FE] shadow-card overflow-hidden">
        
        {/* Soft Ambient Shapes */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#DCFCE7]/50 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#FCE7F3]/50 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Text & Motivation */}
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md text-xs font-extrabold text-[#7C3AED] border border-[#DDD6FE] shadow-2xs">
              <CalendarIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{todayStr}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              Hello, {userName}! <span className="inline-block animate-bounce">👋</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-semibold">
              Your AI assistant is actively streamlining your workday. Focus on your highest-impact goals today with intelligent scheduling.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF9]/90 text-[11px] font-bold text-[#0F172A] border border-[#EDE9FE] shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-[#FF5A5F]" />
                <span>Keep going, you're making steady progress.</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF9]/90 text-[11px] font-bold text-[#7C3AED] border border-[#EDE9FE] shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>AI Prioritizer Active</span>
              </span>
            </div>
          </div>

          {/* Right Workspace Neural Status Card */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-3xl bg-[#FFFDF9]/95 border border-[#EDE9FE] shadow-card flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Neural Prioritizer</span>
                <span className="text-xs font-black text-[#0F172A]">BiLSTM + Attention</span>
                <span className="text-[10px] text-[#15803D] font-bold block">✓ Optimized Local Inference</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FOUR VIBRANT STATISTIC METRIC CARDS                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Tasks (Lavender / Indigo Identity) */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EDE9FE] shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Total Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#7C3AED] flex items-center justify-center border border-[#C4B5FD] group-hover:scale-110 transition-transform shadow-xs">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            {summaryData?.total_tasks ?? tasks.length}
          </div>
          <p className="text-[11px] text-[#64748B] font-semibold">Active tasks in workspace</p>
        </div>

        {/* Card 2: Completed (Mint / Emerald Identity) */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#BBF7D0]/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Completed</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] text-[#15803D] flex items-center justify-center border border-[#86EFAC] group-hover:scale-110 transition-transform shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#15803D]">
            {summaryData?.completed_tasks ?? 0}
          </div>
          <p className="text-[11px] text-[#15803D] font-bold">
            {summaryData?.completion_rate_percentage ?? 0}% completion velocity
          </p>
        </div>

        {/* Card 3: Pending (Warm Peach / Amber Identity) */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#FFD6BA]/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Pending</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFEBDC] to-[#FFD6BA] text-[#EA580C] flex items-center justify-center border border-[#FFBA88] group-hover:scale-110 transition-transform shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#EA580C]">
            {summaryData?.pending_tasks ?? 0}
          </div>
          <p className="text-[11px] text-[#64748B] font-semibold">Active in progress queue</p>
        </div>

        {/* Card 4: High Priority (Coral / Crimson Identity) */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#FFCCC7]/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">High Priority</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE4E1] to-[#FFCCC7] text-[#E03E44] flex items-center justify-center border border-[#FFA39E] group-hover:scale-110 transition-transform shadow-xs">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#E03E44]">
            {summaryData?.high_priority_tasks ?? 0}
          </div>
          <p className="text-[11px] text-[#E03E44] font-bold">Require immediate attention</p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. FOUR QUICK ACTION BUTTONS                                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Action 1: Add New Task (Primary Gradient) */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center justify-center gap-2.5 p-4 rounded-3xl bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Task</span>
        </button>

        {/* Action 2: View All Tasks */}
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center justify-center gap-2.5 p-4 rounded-3xl bg-[#FFFDF9] hover:bg-[#EDE9FE]/50 border border-[#EDE9FE] text-[#0F172A] font-bold text-xs sm:text-sm shadow-sm hover:shadow-card transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
          <span>View All Tasks</span>
        </button>

        {/* Action 3: AI Prioritizer */}
        <button
          onClick={() => navigate('/ai-prioritizer')}
          className="flex items-center justify-center gap-2.5 p-4 rounded-3xl bg-[#FFFDF9] hover:bg-[#FFE4E1]/50 border border-[#EDE9FE] text-[#0F172A] font-bold text-xs sm:text-sm shadow-sm hover:shadow-card transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
          <span>AI Prioritize</span>
        </button>

        {/* Action 4: Set a Goal */}
        <button
          onClick={() => navigate('/ai-breakdown')}
          className="flex items-center justify-center gap-2.5 p-4 rounded-3xl bg-[#FFFDF9] hover:bg-[#DCFCE7]/50 border border-[#EDE9FE] text-[#0F172A] font-bold text-xs sm:text-sm shadow-sm hover:shadow-card transition-all cursor-pointer"
        >
          <Target className="w-4 h-4 text-[#15803D]" />
          <span>Goal Planner</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN GRID: ACTIVE TASKS (LEFT 8 COLS) & WIDGETS (RIGHT 4 COLS)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: High-Priority & Active Tasks (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">High-Priority & Active Tasks</h2>
              <p className="text-xs text-[#64748B] font-medium">Tasks sorted for your daily productivity sprint</p>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer bg-[#EDE9FE] px-3 py-1.5 rounded-xl border border-[#DDD6FE]"
            >
              <span>See All ({tasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTasks.length === 0 ? (
            <div className="bg-[#FFFDF9] rounded-3xl p-10 border border-[#EDE9FE] text-center space-y-4 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#DCFCE7] text-[#7C3AED] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7 text-[#15803D]" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">All caught up!</h4>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto font-medium">
                You have no pending tasks right now. Create a new task or use AI Task Breakdown to plan upcoming goals.
              </p>
              <button
                onClick={onOpenNewTask}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
            </div>
          )}

          {/* 7-Day Completion Velocity Chart */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Weekly Activity Velocity</h3>
                <p className="text-xs text-[#64748B] font-medium">Tasks completed over the last 7 days</p>
              </div>
              <span className="text-xs font-bold text-[#7C3AED] px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE]">
                Last 7 Days
              </span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: '600' }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: '600' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="completed" name="Completed" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Widget & Motivational Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Calendar Widget */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EDE9FE] shadow-card space-y-4">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">{monthName} {year}</h3>
                <p className="text-[11px] font-bold text-[#64748B]">Schedule Agenda</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-[#EDE9FE] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-[#EDE9FE] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-[#94A3B8] uppercase">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                const isSelected = dayNum === selectedDate;
                
                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDate(dayNum)}
                    className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] text-white shadow-xs'
                        : isToday
                        ? 'bg-[#EDE9FE] text-[#7C3AED] font-extrabold border border-[#DDD6FE]'
                        : 'text-[#0F172A] hover:bg-[#FAF6EE]'
                    }`}
                  >
                    <span>{dayNum}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-semibold">Selected: {monthName} {selectedDate}</span>
              <button 
                onClick={() => navigate('/tasks')}
                className="text-[#7C3AED] hover:text-[#6D28D9] font-bold cursor-pointer"
              >
                View Agenda
              </button>
            </div>
          </div>

          {/* Motivational Widget */}
          <div className="bg-gradient-to-br from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] rounded-3xl p-6 border border-[#DDD6FE] shadow-card space-y-3 text-left relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#7C3AED]">
              <Sparkles className="w-5 h-5 text-[#FF5A5F]" />
              <span className="text-xs font-black uppercase tracking-wider">Daily Inspiration</span>
            </div>
            
            <h4 className="text-lg sm:text-xl font-black text-[#0F172A] leading-snug">
              "Small Steps,<br />Big Results."
            </h4>
            
            <p className="text-xs text-[#475569] leading-relaxed font-semibold">
              Break daunting tasks into micro-milestones. Every 30 minutes of deep focus compounds into remarkable progress.
            </p>
          </div>

          {/* Priority Distribution Pie */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EDE9FE] shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Priority Distribution</h3>
            {tasks.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-xs text-[#94A3B8]">
                No tasks to display
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={customTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex justify-center gap-3 text-xs font-bold text-[#64748B]">
              {priorityChartData.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}: {p.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
