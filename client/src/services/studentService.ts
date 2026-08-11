import API from './api';
import { ApiResponse, User, StudentProfile } from '../types';

export interface StudentProfileData {
  user: User;
  profile: StudentProfile;
}

export interface UpdateStudentProfilePayload {
  fullName?: string;
  mobile?: string;
  course?: string;
  batch?: string;
  skills?: string[];
  graduationYear?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  headline?: string;
  bio?: string;
}

export const studentService = {
  async getProfile(): Promise<StudentProfileData> {
    const res = await API.get<ApiResponse<StudentProfileData>>('/students/me');
    return res.data.data;
  },

  async updateProfile(payload: UpdateStudentProfilePayload): Promise<StudentProfileData> {
    const res = await API.put<ApiResponse<StudentProfileData>>('/students/me', payload);
    return res.data.data;
  },

  async uploadResume(formData: FormData): Promise<{ resumeUrl: string; resumeOriginalName: string }> {
    const res = await API.post<ApiResponse<{ resumeUrl: string; resumeOriginalName: string }>>(
      '/students/me/resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.data;
  },
};
