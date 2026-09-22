import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Sliders,
  TrendingDown,
  Info
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import RiskBadge from '../components/RiskBadge';
import PriorityBadge from '../components/PriorityBadge';

const DeadlineRiskPage = () => {
  const navigate = useNavigate();
  const { tasks, evaluateRiskWithAI } = useTask();

  const [simTitle, setSimTitle] = useState('Complete project documentation');
  const [simPriority, setSimPriority] = useState('High');
  const [simDeadline, setSimDeadline] = useState('');
  const [simDuration, setSimDuration] = useState('6.0');
  const [simProgress, setSimProgress] = useState(20);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Set default sim deadline to tomorrow
  useEffect(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(18, 0, 0, 0);
    setSimDeadline(tmrw.toISOString().slice(0, 16));
  }, []);

  const atRiskTasks = tasks.filter(
    (t) => t.completion_status !== 'Completed' && (t.risk_level === 'High' || t.risk_level === 'Medium')
  );

  const handleRunSimulation = async (e) => {
    if (e) e.preventDefault();
    setSimulating(true);

    const payload = {
      title: simTitle,
      priority: simPriority,
      deadline: simDeadline ? new Date(simDeadline).toISOString() : null,
      estimated_duration: parseFloat(simDuration) || 1.0,
      progress: parseInt(simProgress, 10) || 0,
    };

    const res = await evaluateRiskWithAI(payload);
    setSimulating(false);
    if (res.success) {
      setSimResult(res.data);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FFE4E1] to-[#FFEBDC] border border-[#FFCCC7] text-[#E03E44] text-xs font-black shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-[#E03E44]" />
          <span>Proactive Deadline Risk Radar & Prevention</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
          Deadline Risk Monitor
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed font-semibold">
          The system continuously evaluates temporal constraints, remaining effort, and progress deficits to identify bottlenecks before milestones are breached.
        </p>
      </div>

      {/* Real-time At-Risk Tasks Radar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E03E44]" />
            <span>Tasks Requiring Immediate Attention ({atRiskTasks.length})</span>
          </h2>
        </div>

        {atRiskTasks.length === 0 ? (
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#EDE9FE] shadow-card text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] text-[#15803D] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-[#0F172A]">All Schedules On Track!</h4>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto font-medium">
              No tasks currently exhibit critical time pressure or progress deficits. Maintain your current pace.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atRiskTasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 sm:p-6 rounded-3xl border shadow-card space-y-3 transition-all ${
                  task.risk_level === 'High'
                    ? 'bg-gradient-to-br from-[#FFF1F0] via-[#FFE4E1]/80 to-[#FFF1F0] border-[#FFCCC7]'
                    : 'bg-gradient-to-br from-[#FFF6EF] via-[#FFEBDC]/80 to-[#FFF6EF] border-[#FFD6BA]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <RiskBadge riskLevel={task.risk_level} size="xs" />
                      <PriorityBadge priority={task.priority} size="xs" />
                    </div>
                    <h3
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="text-sm sm:text-base font-black text-[#0F172A] cursor-pointer hover:text-[#7C3AED] transition-colors"
                    >
                      {task.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="p-2 text-[#64748B] hover:text-[#7C3AED] bg-white rounded-xl border border-[#EDE9FE] cursor-pointer shadow-xs transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Risk Explanation */}
                <div className="text-xs text-[#475569] leading-relaxed font-semibold">
                  {task.risk_reason || 'Schedule risk detected based on remaining effort.'}
                </div>

                {/* Prescriptive Action */}
                {task.suggested_action && (
                  <div className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EDE9FE] text-xs text-[#0F172A] space-y-1 shadow-2xs">
                    <span className="font-extrabold text-[10px] uppercase text-[#E03E44] tracking-wider block">
                      Recommended Mitigation Action:
                    </span>
                    <p className="text-[#475569] font-medium">{task.suggested_action}</p>
                  </div>
                )}

                {/* Footer stats */}
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#EDE9FE] font-bold">
                  <span>Progress: {task.progress}%</span>
                  <span>Est. Duration: {task.estimated_duration}h</span>
                  <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Risk Simulator Tool */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EDE9FE] shadow-card space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <Sliders className="w-4 h-4" />
            </div>
            <span>Interactive Risk Simulator & Calculator</span>
          </h2>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            Simulate different deadlines and progress levels to test the risk engine in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Inputs (7 Cols) */}
          <form onSubmit={handleRunSimulation} className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                Scenario Task Title
              </label>
              <input
                type="text"
                value={simTitle}
                onChange={(e) => setSimTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Priority
                </label>
                <select
                  value={simPriority}
                  onChange={(e) => setSimPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-semibold"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Est. Effort (Hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={simDuration}
                  onChange={(e) => setSimDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Target Deadline
                </label>
                <input
                  type="datetime-local"
                  value={simDeadline}
                  onChange={(e) => setSimDeadline(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-medium"
                />
              </div>
            </div>

            {/* Progress Slider */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EDE9FE]">
              <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                <span>Simulated Progress Percentage</span>
                <span className="font-mono text-[#7C3AED] font-extrabold">{simProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simProgress}
                onChange={(e) => setSimProgress(e.target.value)}
                className="w-full accent-[#7C3AED] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={simulating}
              className="w-full py-3 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Calculate Scenario Risk</span>
            </button>
          </form>

          {/* Simulator Results (5 Cols) */}
          <div className="lg:col-span-5 bg-[#FAF6EE] rounded-2xl p-5 border border-[#EDE9FE] space-y-4">
            {simResult ? (
              <div className="space-y-3.5 text-xs animate-scale-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                  <span className="font-black text-[#0F172A] text-sm">Forecasted Risk:</span>
                  <RiskBadge riskLevel={simResult.risk_level} score={simResult.risk_score} size="sm" />
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-[#0F172A] block">Risk Diagnosis:</span>
                  <p className="text-[#64748B] leading-relaxed font-semibold">{simResult.risk_reason}</p>
                </div>

                <div className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EDE9FE] space-y-1 shadow-2xs">
                  <span className="font-extrabold text-[#E03E44] block text-[10px] uppercase tracking-wider">
                    Prescriptive Action:
                  </span>
                  <p className="text-[#0F172A] font-semibold leading-relaxed">{simResult.suggested_action}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#64748B] py-8 space-y-2">
                <Info className="w-7 h-7 text-[#7C3AED]" />
                <p className="text-xs font-semibold">Adjust the sliders and parameters, then click calculate to view real-time risk scores.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineRiskPage;
