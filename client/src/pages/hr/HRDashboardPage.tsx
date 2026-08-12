import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HRStats, requirementService } from '../../services/requirementService';
import { Requirement } from '../../types';
import { RequirementStatusBadge } from '../../components/requirements/RequirementStatusBadge';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  MousePointerClick,
  Plus,
  Building2,
  ArrowRight,
  Globe,
  Edit2,
  Eye
} from 'lucide-react';

export const HRDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState<HRStats | null>(null);
  const [recentRequirements, setRecentRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHRData = async () => {
    setLoading(true);
    try {
      const [statsData, reqsData] = await Promise.all([
        requirementService.getHRStats(),
        requirementService.getRequirements({ limit: 5 }),
      ]);
      setStats(statsData);
      setRecentRequirements(reqsData.requirements);
    } catch (err: any) {
      showToast(err.message || 'Failed to load HR dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  const handlePublish = async (req: Requirement) => {
    try {
      await requirementService.publishRequirement(req._id);
      showToast(`Requirement '${req.title}' published!`, 'success');
      fetchHRData();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish requirement', 'error');
    }
  };

  const handleClose = async (req: Requirement) => {
    try {
      await requirementService.closeRequirement(req._id);
      showToast(`Requirement '${req.title}' closed`, 'info');
      fetchHRData();
    } catch (err: any) {
      showToast(err.message || 'Failed to close requirement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Placement analytics, requirement monitoring, and candidate tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/post-job">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              <span>Post Job</span>
            </Button>
          </Link>
          <Link to="/companies">
            <Button variant="outline" size="sm">
              <Building2 className="w-4 h-4" />
              <span>Companies</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Stats */}
      {loading ? (
        <div className="p-8 flex justify-center card-surface">
          <LoadingSpinner size="md" label="Loading HR portal metrics..." />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Requirements</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalRequirements || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Published Drives</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.publishedRequirements || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Portal Applications</span>
              <FileCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalApplications || 0}</div>
          </div>

          <div className="card-surface p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Apply Redirect Clicks</span>
              <MousePointerClick className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats?.externalApplyClicks || 0}</div>
          </div>
        </div>
      )}

      {/* Recent Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recent Drives Directory</h2>
          <Link to="/hr/requirements" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Requirement Title</th>
                  <th className="py-3.5 px-5">Company</th>
                  <th className="py-3.5 px-5">Source</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Deadline</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {recentRequirements.map((req) => {
                  const companyObj = typeof req.companyId === 'object' ? req.companyId : null;
                  const companyName = req.companyName || companyObj?.name || 'Company';

                  return (
                    <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">{req.title}</td>
                      <td className="py-3.5 px-5 text-slate-600">{companyName}</td>
                      <td className="py-3.5 px-5">
                        <Badge variant="slate" size="sm" icon={<Globe className="w-3 h-3 text-slate-400" />}>
                          {req.sourcePlatform}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5">
                        <RequirementStatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {req.deadline ? new Date(req.deadline).toLocaleDateString() : 'Open'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${req._id}`)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/trainer/requirements/${req._id}/edit`)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          {req.status === 'DRAFT' && (
                            <Button variant="secondary" size="sm" onClick={() => handlePublish(req)}>
                              Publish
                            </Button>
                          )}
                          {req.status === 'PUBLISHED' && (
                            <Button variant="outline" size="sm" onClick={() => handleClose(req)}>
                              Close
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
