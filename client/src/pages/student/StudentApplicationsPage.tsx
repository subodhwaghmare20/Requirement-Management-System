import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const StudentApplicationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch application history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for '${title}'?`)) return;
    try {
      await applicationService.withdrawApplication(appId);
      showToast('Application withdrawn', 'info');
      fetchApplications();
    } catch (err: any) {
      showToast(err.message || 'Failed to withdraw application', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return <Badge variant="blue">Applied</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="amber">Under Review</Badge>;
      case 'SHORTLISTED':
        return <Badge variant="purple">Shortlisted</Badge>;
      case 'INTERVIEW':
        return <Badge variant="indigo">Interview Scheduled</Badge>;
      case 'SELECTED':
        return <Badge variant="emerald">Selected 🎉</Badge>;
      case 'REJECTED':
        return <Badge variant="rose">Not Selected</Badge>;
      case 'WITHDRAWN':
        return <Badge variant="slate">Withdrawn</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Student Career Track
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Portal Applications
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Track real-time status and resume snapshots of your active drive submissions.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all shrink-0 text-center"
        >
          Explore More Drives
        </Link>
      </div>

      {/* Applications List Table */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading application history..." />
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="font-bold text-base text-slate-700">No Portal Applications Submitted Yet</h3>
            <p className="text-xs text-slate-500 mt-1">Browse active drives and apply using your verified resume profile.</p>
          </div>
          <Link
            to="/jobs"
            className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Browse Jobs Directory
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Company & Requirement</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Resume Snapshot</th>
                  <th className="py-4 px-6">Application Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {applications.map((app) => {
                  const reqObj = typeof app.requirementId === 'object' ? app.requirementId : null;
                  const companyObj = reqObj && typeof reqObj.companyId === 'object' ? reqObj.companyId : null;
                  const title = reqObj?.title || 'Job Requirement';
                  const companyName = reqObj?.companyName || companyObj?.name || 'Hiring Company';
                  const companyLogo = reqObj?.companyLogo || companyObj?.logoUrl;

                  return (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 overflow-hidden shrink-0">
                            {companyLogo ? (
                              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                            ) : (
                              companyName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-base leading-tight">
                              {title}
                            </div>
                            <div className="text-xs font-semibold text-slate-500">{companyName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-600">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>

                      <td className="py-4 px-6">{getStatusBadge(app.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/applications/${app._id}`}
                            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Application Details"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>

                          {app.status === 'APPLIED' && (
                            <button
                              onClick={() => handleWithdraw(app._id, title)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors"
                            >
                              Withdraw
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
      )}
    </div>
  );
};
