import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Requirement } from '../../types';
import { RequirementStatusBadge } from './RequirementStatusBadge';
import { Badge } from '../common/Badge';
import { Edit2, Eye, Trash2, Globe, Users } from 'lucide-react';

interface RequirementTableProps {
  requirements: Requirement[];
  onView?: (requirement: Requirement) => void;
  onEdit?: (requirement: Requirement) => void;
  onPublish?: (requirement: Requirement) => void;
  onClose?: (requirement: Requirement) => void;
  onDelete?: (requirement: Requirement) => void;
  currentUserId?: string;
  userRole?: string;
}

export const RequirementTable: React.FC<RequirementTableProps> = ({
  requirements,
  onView,
  onEdit,
  onPublish,
  onClose,
  onDelete,
  currentUserId,
  userRole,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Requirement & Company</th>
              <th className="py-4 px-6">Source Platform</th>
              <th className="py-4 px-6">Application Mode</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Stats</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium">
            {requirements.map((req) => {
              const companyObj = typeof req.companyId === 'object' ? req.companyId : null;
              const companyName = req.companyName || companyObj?.name || 'Hiring Company';
              const createdById = typeof req.createdBy === 'object' ? req.createdBy._id : req.createdBy;
              const isOwner = currentUserId && createdById === currentUserId;
              const canModify = userRole === 'HR' || userRole === 'ADMIN' || isOwner;

              return (
                <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-extrabold text-slate-900 text-base leading-tight mb-0.5">
                        {req.title}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                        <span>{companyName}</span>
                        <span>•</span>
                        <span>{req.location}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <Badge variant="blue" size="sm" icon={<Globe className="w-3 h-3" />}>
                      {req.sourcePlatform}
                    </Badge>
                  </td>

                  <td className="py-4 px-6">
                    <Badge
                      variant={req.applicationType === 'EXTERNAL_REDIRECT' ? 'purple' : 'emerald'}
                      size="sm"
                    >
                      {req.applicationType === 'EXTERNAL_REDIRECT' ? 'External Redirect' : 'Portal Application'}
                    </Badge>
                  </td>

                  <td className="py-4 px-6">
                    <RequirementStatusBadge status={req.status} size="sm" />
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-500">
                    <div>Views: {req.viewsCount || 0}</div>
                    <div>Clicks: {req.clicksCount || 0}</div>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {req.applicationType === 'PORTAL_APPLICATION' && (userRole === 'HR' || userRole === 'ADMIN' || userRole === 'TRAINER') && (
                        <button
                          onClick={() => navigate(`/hr/requirements/${req._id}/applications`)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors flex items-center gap-1"
                          title="View Candidates"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Applicants</span>
                        </button>
                      )}

                      {req.status === 'DRAFT' && canModify && onPublish && (
                        <button
                          onClick={() => onPublish(req)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors"
                        >
                          Publish
                        </button>
                      )}

                      {req.status === 'PUBLISHED' && canModify && onClose && (
                        <button
                          onClick={() => onClose(req)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
                        >
                          Close
                        </button>
                      )}

                      {canModify && onEdit && (
                        <button
                          onClick={() => onEdit(req)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Requirement"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {canModify && onDelete && (
                        <button
                          onClick={() => onDelete(req)}
                          className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Requirement"
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
};
