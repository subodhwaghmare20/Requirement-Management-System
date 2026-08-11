import API from './api';
import { ApiResponse, User } from '../types';

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  roles: {
    students: number;
    trainers: number;
    hr: number;
    admins: number;
  };
  totalRequirements: number;
  totalApplications: number;
  totalCompanies: number;
  totalCategories: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'TRAINER' | 'HR' | 'ADMIN' | 'STUDENT';
  phone?: string;
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const res = await API.get<ApiResponse<AdminDashboardStats>>('/admin/stats');
    return res.data.data;
  },

  async getUsers(params?: any): Promise<UserListResponse> {
    const res = await API.get<ApiResponse<UserListResponse>>('/admin/users', { params });
    return res.data.data;
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const res = await API.post<ApiResponse<User>>('/admin/users', payload);
    return res.data.data;
  },

  async toggleUserActive(id: string): Promise<User> {
    const res = await API.patch<ApiResponse<User>>(`/admin/users/${id}/toggle-active`);
    return res.data.data;
  },

  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const res = await API.put<ApiResponse<User>>(`/admin/users/${id}`, payload);
    return res.data.data;
  },
};
