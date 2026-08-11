import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Requirement } from '../../types';
import { requirementService } from '../../services/requirementService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { RequirementStatusBadge } from '../../components/requirements/RequirementStatusBadge';
import { ExternalRedirectModal } from '../../components/requirements/ExternalRedirectModal';
import { PortalApplyModal } from '../../components/applications/PortalApplyModal';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  ExternalLink,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectModalOpen, setRedirectModalOpen] = useState<boolean>(false);
  const [portalApplyModalOpen, setPortalApplyModalOpen] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await requirementService.getRequirementById(id);
        setRequirement(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to load job details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleApplyButtonClick = () => {
    if (!requirement) return;

    if (requirement.applicationType === 'EXTERNAL_REDIRECT') {
      setRedirectModalOpen(true);
    } else {
      setPortalApplyModalOpen(true);
    }
  };

  const handleConfirmRedirect = async () => {
    if (!requirement) return;
    setIsRedirecting(true);
    try {
      const result = await requirementService.recordApplyClick(requirement._id);
      showToast(`Link click logged! Opening ${result.sourcePlatform}...`, 'success');

      setRequirement((prev) => (prev ? { ...prev, clicksCount: result.clicksCount } : null));

      setRedirectModalOpen(false);
      window.open(result.redirectUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      showToast(err.message || 'Failed to process external application click', 'error');
    } finally {
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading job requirement details..." />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Job Requirement Not Found</h2>
        <p className="text-sm text-slate-500">
          This job opportunity may have expired or been removed.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs Directory</span>
        </Link>
      </div>
    );
  }

  const companyObj = typeof requirement.companyId === 'object' ? requirement.companyId : null;
  const companyName = requirement.companyName || companyObj?.name || 'Hiring Company';
  const companyLogo = requirement.companyLogo || companyObj?.logoUrl;
  const companyIndustry = companyObj?.industry || 'Technology';

  const formatSalary = () => {
    if (!requirement.salaryDisclosed) return 'Not Disclosed';
    if (requirement.salaryMin && requirement.salaryMax) {
      return `₹${requirement.salaryMin.toLocaleString()} - ₹${requirement.salaryMax.toLocaleString()} Per Annum`;
    }
    if (requirement.salaryMin) return `₹${requirement.salaryMin.toLocaleString()}+ Per Annum`;
    return 'Disclosed';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Directory</span>
        </button>
      </div>

      {/* Main Header Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-extrabold text-slate-700 text-2xl overflow-hidden shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {companyName}
                </span>
                <span>•</span>
                <span className="text-xs text-slate-400 font-medium">{companyIndustry}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {requirement.title}
              </h1>
            </div>
          </div>

          <RequirementStatusBadge status={requirement.status} size="md" />
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <Badge variant="blue" icon={<Globe className="w-3.5 h-3.5" />}>
            Source: {requirement.sourcePlatform}
          </Badge>

          <Badge variant={requirement.applicationType === 'EXTERNAL_REDIRECT' ? 'purple' : 'emerald'}>
            {requirement.applicationType === 'EXTERNAL_REDIRECT' ? '⚡ External Redirect' : '📝 Portal Application'}
          </Badge>

          <Badge variant="slate">
            {requirement.jobType.replace('_', ' ')}
          </Badge>

          <Badge variant="indigo">
            {requirement.workMode.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Location</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{requirement.location}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Experience</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>{requirement.experience}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Salary Offer</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span>{formatSalary()}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Deadline</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{requirement.deadline ? new Date(requirement.deadline).toLocaleDateString() : 'Open Drive'}</span>
            </div>
          </div>
        </div>

        {/* Prominent Apply Action Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-blue-950">
              {requirement.applicationType === 'EXTERNAL_REDIRECT'
                ? 'External Application Drive'
                : 'Direct Portal Application'}
            </h3>
            <p className="text-xs text-blue-800 mt-0.5">
              {requirement.applicationType === 'EXTERNAL_REDIRECT'
                ? `Clicking Apply will redirect you to ${requirement.sourcePlatform} or the official career portal.`
                : 'Submit your profile and resume directly through our institute placement portal.'}
            </p>
          </div>

          <button
            onClick={handleApplyButtonClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>
              {requirement.applicationType === 'EXTERNAL_REDIRECT'
                ? 'Apply Now ↗'
                : 'Apply Now via Portal'}
            </span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description & Eligibility Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
          Job Description & Requirement Details
        </h2>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {requirement.description}
        </div>
      </div>

      {/* Skills Required Section */}
      {requirement.skills && requirement.skills.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Required Technical Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {requirement.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* External Redirect Modal */}
      {requirement && (
        <ExternalRedirectModal
          requirement={requirement}
          isOpen={redirectModalOpen}
          onClose={() => setRedirectModalOpen(false)}
          onConfirm={handleConfirmRedirect}
          isRedirecting={isRedirecting}
        />
      )}

      {/* Portal Application Modal */}
      {requirement && (
        <PortalApplyModal
          requirement={requirement}
          isOpen={portalApplyModalOpen}
          onClose={() => setPortalApplyModalOpen(false)}
        />
      )}
    </div>
  );
};
