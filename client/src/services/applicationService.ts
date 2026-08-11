import API from './api';
import { ApiResponse, Application, ApplicationStatus, Requirement } from '../types';

export interface CandidateApplicationItem {
  _id: string;
  requirementId: string;
  student: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  course: string;
  batch: string;
  skills: string[];
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  remarks: string;
}

export interface RequirementApplicationsResponse {
  requirement: Requirement;
  totalApplications: number;
  applications: CandidateApplicationItem[];
}

export const applicationService = {
  async submitApplication(requirementId: string, resumeUrl?: string): Promise<Application> {
    const res = await API.post<ApiResponse<Application>>('/applications', {
      requirementId,
      resumeUrl,
    });
    return res.data.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await API.get<ApiResponse<Application[]>>('/applications/my');
    return res.data.data;
  },

  async getRequirementApplications(requirementId: string): Promise<RequirementApplicationsResponse> {
    const res = await API.get<ApiResponse<RequirementApplicationsResponse>>(
      `/applications/requirement/${requirementId}`
    );
    return res.data.data;
  },

  async getApplicationById(id: string): Promise<Application> {
    const res = await API.get<ApiResponse<Application>>(`/applications/${id}`);
    return res.data.data;
  },

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    remarks?: string
  ): Promise<Application> {
    const res = await API.patch<ApiResponse<Application>>(`/applications/${id}/status`, {
      status,
      remarks,
    });
    return res.data.data;
  },

  async withdrawApplication(id: string): Promise<Application> {
    const res = await API.patch<ApiResponse<Application>>(`/applications/${id}/withdraw`);
    return res.data.data;
  },
};
