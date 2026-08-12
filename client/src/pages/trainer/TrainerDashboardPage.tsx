import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrainerStats, requirementService } from '../../services/requirementService';
import { Requirement } from '../../types';
import { RequirementTable } from '../../components/requirements/RequirementTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  ArrowRight
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trainer Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post verified external opportunities and manage your placement drives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/trainer/requirements/create">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              <span>Post Requirement</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <div className="p-8 flex justify-center card-surface">
          <LoadingSpinner size="md" label="Loading stats..." />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Postings</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.total || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.published || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Drafts</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.drafts || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Closed</span>
              <XCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.closed || 0}</div>
          </div>
        </div>
      )}

      {/* Recent Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recent Requirements</h2>
          <Link to="/dashboard/trainer/requirements" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRequirements.length === 0 ? (
          <div className="p-8 text-center card-surface text-slate-500 space-y-2">
            <p className="text-xs text-slate-500">No job requirements created yet.</p>
            <Link to="/dashboard/trainer/requirements/create">
              <Button variant="primary" size="sm">
                Post First Requirement
              </Button>
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
