import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle,
  Loader2,
  Tag,
  Folder
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import PriorityBadge from '../components/PriorityBadge';
import RiskBadge from '../components/RiskBadge';
import SubtaskList from '../components/SubtaskList';
import api from '../api/client';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onEditTask } = useOutletContext();
  const { toggleTaskComplete, deleteTask } = useTask();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTask = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error('Failed to load task details:', err);
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-[#64748B] text-sm font-bold flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
        <span>Loading task details...</span>
      </div>
    );
  }

  if (!task) return null;

  const isCompleted = task.completion_status === 'Completed';

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
      navigate('/tasks');
    }
  };

  const handleToggle = async () => {
    const res = await toggleTaskComplete(task.id);
    if (res.success) {
      setTask(res.task);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Back & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer bg-[#FFFDF9] px-4 py-2 rounded-2xl border border-[#EDE9FE] shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditTask(task)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFFDF9] hover:bg-[#FFEBDC] text-[#0F172A] rounded-2xl border border-[#EDE9FE] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFF1F0] hover:bg-[#FFE4E1] text-[#E03E44] rounded-2xl border border-[#FFCCC7] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EDE9FE] shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} size="sm" />
              <RiskBadge riskLevel={task.risk_level} size="sm" />
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FAF6EE] text-[#64748B] text-xs font-bold border border-[#EDE9FE]">
                <Folder className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{task.category || 'General'}</span>
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] leading-snug ${isCompleted ? 'line-through text-[#94A3B8]' : ''}`}>
              {task.title}
            </h1>
          </div>

          <button
            onClick={handleToggle}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer ${
              isCompleted
                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] hover:bg-[#BBF7D0]'
                : 'bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] text-white hover:from-[#E03E44] hover:to-[#6D28D9] shadow-md shadow-lavender-500/20'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Mark as Complete</span>
              </>
            )}
          </button>
        </div>

        {/* Task Description */}
        {task.description && (
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE9FE] text-sm text-[#0F172A] leading-relaxed font-medium">
            {task.description}
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EDE9FE]">
          <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-[#EDE9FE]">
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Deadline</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm font-black text-[#0F172A]">
              <Calendar className="w-4 h-4 text-[#8B5CF6]" />
              <span>{task.deadline ? new Date(task.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No deadline'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-[#EDE9FE]">
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Estimated Effort</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm font-black text-[#0F172A]">
              <Clock className="w-4 h-4 text-[#FB923C]" />
              <span>{task.estimated_duration} hours</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-[#EDE9FE]">
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Status</span>
            <span className="inline-block mt-1 text-xs sm:text-sm font-black text-[#0F172A]">
              {task.completion_status} ({task.progress}%)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6EE]/70 border border-[#EDE9FE]">
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Created</span>
            <span className="inline-block mt-1 text-xs sm:text-sm font-bold text-[#64748B]">
              {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Deadline Risk & Prescriptive AI Card */}
      {task.risk_reason && (
        <div className={`p-6 sm:p-7 rounded-3xl border shadow-card space-y-3 ${
          task.risk_level === 'High'
            ? 'bg-gradient-to-r from-[#FFF1F0] via-[#FFE4E1] to-[#FFF1F0] border-[#FFCCC7] text-[#E03E44]'
            : task.risk_level === 'Medium'
            ? 'bg-gradient-to-r from-[#FFF6EF] via-[#FFEBDC] to-[#FFF6EF] border-[#FFD6BA] text-[#EA580C]'
            : 'bg-gradient-to-r from-[#F0FDF4] via-[#DCFCE7] to-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-extrabold">Deadline Risk Assessment ({task.risk_level} Risk)</h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#0F172A] font-semibold">{task.risk_reason}</p>
          {task.suggested_action && (
            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#EDE9FE] text-xs font-semibold space-y-1 text-[#0F172A] shadow-xs">
              <span className="font-extrabold uppercase text-[10px] tracking-wider block text-[#7C3AED]">
                Suggested Prescriptive Action:
              </span>
              <p className="text-[#475569]">{task.suggested_action}</p>
            </div>
          )}
        </div>
      )}

      {/* Subtasks Checklist Section */}
      <SubtaskList task={task} onTaskUpdated={loadTask} />
    </div>
  );
};

export default TaskDetailPage;
