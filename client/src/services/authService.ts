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

export interface SendOtpResponse {
  message: string;
  devOtp?: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse & { requiresOtpVerification?: boolean; devOtp?: string }> {
    const res = await API.post<ApiResponse<AuthResponse & { requiresOtpVerification?: boolean; devOtp?: string }>>('/auth/register', {
      ...payload,
      role: 'STUDENT',
    });
    return res.data.data;
  },

  async sendOtp(email: string): Promise<SendOtpResponse> {
    const res = await API.post<ApiResponse<SendOtpResponse>>('/auth/send-otp', { email });
    return res.data.data;
  },

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const res = await API.post<ApiResponse<AuthResponse>>('/auth/verify-otp', { email, otp });
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse & { requiresOtpVerification?: boolean }> {
    const res = await API.post<ApiResponse<AuthResponse & { requiresOtpVerification?: boolean }>>('/auth/login', payload);
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
