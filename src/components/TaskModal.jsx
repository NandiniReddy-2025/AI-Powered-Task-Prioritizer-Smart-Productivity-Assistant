import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, ListPlus, Calendar, Clock, Target, Tag, BrainCircuit } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import PriorityBadge from './PriorityBadge';

const CATEGORIES = [
  'General',
  'Development',
  'Academic & Research',
  'Business & Marketing',
  'Design & Creative',
  'Operations & Admin',
  'Personal & Health',
];

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { createTask, updateTask, prioritizeWithAI } = useTask();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    deadline: '',
    estimated_duration: 1.0,
    user_importance: 'Medium',
    available_time: '',
    subtasks: [''],
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        category: taskToEdit.category || 'General',
        priority: taskToEdit.priority || 'Medium',
        deadline: taskToEdit.deadline ? taskToEdit.deadline.slice(0, 16) : '',
        estimated_duration: taskToEdit.estimated_duration || 1.0,
        user_importance: taskToEdit.user_importance || 'Medium',
        available_time: taskToEdit.available_time || '',
        subtasks: [''],
      });
      setAiAnalysis(null);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'General',
        priority: 'Medium',
        deadline: '',
        estimated_duration: 1.0,
        user_importance: 'Medium',
        available_time: '',
        subtasks: [''],
      });
      setAiAnalysis(null);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAiPrioritize = async () => {
    if (!formData.title.trim()) return;
    setIsAnalyzing(true);
    const payload = {
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      estimated_duration: parseFloat(formData.estimated_duration) || 1.0,
      category: formData.category,
      user_importance: formData.user_importance,
      available_time: formData.available_time ? parseFloat(formData.available_time) : null,
    };

    const res = await prioritizeWithAI(payload);
    setIsAnalyzing(false);
    if (res.success) {
      setAiAnalysis(res.data);
      setFormData((prev) => ({
        ...prev,
        priority: res.data.predicted_priority,
        category: prev.category === 'General' && res.data.predicted_category ? res.data.predicted_category : prev.category,
      }));
    }
  };

  const handleSubtaskChange = (index, value) => {
    const newSubs = [...formData.subtasks];
    newSubs[index] = value;
    setFormData({ ...formData, subtasks: newSubs });
  };

  const addSubtaskField = () => {
    setFormData({ ...formData, subtasks: [...formData.subtasks, ''] });
  };

  const removeSubtaskField = (index) => {
    const newSubs = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: newSubs.length ? newSubs : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    const cleanedSubtasks = formData.subtasks.filter((s) => s.trim().length > 0);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      category: formData.category,
      priority: formData.priority,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      estimated_duration: parseFloat(formData.estimated_duration) || 1.0,
      user_importance: formData.user_importance || null,
      available_time: formData.available_time ? parseFloat(formData.available_time) : null,
      subtasks: cleanedSubtasks.length ? cleanedSubtasks : undefined,
    };

    let result;
    if (taskToEdit) {
      result = await updateTask(taskToEdit.id, payload);
    } else {
      result = await createTask(payload);
    }

    setSubmitting(false);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] rounded-3xl shadow-card-hover border border-[#EDE9FE] w-full max-w-2xl my-8 overflow-hidden transition-all animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE9FE] bg-gradient-to-r from-[#EDE9FE]/70 via-[#FFF1F0]/70 to-[#FFEBDC]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
                {taskToEdit ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {taskToEdit ? 'Update details, deadlines and parameters' : 'Fill details or let AI predict priorities automatically'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-[#FFFFFF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Task Title <span className="text-[#FF5A5F]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Deep Learning paper camera-ready version by Friday"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Description & Context
            </label>
            <textarea
              rows={3}
              placeholder="Add key objectives, blockers, dependencies, or acceptance criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none transition-all"
            />
          </div>

          {/* AI Smart Prioritize Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] border border-[#DDD6FE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#7C3AED] shadow-xs shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  AI Deep Learning Predictor
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Infer priority and domain category from natural language
                </span>
              </div>
            </div>
            <button
              type="button"
              disabled={!formData.title.trim() || isAnalyzing}
              onClick={handleAiPrioritize}
              className="px-4 py-2 bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Smart Predict</span>
                </>
              )}
            </button>
          </div>

          {/* AI Prioritization Result Banner */}
          {aiAnalysis && (
            <div className="p-4 rounded-2xl bg-[#EDE9FE]/60 border border-[#DDD6FE] shadow-xs text-xs space-y-2 animate-scale-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#0F172A]">AI Predicted:</span>
                  <PriorityBadge priority={aiAnalysis.predicted_priority} size="xs" />
                  <span className="text-[#64748B] font-bold">
                    ({Math.round(aiAnalysis.confidence_score * 100)}% confidence)
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFE4E1] text-[#E03E44] text-[10px] font-extrabold border border-[#FFCCC7]">
                  {aiAnalysis.detected_urgency} Urgency
                </span>
              </div>
              <p className="text-[#475569] leading-relaxed font-medium">{aiAnalysis.explanation}</p>
            </div>
          )}

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 text-sm font-semibold text-[#0F172A] transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 text-sm font-semibold text-[#0F172A] transition-all"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Deadline & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Target Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 text-xs text-[#0F172A] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Est. Duration (Hours)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 text-xs text-[#0F172A] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                User Importance
              </label>
              <select
                value={formData.user_importance}
                onChange={(e) => setFormData({ ...formData, user_importance: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 text-xs text-[#0F172A] transition-all font-medium"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Initial Subtasks */}
          {!taskToEdit && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Initial Subtasks (Optional)
                </label>
                <button
                  type="button"
                  onClick={addSubtaskField}
                  className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.subtasks.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Milestone step ${idx + 1}...`}
                      value={sub}
                      onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs text-[#0F172A] focus:outline-hidden focus:ring-1 focus:ring-[#7C3AED] transition-all"
                    />
                    {formData.subtasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubtaskField(idx)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#E03E44] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE9FE]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:bg-[#EDE9FE] rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.title.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
