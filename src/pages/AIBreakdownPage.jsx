import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ListTree, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  Layers, 
  Calendar,
  Tag,
  Target
} from 'lucide-react';
import { useTask } from '../context/TaskContext';

const SAMPLE_GOALS = [
  "Complete my final-year Deep Learning project",
  "Launch a modern full-stack web application with React and FastAPI",
  "Write and submit an academic research paper on Transformer architectures",
  "Plan and execute a Q3 marketing campaign for SaaS product launch",
  "Redesign mobile checkout flow and user dashboard in Figma",
];

const AIBreakdownPage = () => {
  const navigate = useNavigate();
  const { breakdownWithAI, createTask } = useTask();

  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [category, setCategory] = useState('Development');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [domain, setDomain] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleDecompose = async (e) => {
    if (e) e.preventDefault();
    if (!goalTitle.trim()) return;

    setLoading(true);
    const res = await breakdownWithAI({
      title: goalTitle.trim(),
      description: goalDesc.trim() || null,
      category,
    });
    setLoading(false);
    if (res.success) {
      setSubtasks(res.data.suggested_subtasks || []);
      setDomain(res.data.domain);
      setTotalHours(res.data.total_estimated_hours);
    }
  };

  const handleUpdateSubtaskTitle = (idx, newTitle) => {
    const updated = [...subtasks];
    updated[idx].title = newTitle;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (idx) => {
    const updated = subtasks.filter((_, i) => i !== idx);
    setSubtasks(updated);
  };

  const handleAddCustomSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        title: 'New customized milestone',
        estimated_hours: 2.0,
        order_index: subtasks.length,
        phase: 'Custom',
      },
    ]);
  };

  const handleSaveToTasks = async () => {
    if (!goalTitle.trim() || !subtasks.length) return;
    setSaving(true);

    const subtaskTitles = subtasks.map((s) => s.title.trim()).filter(Boolean);
    const payload = {
      title: goalTitle.trim(),
      description: goalDesc.trim() || `Domain: ${domain}`,
      category,
      priority: 'High',
      deadline: deadline ? new Date(deadline).toISOString() : null,
      estimated_duration: totalHours || 8.0,
      subtasks: subtaskTitles,
    };

    const res = await createTask(payload);
    setSaving(false);
    if (res.success) {
      navigate('/tasks');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EDE9FE] to-[#FFEBDC] border border-[#DDD6FE] text-[#7C3AED] text-xs font-black shadow-2xs">
          <ListTree className="w-4 h-4 text-[#FF5A5F]" />
          <span>Semantic Goal Decomposition & Phasing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
          AI Task Breakdown & Goal Planner
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed font-semibold">
          Break large, overwhelming objectives into structured, phase-oriented subtasks with recommended time allocations tailored specifically to your domain.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Goal Input (5 Cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-5">
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <Target className="w-4 h-4" />
            </div>
            <span>Define High-Level Goal</span>
          </h2>

          {/* Sample Goals */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
              Sample Goals:
            </span>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_GOALS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGoalTitle(sample);
                    setSubtasks([]);
                  }}
                  className="text-[11px] font-bold p-2.5 rounded-xl bg-[#FAF6EE] hover:bg-[#EDE9FE] text-[#475569] hover:text-[#0F172A] transition-colors text-left truncate border border-[#EDE9FE] hover:border-[#DDD6FE] cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleDecompose} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Main Goal / Project Title <span className="text-[#FF5A5F]">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Complete my final-year Deep Learning project"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Target Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !goalTitle.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Decomposing Goal into Phases...</span>
                </>
              ) : (
                <>
                  <ListTree className="w-4 h-4" />
                  <span>Generate AI Subtasks</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Subtasks Workbench (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {subtasks.length > 0 ? (
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EDE9FE] shadow-card space-y-6 animate-scale-in">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE9FE]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] block">
                    Domain Detected: {domain}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0F172A] mt-0.5">
                    Suggested Execution Plan
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FFEBDC] text-[#EA580C] border border-[#FFD6BA] text-xs font-black flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{totalHours}h Total</span>
                  </span>
                  <button
                    onClick={handleAddCustomSubtask}
                    className="px-3 py-1 rounded-xl bg-[#FAF6EE] hover:bg-[#EDE9FE] text-[#0F172A] border border-[#EDE9FE] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Add Step</span>
                  </button>
                </div>
              </div>

              {/* Subtasks Reorderable & Editable List */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {subtasks.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] border border-[#EDE9FE] group hover:border-[#DDD6FE] hover:bg-[#FFFDF9] transition-all shadow-2xs"
                  >
                    <span className="w-6 h-6 rounded-xl bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => handleUpdateSubtaskTitle(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-[#0F172A] focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-[#7C3AED] rounded-lg px-2 py-1"
                    />

                    {sub.phase && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] hidden sm:inline">
                        {sub.phase}
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-[#64748B] shrink-0 flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#FB923C]" />
                      {sub.estimated_hours}h
                    </span>

                    <button
                      onClick={() => handleRemoveSubtask(idx)}
                      className="p-1 text-[#94A3B8] hover:text-[#E03E44] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE9FE]">
                <button
                  onClick={handleSaveToTasks}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save as Project Task ({subtasks.length} Subtasks)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-dashed border-[#DDD6FE] text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[320px] shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EDE9FE] to-[#DCFCE7] text-[#7C3AED] flex items-center justify-center shadow-xs">
                <ListTree className="w-8 h-8 text-[#15803D]" />
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">No Goal Decomposed Yet</h4>
              <p className="text-xs text-[#64748B] max-w-xs leading-relaxed font-semibold">
                Enter a major goal or project title on the left and click "Generate AI Subtasks" to create an actionable milestone breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBreakdownPage;
