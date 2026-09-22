import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  Info,
  Sliders,
  Plus,
  Cpu,
  Check
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import PriorityBadge from '../components/PriorityBadge';

const SAMPLE_PROMPTS = [
  "Fix critical production database connection leak by tonight",
  "Prepare presentation slides for thesis defense committee next Tuesday",
  "Design responsive Figma wireframes for mobile dashboard overhaul",
  "Optional: Explore new dark mode color theme whenever schedule clears",
];

const AIPrioritizerPage = () => {
  const navigate = useNavigate();
  const { prioritizeWithAI, createTask } = useTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState('2.0');
  const [userImportance, setUserImportance] = useState('Medium');
  const [availableTime, setAvailableTime] = useState('');
  const [category, setCategory] = useState('Development');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      estimated_duration: parseFloat(duration) || 1.0,
      category,
      user_importance: userImportance,
      available_time: availableTime ? parseFloat(availableTime) : null,
    };

    const res = await prioritizeWithAI(payload);
    setLoading(false);
    if (res.success) {
      setResult(res.data);
    }
  };

  const handleSaveToWorkspace = async () => {
    if (!title.trim() || !result) return;
    setIsSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category: result.predicted_category || category,
      priority: result.predicted_priority || 'Medium',
      deadline: deadline ? new Date(deadline).toISOString() : null,
      estimated_duration: parseFloat(duration) || 1.0,
      user_importance: userImportance,
      available_time: availableTime ? parseFloat(availableTime) : null,
    };

    const res = await createTask(payload);
    setIsSaving(false);
    if (res.success) {
      navigate('/tasks');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EDE9FE] to-[#FCE7F3] border border-[#DDD6FE] text-[#7C3AED] text-xs font-black shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
          <span>PyTorch Deep Learning NLP Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
          Smart Task Prioritizer
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed font-semibold">
          Input your task using natural language. Our Deep Learning model processes semantic urgency keywords, duration metrics, and temporal constraints to predict calibrated priority tiers with full explainability.
        </p>
      </div>

      {/* Main Grid: Input Form & Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EDE9FE] shadow-card space-y-6">
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span>Task Input & Context</span>
          </h2>

          {/* Sample Prompts Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
              Try a sample task prompt:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(prompt);
                    setResult(null);
                  }}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#EDE9FE] text-[#475569] hover:text-[#0F172A] transition-colors text-left border border-[#EDE9FE] hover:border-[#DDD6FE] cursor-pointer"
                >
                  "{prompt.slice(0, 36)}..."
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Task Title (Natural Language) <span className="text-[#FF5A5F]">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Complete my final-year Deep Learning project documentation by tomorrow."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Detailed Context / Description
              </label>
              <textarea
                rows={2}
                placeholder="Include blockers, technical specs, dependencies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Target Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Estimated Duration (Hours)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  User Stated Importance
                </label>
                <select
                  value={userImportance}
                  onChange={(e) => setUserImportance(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-semibold"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Category (Optional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 font-semibold"
                >
                  <option value="Development">Development</option>
                  <option value="Academic & Research">Academic & Research</option>
                  <option value="Business & Marketing">Business & Marketing</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Operations & Admin">Operations & Admin</option>
                  <option value="Personal & Health">Personal & Health</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running PyTorch NLP Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict Priority & Explain</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EDE9FE] shadow-card space-y-6 animate-scale-in">
              {/* Predicted Priority Header */}
              <div className="space-y-3 pb-5 border-b border-[#EDE9FE]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Model Prediction Output
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PriorityBadge priority={result.predicted_priority} size="lg" />
                    <span className="text-xs font-black text-[#0F172A]">
                      {Math.round(result.confidence_score * 100)}% Confidence
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFEBDC] text-[#EA580C] text-xs font-extrabold border border-[#FFD6BA]">
                    {result.detected_urgency}
                  </span>
                </div>

                {/* Class Probabilities Progress Bars */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-extrabold text-[#64748B] block">Class Probabilities:</span>
                  {Object.entries(result.class_probabilities || {}).map(([cls, prob]) => (
                    <div key={cls} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#0F172A]">
                        <span>{cls} Priority</span>
                        <span>{Math.round(prob * 100)}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#EDE9FE] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cls === 'High' 
                              ? 'bg-gradient-to-r from-[#FF7875] to-[#E03E44]' 
                              : cls === 'Medium' 
                              ? 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]' 
                              : 'bg-gradient-to-r from-[#86EFAC] to-[#15803D]'
                          }`}
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Natural Language Explanation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] border border-[#DDD6FE] space-y-1.5 shadow-2xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  Model Explanation:
                </span>
                <p className="text-xs text-[#0F172A] leading-relaxed font-bold">
                  {result.explanation}
                </p>
              </div>

              {/* Transparent Attribution Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                  Explainable Attribution Breakdown
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Model Predicted */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EDE9FE] space-y-1">
                    <span className="font-extrabold text-[#7C3AED] block">1. Model Predicted Features:</span>
                    <p className="text-[#64748B] font-medium">
                      • Priority Class: <strong className="text-[#0F172A]">{result.breakdown.model_predicted.priority_class}</strong>
                    </p>
                    <p className="text-[#64748B] font-medium">
                      • Detected Domain: <strong className="text-[#0F172A]">{result.breakdown.model_predicted.domain_category}</strong>
                    </p>
                    <p className="text-[#64748B] font-medium">
                      • Text Urgency: <strong className="text-[#0F172A]">{result.breakdown.model_predicted.detected_urgency_from_text}</strong>
                    </p>
                  </div>

                  {/* System Calculated */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EDE9FE] space-y-1">
                    <span className="font-extrabold text-[#EA580C] block">2. System-Calculated Metrics:</span>
                    <p className="text-[#64748B] font-medium">
                      • Deadline Proximity: <strong className="text-[#0F172A]">{result.breakdown.system_calculated.deadline_proximity_days ?? 'N/A'} days</strong>
                    </p>
                    <p className="text-[#64748B] font-medium">
                      • Time Remaining: <strong className="text-[#0F172A]">{result.breakdown.system_calculated.time_remaining_hours ?? 'N/A'} hours</strong>
                    </p>
                  </div>

                  {/* User Provided */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EDE9FE] space-y-1">
                    <span className="font-extrabold text-[#15803D] block">3. User-Provided Values:</span>
                    <p className="text-[#64748B] font-medium">
                      • Stated Importance: <strong className="text-[#0F172A]">{result.breakdown.user_provided.user_importance}</strong>
                    </p>
                    <p className="text-[#64748B] font-medium">
                      • Estimated Duration: <strong className="text-[#0F172A]">{result.breakdown.user_provided.user_estimated_duration_hours}h</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Save To Workspace Action */}
              <button
                onClick={handleSaveToWorkspace}
                disabled={isSaving}
                className="w-full py-3.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                <span>Save Directly to My Tasks</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-dashed border-[#DDD6FE] text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[340px] shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EDE9FE] to-[#FFE4E1] text-[#7C3AED] flex items-center justify-center shadow-xs">
                <Sparkles className="w-8 h-8 text-[#FF5A5F]" />
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Awaiting Task Prompt</h4>
              <p className="text-xs text-[#64748B] max-w-xs leading-relaxed font-semibold">
                Type a natural language task description and click "Predict Priority & Explain" to view neural predictions and explainability metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPrioritizerPage;
