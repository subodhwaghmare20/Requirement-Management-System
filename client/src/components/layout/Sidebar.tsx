import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Building2,
  FileCheck,
  Bookmark,
  PlusCircle,
  FolderOpen,
  PieChart,
  BarChart3,
  Users,
  Layers,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        {/* Role Identity Tag */}
        <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Active Context</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase">
            {role}
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Overview</span>
          </NavLink>

          {/* Student Specific Navigation Links */}
          {role === 'STUDENT' && (
            <>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Briefcase className="w-4.5 h-4.5" />
                <span>Explore Jobs</span>
              </NavLink>

              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <FileCheck className="w-4.5 h-4.5" />
                <span>My Applications</span>
              </NavLink>

              <NavLink
                to="/saved-jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Bookmark className="w-4.5 h-4.5" />
                <span>Saved Jobs</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <User className="w-4.5 h-4.5" />
                <span>My Profile</span>
              </NavLink>
            </>
          )}

          {/* Trainer Specific Navigation Links */}
          {role === 'TRAINER' && (
            <>
              <NavLink
                to="/dashboard/trainer"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>Trainer Workplace</span>
              </NavLink>

              <NavLink
                to="/dashboard/trainer/requirements"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <FolderOpen className="w-4.5 h-4.5" />
                <span>My Requirements</span>
              </NavLink>

              <NavLink
                to="/dashboard/trainer/requirements/create"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <PlusCircle className="w-4.5 h-4.5" />
                <span>Post Requirement</span>
              </NavLink>
            </>
          )}

          {/* Admin Specific Links */}
          {role === 'ADMIN' && (
            <>
              <NavLink
                to="/dashboard/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <ShieldAlert className="w-4.5 h-4.5" />
                <span>Admin Workplace</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Users className="w-4.5 h-4.5" />
                <span>User Management</span>
              </NavLink>

              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Layers className="w-4.5 h-4.5" />
                <span>Category Management</span>
              </NavLink>
            </>
          )}

          {/* HR & Admin Shared Links */}
          {(role === 'HR' || role === 'ADMIN') && (
            <>
              <NavLink
                to="/dashboard/hr"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <PieChart className="w-4.5 h-4.5" />
                <span>HR Dashboard</span>
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <BarChart3 className="w-4.5 h-4.5" />
                <span>Analytics Dashboard</span>
              </NavLink>

              <NavLink
                to="/hr/requirements"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Briefcase className="w-4.5 h-4.5" />
                <span>Manage Requirements</span>
              </NavLink>

              <NavLink
                to="/companies"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Building2 className="w-4.5 h-4.5" />
                <span>Company Directory</span>
              </NavLink>

              <NavLink
                to="/post-job"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <PlusCircle className="w-4.5 h-4.5" />
                <span>Post Requirement</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">External Placement Portal</p>
        <p className="mt-0.5">Version 1.0 • Institute Edition</p>
      </div>
    </aside>
  );
};
