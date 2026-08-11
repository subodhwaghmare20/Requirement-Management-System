import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Building2,
  AlertCircle
} from 'lucide-react';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getApplicationById(id);
        setApplication(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to load application details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleWithdraw = async () => {
    if (!application) return;
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      const updated = await applicationService.withdrawApplication(application._id);
      setApplication(updated);
      showToast('Application withdrawn successfully', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to withdraw application', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading application record..." />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Application Record Not Found</h2>
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>
    );
  }

  const reqObj = typeof application.requirementId === 'object' ? application.requirementId : null;
  const companyObj = reqObj && typeof reqObj.companyId === 'object' ? reqObj.companyId : null;
  const title = reqObj?.title || 'Job Requirement';
  const companyName = reqObj?.companyName || companyObj?.name || 'Hiring Company';
  const companyLogo = reqObj?.companyLogo || companyObj?.logoUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <button
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Applications</span>
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-extrabold text-slate-700 text-2xl overflow-hidden shrink-0">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                {companyName}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          <Badge variant="blue" size="md">
            Status: {application.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">
              Applied Date
            </span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">
              Submitted Resume
            </span>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold">
              <FileText className="w-4 h-4" />
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <span>View Submitted Resume</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">
              Application ID
            </span>
            <span className="text-slate-900 font-bold font-mono text-[11px]">
              {application._id}
            </span>
          </div>
        </div>

        {application.status === 'APPLIED' && (
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleWithdraw}
              className="px-6 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
            >
              Withdraw Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
