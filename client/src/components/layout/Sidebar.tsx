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
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
    }`;

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 min-h-[calc(100vh-3.5rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-5">
        {/* Role Identity Tag */}
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Role View</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold text-[10px] uppercase tracking-wide">
            {role}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </NavLink>

          {/* Student Specific Navigation Links */}
          {role === 'STUDENT' && (
            <>
              <NavLink to="/jobs" className={linkClass}>
                <Briefcase className="w-4 h-4" />
                <span>Explore Jobs</span>
              </NavLink>

              <NavLink to="/applications" className={linkClass}>
                <FileCheck className="w-4 h-4" />
                <span>My Applications</span>
              </NavLink>

              <NavLink to="/saved-jobs" className={linkClass}>
                <Bookmark className="w-4 h-4" />
                <span>Saved Jobs</span>
              </NavLink>

              <NavLink to="/profile" className={linkClass}>
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </NavLink>
            </>
          )}

          {/* Trainer Specific Navigation Links */}
          {role === 'TRAINER' && (
            <>
              <NavLink to="/dashboard/trainer" className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Trainer Workplace</span>
              </NavLink>

              <NavLink to="/dashboard/trainer/requirements" className={linkClass}>
                <FolderOpen className="w-4 h-4" />
                <span>My Requirements</span>
              </NavLink>

              <NavLink to="/dashboard/trainer/requirements/create" className={linkClass}>
                <PlusCircle className="w-4 h-4" />
                <span>Post Requirement</span>
              </NavLink>
            </>
          )}

          {/* Admin Specific Links */}
          {role === 'ADMIN' && (
            <>
              <NavLink to="/dashboard/admin" className={linkClass}>
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Workplace</span>
              </NavLink>

              <NavLink to="/admin/users" className={linkClass}>
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </NavLink>

              <NavLink to="/admin/categories" className={linkClass}>
                <Layers className="w-4 h-4" />
                <span>Category Management</span>
              </NavLink>
            </>
          )}

          {/* HR & Admin Shared Links */}
          {(role === 'HR' || role === 'ADMIN') && (
            <>
              <NavLink to="/dashboard/hr" className={linkClass}>
                <PieChart className="w-4 h-4" />
                <span>HR Dashboard</span>
              </NavLink>

              <NavLink to="/analytics" className={linkClass}>
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </NavLink>

              <NavLink to="/hr/requirements" className={linkClass}>
                <Briefcase className="w-4 h-4" />
                <span>Manage Requirements</span>
              </NavLink>

              <NavLink to="/companies" className={linkClass}>
                <Building2 className="w-4 h-4" />
                <span>Company Directory</span>
              </NavLink>

              <NavLink to="/post-job" className={linkClass}>
                <PlusCircle className="w-4 h-4" />
                <span>Post Requirement</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-700">Placement Portal</p>
        <p className="mt-0.5">Institute Production v1.0</p>
      </div>
    </aside>
  );
};
