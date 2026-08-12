import React from 'react';
import { Requirement } from '../../types';
import { RequirementStatusBadge } from './RequirementStatusBadge';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  MapPin,
  Briefcase,
  Globe,
  Calendar,
  Eye,
  MousePointerClick,
  Bookmark,
  ArrowRight
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
    if (!requirement.salaryDisclosed) return null;
    if (requirement.salaryMin && requirement.salaryMax) {
      return `₹${(requirement.salaryMin / 100000).toFixed(1)}L - ₹${(requirement.salaryMax / 100000).toFixed(1)}L`;
    }
    if (requirement.salaryMin) return `₹${(requirement.salaryMin / 100000).toFixed(1)}L+`;
    return null;
  };

  const salaryFormatted = formatSalary();

  return (
    <div className="card-surface-hover p-5 sm:p-6 flex flex-col justify-between space-y-4 group">
      <div className="space-y-4">
        {/* Header: Company Logo, Title, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-slate-600 text-base shrink-0 overflow-hidden">
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
            <div className="min-w-0">
              <h3
                onClick={() => onView && onView(requirement)}
                className="font-semibold text-slate-900 text-base leading-snug truncate hover:text-indigo-600 cursor-pointer transition-colors"
                title={requirement.title}
              >
                {requirement.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {showBookmarkButton && onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(requirement, !isBookmarked);
                }}
                className={`p-1.5 rounded-md border transition-colors ${
                  isBookmarked
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Job'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
              </button>
            )}
            <RequirementStatusBadge status={requirement.status} />
          </div>
        </div>

        {/* Metadata Strip: Location, Exp, WorkMode */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{requirement.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{requirement.experience}</span>
          </div>

          {salaryFormatted && (
            <div className="text-indigo-600 font-medium">
              {salaryFormatted}
            </div>
          )}
        </div>

        {/* Source & Application Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="slate" size="sm" icon={<Globe className="w-3 h-3 text-slate-400" />}>
            {requirement.sourcePlatform}
          </Badge>

          <Badge variant={requirement.applicationType === 'EXTERNAL_REDIRECT' ? 'purple' : 'emerald'} size="sm">
            {requirement.applicationType === 'EXTERNAL_REDIRECT' ? 'External Apply' : 'Portal Apply'}
          </Badge>

          <Badge variant="indigo" size="sm">
            {requirement.workMode.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Skills Tag List (max 4) */}
        {requirement.skills && requirement.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {requirement.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
            {requirement.skills.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium self-center">
                +{requirement.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Date / Stats & Action CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Views">
            <Eye className="w-3.5 h-3.5 text-slate-400" /> {requirement.viewsCount || 0}
          </span>
          <span className="flex items-center gap-1" title="Apply Clicks">
            <MousePointerClick className="w-3.5 h-3.5 text-slate-400" /> {requirement.clicksCount || 0}
          </span>
          {requirement.deadline && (
            <span className="hidden sm:flex items-center gap-1 text-amber-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              {new Date(requirement.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {showAdminControls ? (
            <div className="flex items-center gap-1.5">
              {requirement.status === 'DRAFT' && onPublish && (
                <Button size="sm" variant="secondary" onClick={() => onPublish(requirement)}>
                  Publish
                </Button>
              )}
              {requirement.status === 'PUBLISHED' && onClose && (
                <Button size="sm" variant="outline" onClick={() => onClose(requirement)}>
                  Close
                </Button>
              )}
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(requirement)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="danger" onClick={() => onDelete(requirement)}>
                  Delete
                </Button>
              )}
            </div>
          ) : (
            onView && (
              <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 font-medium" onClick={() => onView(requirement)}>
                <span>View Job</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
