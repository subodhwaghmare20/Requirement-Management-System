import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService, AdminDashboardStats } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Briefcase,
  FileCheck,
  Building2,
  Layers,
  BarChart3,
  UserPlus,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    adminService
      .getDashboardStats()
      .then(setStats)
      .catch((err) => showToast(err.message || 'Failed to load admin stats', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Master Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Admin Control Center
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Full governance across institute users, companies, requirements, categories, and system analytics.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs shrink-0 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Master Admin Rights</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading system stats..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Total Users */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Total Users
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalUsers || 0}
              </span>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Requirements
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalRequirements || 0}
              </span>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Applications
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalApplications || 0}
              </span>
            </div>
          </div>

          {/* Companies */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Companies
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalCompanies || 0}
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Categories
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalCategories || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Role Breakdown Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">User Role Distribution</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block">Students</span>
            <span className="text-2xl font-extrabold text-slate-900">{stats?.roles.students || 0}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block">Trainers</span>
            <span className="text-2xl font-extrabold text-blue-600">{stats?.roles.trainers || 0}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block">HR Personnel</span>
            <span className="text-2xl font-extrabold text-purple-600">{stats?.roles.hr || 0}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block">Admins</span>
            <span className="text-2xl font-extrabold text-emerald-600">{stats?.roles.admins || 0}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management Shortcut */}
        <Link
          to="/admin/users"
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
              User Management
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Create Trainer & HR accounts, filter by roles, activate/deactivate user access.
            </p>
          </div>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
            <span>Manage Users</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Category Management Shortcut */}
        <Link
          to="/admin/categories"
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
              Category Management
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Add new opportunity categories, edit details, activate/deactivate category tags.
            </p>
          </div>
          <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <span>Manage Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Company Management Shortcut */}
        <Link
          to="/companies"
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
              Company Management
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Add hiring companies, edit corporate profiles, activate/deactivate organization status.
            </p>
          </div>
          <div className="text-xs font-bold text-purple-600 flex items-center gap-1">
            <span>Manage Companies</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Requirements Control Shortcut */}
        <Link
          to="/hr/requirements"
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
              Requirement Control
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Master control over all job requirements: edit, close, publish, or delete inappropriate drives.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span>Manage Postings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Analytics Engine Shortcut */}
        <Link
          to="/analytics"
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
              Analytics Engine
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Detailed charts for technology breakdown, monthly trends, and external apply clicks.
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
            <span>View Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};
