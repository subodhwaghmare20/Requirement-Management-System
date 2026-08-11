import React from 'react';
import { RequirementStatus } from '../../types';
import { Badge } from '../common/Badge';
import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface RequirementStatusBadgeProps {
  status: RequirementStatus;
  size?: 'sm' | 'md';
}

export const RequirementStatusBadge: React.FC<RequirementStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'PUBLISHED':
      return (
        <Badge variant="emerald" size={size} icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
          Published
        </Badge>
      );
    case 'DRAFT':
      return (
        <Badge variant="amber" size={size} icon={<Clock className="w-3.5 h-3.5" />}>
          Draft
        </Badge>
      );
    case 'CLOSED':
      return (
        <Badge variant="slate" size={size} icon={<XCircle className="w-3.5 h-3.5" />}>
          Closed
        </Badge>
      );
    case 'EXPIRED':
      return (
        <Badge variant="rose" size={size} icon={<AlertTriangle className="w-3.5 h-3.5" />}>
          Expired
        </Badge>
      );
    default:
      return (
        <Badge variant="blue" size={size}>
          {status}
        </Badge>
      );
  }
};
