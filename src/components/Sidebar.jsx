import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Sparkles, 
  ListTree, 
  ShieldAlert, 
  BarChart3, 
  User, 
  LogOut, 
  BrainCircuit, 
  X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'AI Prioritizer', path: '/ai-prioritizer', icon: Sparkles, badge: 'Deep Learning', badgeColor: 'bg-[#FFE4E1] text-[#E03E44] border border-[#FFCCC7]' },
  { name: 'AI Breakdown', path: '/ai-breakdown', icon: ListTree, badge: 'NLP', badgeColor: 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]' },
  { name: 'Deadline Risk', path: '/deadline-risk', icon: ShieldAlert, badge: 'Radar', badgeColor: 'bg-[#FFEBDC] text-[#EA580C] border border-[#FFD6BA]' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile & Model', path: '/profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#FFFDF9]/95 backdrop-blur-xl border-r border-[#EDE9FE] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#EDE9FE]/80 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A5F] via-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-lavender-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#0F172A] text-base leading-tight block tracking-tight">
                  PlanPulse <span className="text-[#7C3AED]">AI</span>
                </span>
                <span className="text-[11px] font-bold text-[#FF5A5F] tracking-wide block">
                  Productivity Suite
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-[#EDE9FE] lg:hidden transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3.5 py-5 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]">
              Main Menu
            </div>
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F0] to-[#FFEBDC] text-[#0F172A] font-bold shadow-xs border border-[#DDD6FE]'
                        : 'text-[#475569] hover:bg-[#FAF6EE] hover:text-[#0F172A]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                          isActive 
                            ? 'bg-[#7C3AED] text-white shadow-xs' 
                            : 'bg-[#EDE9FE]/70 text-[#7C3AED] group-hover:bg-[#EDE9FE]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={isActive ? 'text-[#0F172A] font-bold' : ''}>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#EDE9FE] bg-gradient-to-b from-[#FFFDF9]/60 to-[#FAF6EE]">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EDE9FE] shadow-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF5A5F] to-[#7C3AED] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#0F172A] truncate">{user?.full_name || 'Nandini'}</p>
                <p className="text-[10px] text-[#64748B] truncate">{user?.email || 'user@planpulse.ai'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-[#64748B] hover:text-[#E03E44] rounded-xl hover:bg-[#FFE4E1] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
