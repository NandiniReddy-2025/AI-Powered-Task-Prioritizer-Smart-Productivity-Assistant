import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  PieChart as PieIcon, 
  Activity,
  Layers,
  Inbox,
  Zap
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
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import api from '../api/client';

const PRIORITY_COLORS = {
  High: '#FF5A5F',
  Medium: '#8B5CF6',
  Low: '#22C55E',
};

const RISK_COLORS = {
  High: '#FF5A5F',
  Medium: '#FB923C',
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

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [sumRes, prodRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/productivity'),
      ]);
      setSummary(sumRes.data);
      setProductivity(prodRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-[#64748B] text-sm font-bold flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
        <span>Loading productivity analytics dashboard...</span>
      </div>
    );
  }

  const priorityData = (summary?.priority_distribution || []).map((p) => ({
    name: p.priority,
    count: p.count,
    color: PRIORITY_COLORS[p.priority] || '#C4B5FD',
  }));

  const riskData = (summary?.risk_distribution || []).map((r) => ({
    name: `${r.risk_level} Risk`,
    count: r.count,
    color: RISK_COLORS[r.risk_level] || '#C4B5FD',
  }));

  const categoryData = summary?.category_distribution || [];
  const weeklyData = productivity?.weekly_history || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold border border-[#DDD6FE]">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Productivity Metrics & Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Productivity & AI Analytics</h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Velocity trends, completion ratios, priority spreads, and proactive risk distributions
        </p>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EDE9FE] shadow-card space-y-1 hover:-translate-y-1 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Completion Rate
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#7C3AED]">
            {summary?.completion_rate_percentage || 0}%
          </div>
          <p className="text-[11px] text-[#64748B] font-semibold">
            {summary?.completed_tasks || 0} of {summary?.total_tasks || 0} total tasks
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EDE9FE] shadow-card space-y-1 hover:-translate-y-1 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Avg. Completion Time
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            {summary?.average_completion_hours !== null ? `${summary.average_completion_hours}h` : 'N/A'}
          </div>
          <p className="text-[11px] text-[#64748B] font-semibold">
            {summary?.average_completion_hours !== null ? 'Based on completed tasks' : 'Complete tasks to calculate'}
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#BBF7D0]/60 shadow-card space-y-1 hover:-translate-y-1 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Daily Velocity
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#15803D]">
            {productivity?.overall_velocity_tasks_per_day || 0}
          </div>
          <p className="text-[11px] text-[#15803D] font-bold">Tasks / day (7-day avg)</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#FFD6BA]/60 shadow-card space-y-1 hover:-translate-y-1 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Subtask Progress
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#EA580C]">
            {productivity?.total_subtasks_completed || 0}/{productivity?.total_subtasks_count || 0}
          </div>
          <p className="text-[11px] text-[#EA580C] font-bold">Granular milestones fulfilled</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity Bar Chart */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7C3AED]" />
              <span>7-Day Activity Velocity</span>
            </h3>
            <span className="text-xs font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
              Created vs Completed
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9FE" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: '600' }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: '600' }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="created" name="Created" fill="#EDE9FE" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Pie Chart */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-[#FF5A5F]" />
            <span>Priority Distribution</span>
          </h3>

          <div className="h-64 flex items-center justify-center">
            {summary?.total_tasks === 0 ? (
              <div className="text-xs text-[#94A3B8] font-bold">No task data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7C3AED]" />
            <span>Domain Categories</span>
          </h3>

          <div className="h-64">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#94A3B8] font-bold">
                No categories to display
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EDE9FE" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: '600' }} />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} width={110} tick={{ fontSize: 11, fill: '#64748B', fontWeight: '600' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="count" name="Tasks" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Deadline Risk Matrix Chart */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#E03E44]" />
            <span>Risk Matrix Distribution</span>
          </h3>

          <div className="h-64 flex items-center justify-center">
            {summary?.total_tasks === 0 ? (
              <div className="text-xs text-[#94A3B8] font-bold">No risk records to display</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-4 text-xs font-bold text-[#64748B]">
            {riskData.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span>{r.name}: {r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
