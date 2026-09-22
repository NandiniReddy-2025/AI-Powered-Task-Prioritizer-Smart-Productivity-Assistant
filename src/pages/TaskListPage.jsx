import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpDown,
  Inbox,
  Folder,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';

const CATEGORIES = [
  'All',
  'General',
  'Development',
  'Academic & Research',
  'Business & Marketing',
  'Design & Creative',
  'Operations & Admin',
  'Personal & Health',
];

const TaskListPage = () => {
  const { onOpenNewTask, onEditTask } = useOutletContext();
  const { tasks, loading, fetchTasks } = useTask();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    fetchTasks({
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter,
      riskLevel: riskFilter,
      search: search.trim() || undefined,
    });
  }, [statusFilter, categoryFilter, priorityFilter, riskFilter, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold mb-2 border border-[#DDD6FE]">
            <Folder className="w-3.5 h-3.5" />
            <span>Task Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Task Management</h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
            Organize, filter, prioritize, and track all your tasks and AI subtasks
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] text-white rounded-2xl text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EDE9FE] shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] focus:bg-[#FFFFFF] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 transition-all font-semibold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            {/* Priority Dropdown */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 transition-all font-semibold"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Risk Dropdown */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF6EE] text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 transition-all font-semibold"
            >
              <option value="All">All Risk Tiers</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-[#EDE9FE] overflow-x-auto">
          {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] text-[#0F172A] shadow-xs border border-[#DDD6FE]'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAF6EE]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#64748B] text-sm font-bold flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
          <span>Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-[#FFFDF9] rounded-3xl p-12 border border-[#EDE9FE] text-center space-y-4 max-w-lg mx-auto shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#FFEBDC] text-[#7C3AED] flex items-center justify-center mx-auto shadow-sm">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#0F172A]">No tasks found</h3>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
            {search || statusFilter !== 'All' || categoryFilter !== 'All'
              ? 'Try adjusting your filters or search query.'
              : 'Start your productivity journey by adding your first task.'}
          </p>
          <button
            onClick={onOpenNewTask}
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF5A5F] to-[#7C3AED] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md cursor-pointer"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
