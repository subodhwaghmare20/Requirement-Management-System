import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CandidateApplicationItem,
  RequirementApplicationsResponse,
  applicationService
} from '../../services/applicationService';
import { Requirement, ApplicationStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Users,
  FileText,
  ExternalLink,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HRCandidateApplicationsPage: React.FC = () => {
  const { requirementId } = useParams<{ requirementId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [applications, setApplications] = useState<CandidateApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status & Remarks Modal State
  const [selectedApp, setSelectedApp] = useState<CandidateApplicationItem | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('APPLIED');
  const [remarks, setRemarks] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchCandidates = async () => {
    if (!requirementId) return;
    setLoading(true);
    try {
      const data = await applicationService.getRequirementApplications(requirementId);
      setRequirement(data.requirement);
      setTotalApplications(data.totalApplications);
      setApplications(data.applications);
    } catch (err: any) {
      showToast(err.message || 'Failed to load candidate applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [requirementId]);

  const handleOpenStatusModal = (app: CandidateApplicationItem) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setRemarks(app.remarks || '');
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdating(true);
    try {
      await applicationService.updateApplicationStatus(selectedApp._id, newStatus, remarks);
      showToast(`Status updated to '${newStatus}' for ${selectedApp.student.name}`, 'success');
      setSelectedApp(null);
      fetchCandidates();
    } catch (err: any) {
      showToast(err.message || 'Failed to update application status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
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
        return <Badge variant="rose">Rejected</Badge>;
      case 'WITHDRAWN':
        return <Badge variant="slate">Withdrawn</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requirements</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Candidate Application Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {requirement?.title || 'Job Applications'}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Company: {requirement?.companyName || 'Hiring Company'} • Total Portal Applicants: <strong className="text-white">{totalApplications}</strong>
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-sm shrink-0 text-center flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-300" />
          <span>{totalApplications} Applicants</span>
        </div>
      </div>

      {/* Candidate Applications Data Table */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading candidate applications..." />
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base text-slate-700">No Candidate Applications Yet</p>
          <p className="text-xs">Students will appear here once they submit applications for this drive.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Batch</th>
                  <th className="py-4 px-6">Skills</th>
                  <th className="py-4 px-6">Resume</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900 leading-tight">
                        {app.student.name}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">{app.student.email}</div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-700 font-bold">{app.course}</td>

                    <td className="py-4 px-6 text-xs text-slate-600">{app.batch}</td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                        {app.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{app.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6">{getStatusBadge(app.status)}</td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status & Remarks Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedApp(null)}
              disabled={isUpdating}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
                  Update Candidate Application
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {selectedApp.student.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedApp.student.email}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Application Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-bold"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview Scheduled</option>
                  <option value="SELECTED">Selected 🎉</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  HR Remarks & Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Cleared technical screening. Interview scheduled for Monday..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  disabled={isUpdating}
                  className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" label="" />
                  ) : (
                    <span>Save Application Status</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
