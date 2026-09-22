import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2, 
  ListTree,
  Clock,
  Layers
} from 'lucide-react';
import { useTask } from '../context/TaskContext';

const SubtaskList = ({ task, onTaskUpdated }) => {
  const { addSubtask, updateSubtask, deleteSubtask, breakdownWithAI } = useTask();

  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const subtasks = task.subtasks || [];
  const completedCount = subtasks.filter((s) => s.is_completed).length;
  const progressPercent = subtasks.length ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const handleToggleSubtask = async (subtask) => {
    await updateSubtask(task.id, subtask.id, { is_completed: !subtask.is_completed });
    if (onTaskUpdated) onTaskUpdated();
  };

  const handleAddManualSubtask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    await addSubtask(task.id, { title: newTitle.trim(), is_completed: false });
    setNewTitle('');
    setIsAdding(false);
    if (onTaskUpdated) onTaskUpdated();
  };

  const handleTriggerAiBreakdown = async () => {
    setIsGeneratingAI(true);
    const res = await breakdownWithAI({
      title: task.title,
      description: task.description,
      category: task.category,
    });
    setIsGeneratingAI(false);
    if (res.success) {
      setAiSuggestions(res.data.suggested_subtasks);
    }
  };

  const handleImportAllAiSubtasks = async () => {
    if (!aiSuggestions || !aiSuggestions.length) return;
    for (const item of aiSuggestions) {
      await addSubtask(task.id, { title: item.title, is_completed: false });
    }
    setAiSuggestions(null);
    if (onTaskUpdated) onTaskUpdated();
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl border border-[#EDE9FE] shadow-card p-5 sm:p-7 space-y-6">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE9FE]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <ListTree className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">Subtasks & Milestones</h3>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-semibold">
            {completedCount} of {subtasks.length} subtasks completed ({progressPercent}%)
          </p>
        </div>

        {/* AI Breakdown Button */}
        <button
          onClick={handleTriggerAiBreakdown}
          disabled={isGeneratingAI}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] hover:from-[#DDD6FE] hover:to-[#FFD6BA] text-[#7C3AED] rounded-2xl text-xs font-bold border border-[#DDD6FE] shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isGeneratingAI ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C3AED]" />
              <span>Generating Steps...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>AI Task Breakdown</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-[#EDE9FE] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF7875] via-[#8B5CF6] to-[#22C55E] rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* AI Breakdown Preview & Import Banner */}
      {aiSuggestions && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#EDE9FE]/50 via-[#FFF1F0]/40 to-[#FFEBDC]/50 border border-[#DDD6FE] space-y-3 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
              <span className="text-xs font-extrabold text-[#0F172A]">
                AI Suggested Milestones ({aiSuggestions.length} steps)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAiSuggestions(null)}
                className="text-xs text-[#64748B] hover:text-[#0F172A] px-2 py-1 cursor-pointer font-bold"
              >
                Dismiss
              </button>
              <button
                onClick={handleImportAllAiSubtasks}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Import All
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {aiSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF9] border border-[#EDE9FE] text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-[#EDE9FE] text-[#7C3AED] font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-[#0F172A]">{item.title}</span>
                </div>
                <span className="text-[11px] text-[#64748B] font-mono flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-[#FB923C]" />
                  {item.estimated_hours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtasks List */}
      <div className="space-y-2">
        {subtasks.length === 0 ? (
          <div className="py-8 text-center text-[#94A3B8] text-xs font-semibold">
            No subtasks added yet. Add steps manually below or click "AI Task Breakdown".
          </div>
        ) : (
          subtasks.map((sub) => (
            <div
              key={sub.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                sub.is_completed
                  ? 'bg-[#FAF6EE] border-[#EDE9FE] text-[#94A3B8]'
                  : 'bg-[#FFFDF9] border-[#EDE9FE] text-[#0F172A] hover:border-[#DDD6FE] shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleToggleSubtask(sub)}
                  className="shrink-0 text-[#94A3B8] hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  {sub.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] fill-[#DCFCE7]" />
                  ) : (
                    <Circle className="w-5 h-5 hover:stroke-[#7C3AED]" />
                  )}
                </button>
                <span className={`text-xs sm:text-sm font-semibold truncate ${sub.is_completed ? 'line-through opacity-70' : ''}`}>
                  {sub.title}
                </span>
              </div>

              <button
                onClick={() => deleteSubtask(task.id, sub.id)}
                className="p-1.5 text-[#94A3B8] hover:text-[#E03E44] rounded-xl hover:bg-[#FFE4E1] transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add New Subtask Input Form */}
      <form onSubmit={handleAddManualSubtask} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="Add a new milestone step..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 placeholder:text-[#94A3B8] transition-all"
        />
        <button
          type="submit"
          disabled={isAdding || !newTitle.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-lavender-500/20 transition-all active:scale-95 cursor-pointer"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">Add Step</span>
        </button>
      </form>
    </div>
  );
};

export default SubtaskList;
