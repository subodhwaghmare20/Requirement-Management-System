import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Briefcase,
  FileText,
  ExternalLink,
  ChevronRight
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time status and resume snapshots of your active drive submissions.
          </p>
        </div>
        <Link to="/jobs">
          <Button variant="primary" size="sm">
            <span>Explore More Jobs</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center card-surface">
          <LoadingSpinner size="lg" label="Loading applications..." />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Applications Submitted Yet"
          description="Browse active drives and apply using your profile resume."
          actionLabel="Explore Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block card-surface overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Requirement & Company</th>
                  <th className="py-3.5 px-5">Applied Date</th>
                  <th className="py-3.5 px-5">Resume Snapshot</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {applications.map((app) => {
                  const reqObj = typeof app.requirementId === 'object' ? app.requirementId : null;
                  const companyObj = reqObj && typeof reqObj.companyId === 'object' ? reqObj.companyId : null;
                  const title = reqObj?.title || 'Job Requirement';
                  const companyName = reqObj?.companyName || companyObj?.name || 'Hiring Company';
                  const companyLogo = reqObj?.companyLogo || companyObj?.logoUrl;

                  return (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden shrink-0">
                            {companyLogo ? (
                              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                            ) : (
                              companyName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{title}</div>
                            <div className="text-xs text-slate-500">{companyName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:underline text-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">{getStatusBadge(app.status)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/applications/${app._id}`}>
                            <Button variant="ghost" size="sm">
                              <span>Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          {app.status === 'APPLIED' && (
                            <Button variant="danger" size="sm" onClick={() => handleWithdraw(app._id, title)}>
                              Withdraw
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

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {applications.map((app) => {
              const reqObj = typeof app.requirementId === 'object' ? app.requirementId : null;
              const companyObj = reqObj && typeof reqObj.companyId === 'object' ? reqObj.companyId : null;
              const title = reqObj?.title || 'Job Requirement';
              const companyName = reqObj?.companyName || companyObj?.name || 'Hiring Company';

              return (
                <div key={app._id} className="card-surface p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                      <p className="text-xs text-slate-500">{companyName}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <Link to={`/applications/${app._id}`} className="text-indigo-600 font-medium hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
