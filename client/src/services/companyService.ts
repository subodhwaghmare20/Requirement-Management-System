import API from './api';
import { ApiResponse, Company } from '../types';

export interface CreateCompanyPayload {
  name: string;
  logoUrl?: string;
  website?: string;
  linkedinUrl?: string;
  industry?: string;
  description?: string;
  locations: string[];
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
  page: number;
  pages: number;
}

export const companyService = {
  async getCompanies(params?: any): Promise<CompanyListResponse> {
    const res = await API.get<ApiResponse<CompanyListResponse>>('/companies', { params });
    return res.data.data;
  },

  async getCompanyById(id: string): Promise<Company> {
    const res = await API.get<ApiResponse<Company>>(`/companies/${id}`);
    return res.data.data;
  },

  async createCompany(payload: CreateCompanyPayload): Promise<Company> {
    const res = await API.post<ApiResponse<Company>>('/companies', payload);
    return res.data.data;
  },

  async updateCompany(id: string, payload: Partial<CreateCompanyPayload>): Promise<Company> {
    const res = await API.put<ApiResponse<Company>>(`/companies/${id}`, payload);
    return res.data.data;
  },

  async toggleCompanyActive(id: string): Promise<Company> {
    const res = await API.patch<ApiResponse<Company>>(`/companies/${id}/toggle-active`);
    return res.data.data;
  },
};
