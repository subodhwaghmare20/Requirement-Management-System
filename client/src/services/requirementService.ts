import API from './api';
import { ApiResponse, Requirement, RequirementStatus } from '../types';

export interface CreateRequirementPayload {
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  title: string;
  description: string;
  categoryId?: string;
  skills?: string[];
  experience?: string;
  jobType?: 'FULL_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'PART_TIME' | 'APPRENTICESHIP';
  location: string;
  workMode?: 'WORK_FROM_OFFICE' | 'HYBRID' | 'REMOTE';
  salaryMin?: number;
  salaryMax?: number;
  salaryDisclosed?: boolean;
  sourcePlatform: 'LinkedIn' | 'Naukri' | 'Indeed' | 'Foundit' | 'Company Website' | 'Glassdoor' | 'Other';
  sourceUrl?: string;
  applicationType: 'PORTAL_APPLICATION' | 'EXTERNAL_REDIRECT';
  applicationUrl?: string;
  deadline?: string | null;
  status?: RequirementStatus;
}

export interface RequirementListResponse {
  requirements: Requirement[];
  total: number;
  page: number;
  pages: number;
}

export interface ClickRecordResult {
  redirectUrl: string;
  sourcePlatform: string;
  clicksCount: number;
}

export interface TrainerStats {
  total: number;
  published: number;
  drafts: number;
  closed: number;
  expired: number;
}

export interface HRStats {
  totalRequirements: number;
  publishedRequirements: number;
  draftRequirements: number;
  closedRequirements: number;
  expiredRequirements: number;
  postedThisWeek: number;
  totalStudents: number;
  totalApplications: number;
  externalApplyClicks: number;
}

export const requirementService = {
  async getTrainerStats(): Promise<TrainerStats> {
    const res = await API.get<ApiResponse<TrainerStats>>('/requirements/trainer/stats');
    return res.data.data;
  },

  async getHRStats(): Promise<HRStats> {
    const res = await API.get<ApiResponse<HRStats>>('/requirements/hr/stats');
    return res.data.data;
  },

  async getRequirements(params?: any): Promise<RequirementListResponse> {
    const res = await API.get<ApiResponse<RequirementListResponse>>('/requirements', { params });
    return res.data.data;
  },

  async getRequirementById(id: string): Promise<Requirement> {
    const res = await API.get<ApiResponse<Requirement>>(`/requirements/${id}`);
    return res.data.data;
  },

  async recordApplyClick(id: string): Promise<ClickRecordResult> {
    const res = await API.post<ApiResponse<ClickRecordResult>>(`/requirements/${id}/apply-click`);
    return res.data.data;
  },

  async createRequirement(payload: CreateRequirementPayload): Promise<Requirement> {
    const res = await API.post<ApiResponse<Requirement>>('/requirements', payload);
    return res.data.data;
  },

  async updateRequirement(id: string, payload: Partial<CreateRequirementPayload>): Promise<Requirement> {
    const res = await API.put<ApiResponse<Requirement>>(`/requirements/${id}`, payload);
    return res.data.data;
  },

  async publishRequirement(id: string): Promise<Requirement> {
    const res = await API.patch<ApiResponse<Requirement>>(`/requirements/${id}/publish`);
    return res.data.data;
  },

  async closeRequirement(id: string): Promise<Requirement> {
    const res = await API.patch<ApiResponse<Requirement>>(`/requirements/${id}/close`);
    return res.data.data;
  },

  async deleteRequirement(id: string): Promise<void> {
    await API.delete(`/requirements/${id}`);
  },
};
