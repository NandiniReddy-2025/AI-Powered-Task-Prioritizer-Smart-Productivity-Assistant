import React, { useState } from 'react';
import { Menu, Plus, Search, Bell, ChevronDown, User as UserIcon, LogOut, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick, onOpenNewTaskModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EDE9FE] px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Left controls & Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-2xl hover:bg-[#EDE9FE] lg:hidden transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search tasks, goals, or AI predictions..."
            onClick={() => navigate('/tasks')}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF6EE] hover:bg-[#EDE9FE]/50 focus:bg-[#FFFFFF] rounded-2xl border border-[#EDE9FE] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all cursor-pointer shadow-2xs"
            readOnly
          />
        </div>
      </div>

      {/* Right Action controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Add Task Primary Action */}
        {onOpenNewTaskModal && (
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] hover:from-[#E03E44] hover:to-[#6D28D9] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-lavender-500/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        )}

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 text-[#475569] hover:text-[#0F172A] rounded-2xl bg-[#FAF6EE] hover:bg-[#EDE9FE] border border-[#EDE9FE] relative transition-colors cursor-pointer shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#FF5A5F] absolute top-2 right-2 ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-76 bg-[#FFFDF9] rounded-3xl border border-[#EDE9FE] shadow-card-hover p-4 space-y-2.5 z-50 animate-scale-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
                <span className="text-xs font-bold text-[#0F172A]">Notifications</span>
                <span className="text-[10px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full border border-[#DDD6FE]">
                  Active Engine
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#EDE9FE] to-[#FCE7F3] border border-[#DDD6FE] text-xs space-y-1">
                <p className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Deep Learning NLP Active
                </p>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  PyTorch BiLSTM neural engine is actively assessing deadline risks and task priority.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-[#EDE9FE] hidden sm:block" />

        {/* User Avatar & Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-[#EDE9FE]/50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'N'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-[#0F172A] leading-tight">
                {user?.full_name || 'Nandini'}
              </p>
              <p className="text-[10px] font-medium text-[#64748B]">{today}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden md:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#FFFDF9] rounded-3xl border border-[#EDE9FE] shadow-card-hover p-2 z-50 space-y-1 animate-scale-in">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#EDE9FE] rounded-2xl transition-colors text-left cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-[#7C3AED]" />
                <span>Profile & Model</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#E03E44] hover:bg-[#FFE4E1] rounded-2xl transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
