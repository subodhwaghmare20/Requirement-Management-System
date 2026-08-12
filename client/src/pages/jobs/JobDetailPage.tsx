import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Requirement } from '../../types';
import { requirementService } from '../../services/requirementService';
import { useToast } from '../../context/ToastContext';
import { RequirementStatusBadge } from '../../components/requirements/RequirementStatusBadge';
import { ExternalRedirectModal } from '../../components/requirements/ExternalRedirectModal';
import { PortalApplyModal } from '../../components/applications/PortalApplyModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  MapPin,
  Briefcase,
  Globe,
  ExternalLink,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Building2
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading job requirement details..." />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="card-surface p-12 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-semibold text-slate-900">Job Opportunity Not Found</h2>
        <p className="text-xs text-slate-500">
          This job opportunity may have expired or been removed.
        </p>
        <Link to="/jobs">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </Button>
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
      return `₹${(requirement.salaryMin / 100000).toFixed(1)}L - ₹${(requirement.salaryMax / 100000).toFixed(1)}L Per Annum`;
    }
    if (requirement.salaryMin) return `₹${(requirement.salaryMin / 100000).toFixed(1)}L+ Per Annum`;
    return 'Disclosed';
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Main Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xl overflow-hidden shrink-0">
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
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {requirement.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {companyName} • {companyIndustry}
                  </p>
                </div>
              </div>
              <RequirementStatusBadge status={requirement.status} size="md" />
            </div>

            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <Badge variant="slate" icon={<Globe className="w-3.5 h-3.5 text-slate-400" />}>
                {requirement.sourcePlatform}
              </Badge>
              <Badge variant={requirement.applicationType === 'EXTERNAL_REDIRECT' ? 'purple' : 'emerald'}>
                {requirement.applicationType === 'EXTERNAL_REDIRECT' ? 'External Redirect' : 'Portal Application'}
              </Badge>
              <Badge variant="indigo">
                {requirement.workMode.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="slate">
                {requirement.jobType.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Job Description */}
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Job Description
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {requirement.description}
            </div>
          </div>

          {/* Skills Required */}
          {requirement.skills && requirement.skills.length > 0 && (
            <div className="card-surface p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {requirement.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Apply Sticky Box */}
        <div className="space-y-6 lg:sticky lg:top-20">
          <div className="card-surface p-6 space-y-5">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleApplyButtonClick}
            >
              <span>
                {requirement.applicationType === 'EXTERNAL_REDIRECT'
                  ? 'Apply on Website ↗'
                  : 'Apply via Portal'}
              </span>
            </Button>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location</span>
                <span className="font-medium text-slate-900">{requirement.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Experience</span>
                <span className="font-medium text-slate-900">{requirement.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Salary</span>
                <span className="font-medium text-slate-900">{formatSalary()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deadline</span>
                <span className="font-medium text-slate-900">
                  {requirement.deadline ? new Date(requirement.deadline).toLocaleDateString() : 'Open Drive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
