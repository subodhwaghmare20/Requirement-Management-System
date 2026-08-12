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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Full administrative governance across users, companies, requirements, and system analytics.
        </p>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <div className="p-8 flex justify-center card-surface">
          <LoadingSpinner size="md" label="Loading system stats..." />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Users</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Requirements</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalRequirements || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Applications</span>
              <FileCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalApplications || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Companies</span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalCompanies || 0}</div>
          </div>
        </div>
      )}

      {/* Role Distribution */}
      <div className="card-surface p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">User Role Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Students</span>
            <span className="text-xl font-bold text-slate-900">{stats?.roles.students || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Trainers</span>
            <span className="text-xl font-bold text-indigo-600">{stats?.roles.trainers || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">HR Staff</span>
            <span className="text-xl font-bold text-purple-600">{stats?.roles.hr || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Admins</span>
            <span className="text-xl font-bold text-emerald-600">{stats?.roles.admins || 0}</span>
          </div>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link to="/admin/users" className="card-surface-hover p-5 space-y-3 group">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              User Management
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Create staff accounts, filter by role, toggle account status.
            </p>
          </div>
          <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
            <span>Manage Users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link to="/admin/categories" className="card-surface-hover p-5 space-y-3 group">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Category Management
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage domain categories and technology taxonomy tags.
            </p>
          </div>
          <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
            <span>Manage Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link to="/analytics" className="card-surface-hover p-5 space-y-3 group">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Analytics Engine
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyze monthly placement trends and technology metrics.
            </p>
          </div>
          <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
            <span>View Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
};
