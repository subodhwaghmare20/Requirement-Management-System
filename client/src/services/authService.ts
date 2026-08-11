import API from './api';
import { ApiResponse, AuthResponse, User, StudentProfile } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await API.post<ApiResponse<AuthResponse>>('/auth/register', {
      ...payload,
      role: 'STUDENT',
    });
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await API.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return res.data.data;
  },

  async logout(): Promise<void> {
    await API.post('/auth/logout');
  },

  async getCurrentUser(): Promise<{ user: User; studentProfile: StudentProfile | null }> {
    const res = await API.get<ApiResponse<{ user: User; studentProfile: StudentProfile | null }>>('/auth/me');
    return res.data.data;
  },

  async updatePassword(data: { currentPassword?: string; newPassword?: string }): Promise<void> {
    await API.patch('/auth/update-password', data);
  },
};
