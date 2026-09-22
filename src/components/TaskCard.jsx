import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  ListTree, 
  ArrowRight,
  Folder
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import RiskBadge from './RiskBadge';
import { useTask } from '../context/TaskContext';

const TaskCard = ({ task, onEdit }) => {
  const navigate = useNavigate();
  const { toggleTaskComplete, deleteTask } = useTask();

  const isCompleted = task.completion_status === 'Completed';
  const subtasksCount = task.subtasks?.length || 0;
  const subtasksCompleted = task.subtasks?.filter((s) => s.is_completed).length || 0;

  // Format deadline
  let deadlineText = 'No deadline';
  let isOverdue = false;
  if (task.deadline) {
    const dlDate = new Date(task.deadline);
    const now = new Date();
    isOverdue = dlDate < now && !isCompleted;
    deadlineText = dlDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Priority indicator stripe color
  const priorityBorderColor = 
    task.priority === 'High' 
      ? 'border-t-[#FF5A5F]' 
      : task.priority === 'Medium' 
      ? 'border-t-[#8B5CF6]' 
      : 'border-t-[#22C55E]';

  return (
    <div
      className={`group relative rounded-3xl border border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${priorityBorderColor} ${
        isCompleted 
          ? 'bg-[#FAF6EE]/90 border-[#EDE9FE] opacity-80' 
          : 'bg-[#FFFDF9] border-[#EDE9FE] shadow-sm'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3 min-w-0">
            <button
              onClick={() => toggleTaskComplete(task.id)}
              className="mt-0.5 shrink-0 text-[#94A3B8] hover:text-[#7C3AED] transition-colors cursor-pointer"
              title={isCompleted ? "Mark as pending" : "Mark as completed"}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#15803D] fill-[#DCFCE7]" />
              ) : (
                <Circle className="w-5 h-5 hover:stroke-[#7C3AED]" />
              )}
            </button>
            <div className="min-w-0">
              <h4
                onClick={() => navigate(`/tasks/${task.id}`)}
                className={`text-sm sm:text-base font-bold text-[#0F172A] cursor-pointer hover:text-[#7C3AED] transition-colors truncate ${
                  isCompleted ? 'line-through text-[#94A3B8]' : ''
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">{task.description}</p>
              )}
            </div>
          </div>

          {/* Action Menu Buttons */}
          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigate(`/tasks/${task.id}`)}
              title="View & Break Down"
              className="p-1.5 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#EDE9FE] rounded-xl transition-colors cursor-pointer"
            >
              <ListTree className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#FFEBDC] rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              title="Delete Task"
              className="p-1.5 text-[#64748B] hover:text-[#E03E44] hover:bg-[#FFE4E1] rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges & Category Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <PriorityBadge priority={task.priority} size="xs" />
          <RiskBadge riskLevel={task.risk_level} size="xs" />
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FAF6EE] text-[#64748B] text-[11px] font-bold border border-[#EDE9FE]">
            <Folder className="w-3 h-3 text-[#A78BFA]" />
            <span>{task.category || 'General'}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
            <span>Progress ({task.progress}%)</span>
            {subtasksCount > 0 && (
              <span className="text-[#7C3AED]">
                {subtasksCompleted}/{subtasksCount} subtasks
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-[#EDE9FE] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-[#22C55E] to-[#15803D]'
                  : task.progress > 50
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]'
                  : 'bg-gradient-to-r from-[#FF7875] to-[#FB923C]'
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {/* Footer info & Details Link */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE] text-xs text-[#64748B]">
          <div className="flex items-center gap-3 font-medium">
            {task.deadline && (
              <span
                className={`flex items-center gap-1.5 ${
                  isOverdue ? 'text-[#E03E44] font-bold' : 'text-[#64748B]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{deadlineText}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FB923C]" />
              <span>{task.estimated_duration}h</span>
            </span>
          </div>

          <button
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
