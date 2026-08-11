import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HRStats, requirementService } from '../../services/requirementService';
import { Requirement } from '../../types';
import { RequirementStatusBadge } from '../../components/requirements/RequirementStatusBadge';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Users,
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
  const { user } = useAuth();
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Institute HR Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            HR Placement Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Overall analytics, external drives monitoring, trainer postings, and portal tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/post-job"
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Post Requirement</span>
          </Link>

          <Link
            to="/companies"
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <Building2 className="w-4.5 h-4.5" />
            <span>Companies</span>
          </Link>
        </div>
      </div>

      {/* 9 Metric Stats Grid */}
      {loading ? (
        <div className="p-8 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="md" label="Loading HR portal metrics..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Total Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Total Requirements
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalRequirements || 0}
              </span>
            </div>
          </div>

          {/* Published Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Published Requirements
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.publishedRequirements || 0}
              </span>
            </div>
          </div>

          {/* Draft Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Draft Requirements
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.draftRequirements || 0}
              </span>
            </div>
          </div>

          {/* Closed Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Closed Requirements
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.closedRequirements || 0}
              </span>
            </div>
          </div>

          {/* Expired Requirements */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Expired Requirements
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.expiredRequirements || 0}
              </span>
            </div>
          </div>

          {/* Requirements Posted This Week */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Posted This Week
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.postedThisWeek || 0}
              </span>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Registered Students
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalStudents || 0}
              </span>
            </div>
          </div>

          {/* Total Portal Applications */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Portal Applications
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.totalApplications || 0}
              </span>
            </div>
          </div>

          {/* External Apply Clicks */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                External Apply Clicks
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {stats?.externalApplyClicks || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-slate-900">Recent Postings Directory</h2>
          <Link
            to="/hr/requirements"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>Manage All Requirements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Source</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Created By</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {recentRequirements.map((req) => {
                  const companyObj = typeof req.companyId === 'object' ? req.companyId : null;
                  const categoryObj = typeof req.categoryId === 'object' ? req.categoryId : null;
                  const creatorObj = typeof req.createdBy === 'object' ? req.createdBy : null;
                  const companyName = req.companyName || companyObj?.name || 'Company';

                  return (
                    <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{companyName}</td>
                      <td className="py-4 px-6 font-extrabold text-blue-600">{req.title}</td>
                      <td className="py-4 px-6 text-xs text-slate-600">{categoryObj?.name || 'General'}</td>
                      <td className="py-4 px-6">
                        <Badge variant="blue" size="sm" icon={<Globe className="w-3 h-3" />}>
                          {req.sourcePlatform}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{req.location}</td>
                      <td className="py-4 px-6">
                        <RequirementStatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {req.deadline ? new Date(req.deadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {creatorObj?.name || 'System Admin'}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/jobs/${req._id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/trainer/requirements/${req._id}/edit`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {req.status === 'DRAFT' && (
                            <button
                              onClick={() => handlePublish(req)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs"
                            >
                              Publish
                            </button>
                          )}
                          {req.status === 'PUBLISHED' && (
                            <button
                              onClick={() => handleClose(req)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
                            >
                              Close
                            </button>
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
