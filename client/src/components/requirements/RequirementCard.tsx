import React from 'react';
import { Requirement } from '../../types';
import { RequirementStatusBadge } from './RequirementStatusBadge';
import { Badge } from '../common/Badge';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  ExternalLink,
  Calendar,
  Eye,
  MousePointerClick,
  Bookmark
} from 'lucide-react';

interface RequirementCardProps {
  requirement: Requirement;
  onView?: (requirement: Requirement) => void;
  onEdit?: (requirement: Requirement) => void;
  onPublish?: (requirement: Requirement) => void;
  onClose?: (requirement: Requirement) => void;
  onDelete?: (requirement: Requirement) => void;
  onToggleBookmark?: (requirement: Requirement, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
  showAdminControls?: boolean;
  showBookmarkButton?: boolean;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  onView,
  onEdit,
  onPublish,
  onClose,
  onDelete,
  onToggleBookmark,
  isBookmarked = false,
  showAdminControls = false,
  showBookmarkButton = true,
}) => {
  const companyObj = typeof requirement.companyId === 'object' ? requirement.companyId : null;
  const companyName = requirement.companyName || companyObj?.name || 'Hiring Organization';
  const companyLogo = requirement.companyLogo || companyObj?.logoUrl;

  const formatSalary = () => {
    if (!requirement.salaryDisclosed) return 'Not Disclosed';
    if (requirement.salaryMin && requirement.salaryMax) {
      return `₹${requirement.salaryMin.toLocaleString()} - ₹${requirement.salaryMax.toLocaleString()}`;
    }
    if (requirement.salaryMin) return `₹${requirement.salaryMin.toLocaleString()}+`;
    return 'Disclosed';
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return 'blue';
      case 'Naukri':
        return 'indigo';
      case 'Indeed':
        return 'purple';
      case 'Foundit':
        return 'emerald';
      case 'Company Website':
        return 'amber';
      default:
        return 'slate';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative group">
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-extrabold text-slate-700 text-lg overflow-hidden shrink-0">
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
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight hover:text-blue-600 transition-colors">
                {requirement.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">{companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showBookmarkButton && onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(requirement, !isBookmarked);
                }}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:text-slate-700'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Job'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              </button>
            )}
            <RequirementStatusBadge status={requirement.status} />
          </div>
        </div>

        {/* Badges Row: Source Platform & Application Type */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant={getPlatformBadgeColor(requirement.sourcePlatform)} size="sm" icon={<Globe className="w-3 h-3" />}>
            Source: {requirement.sourcePlatform}
          </Badge>

          <Badge variant={requirement.applicationType === 'EXTERNAL_REDIRECT' ? 'purple' : 'emerald'} size="sm">
            {requirement.applicationType === 'EXTERNAL_REDIRECT' ? '⚡ External Redirect' : '📝 Portal Application'}
          </Badge>

          <Badge variant="slate" size="sm">
            {requirement.jobType.replace('_', ' ')}
          </Badge>

          <Badge variant="indigo" size="sm">
            {requirement.workMode.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600 pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{requirement.location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Exp: {requirement.experience}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatSalary()}</span>
          </div>

          {requirement.deadline && (
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Deadline: {new Date(requirement.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Skills Tag List */}
        {requirement.skills && requirement.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {requirement.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls & Stats */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1" title="Views">
            <Eye className="w-3.5 h-3.5" /> {requirement.viewsCount || 0}
          </span>
          <span className="flex items-center gap-1" title="External Clicks">
            <MousePointerClick className="w-3.5 h-3.5" /> {requirement.clicksCount || 0}
          </span>
        </div>

        {showAdminControls && (
          <div className="flex items-center gap-2">
            {requirement.status === 'DRAFT' && onPublish && (
              <button
                onClick={() => onPublish(requirement)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors"
              >
                Publish
              </button>
            )}
            {requirement.status === 'PUBLISHED' && onClose && (
              <button
                onClick={() => onClose(requirement)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
              >
                Close Drive
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(requirement)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(requirement)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
