import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrainerStats, requirementService } from '../../services/requirementService';
import { Requirement } from '../../types';
import { RequirementTable } from '../../components/requirements/RequirementTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const TrainerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<TrainerStats | null>(null);
  const [recentRequirements, setRecentRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTrainerDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, reqsData] = await Promise.all([
        requirementService.getTrainerStats(),
        requirementService.getRequirements({
          createdBy: user?._id,
          limit: 5,
        }),
      ]);
      setStats(statsData);
      setRecentRequirements(reqsData.requirements);
    } catch (err: any) {
      showToast(err.message || 'Failed to load trainer dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerDashboardData();
  }, []);

  const handlePublish = async (req: Requirement) => {
    try {
      await requirementService.publishRequirement(req._id);
      showToast(`Requirement '${req.title}' published!`, 'success');
      fetchTrainerDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish requirement', 'error');
    }
  };

  const handleClose = async (req: Requirement) => {
    try {
      await requirementService.closeRequirement(req._id);
      showToast(`Requirement '${req.title}' closed`, 'info');
      fetchTrainerDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to close requirement', 'error');
    }
  };

  const handleDelete = async (req: Requirement) => {
    if (!window.confirm(`Are you sure you want to delete '${req.title}'?`)) return;
    try {
      await requirementService.deleteRequirement(req._id);
      showToast(`Requirement '${req.title}' deleted`, 'success');
      fetchTrainerDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete requirement', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Trainer Workplace Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Trainer {user?.name} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Post verified external opportunities and monitor your student placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard/trainer/requirements/create"
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Post Requirement</span>
          </Link>

          <Link
            to="/dashboard/trainer/requirements"
            className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Statistics Cards Row */}
      {loading ? (
        <div className="p-8 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="md" label="Loading trainer stats..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Total Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Total Postings
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.total || 0}
              </span>
            </div>
          </div>

          {/* Published */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Published
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.published || 0}
              </span>
            </div>
          </div>

          {/* Drafts */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Drafts Saved
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.drafts || 0}
              </span>
            </div>
          </div>

          {/* Closed */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Closed Drives
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.closed || 0}
              </span>
            </div>
          </div>

          {/* Expired */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Expired Drives
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.expired || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-slate-900">Recent Postings</h2>
          <Link
            to="/dashboard/trainer/requirements"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Requirements Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRequirements.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No job requirements created yet</p>
            <Link
              to="/dashboard/trainer/requirements/create"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Post First Job Requirement
            </Link>
          </div>
        ) : (
          <RequirementTable
            requirements={recentRequirements}
            onPublish={handlePublish}
            onClose={handleClose}
            onEdit={(req) => navigate(`/dashboard/trainer/requirements/${req._id}/edit`)}
            onDelete={handleDelete}
            currentUserId={user?._id}
            userRole={user?.role}
          />
        )}
      </div>
    </div>
  );
};
