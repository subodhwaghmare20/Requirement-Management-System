export type UserRole = 'STUDENT' | 'TRAINER' | 'HR' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  isActive?: boolean;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  _id?: string;
  userId: string;
  course?: string;
  batch?: string;
  skills: string[];
  graduationYear?: number;
  headline?: string;
  education?: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    passoutYear: number;
    cgpaOrPercentage?: string;
  };
  experienceLevel?: 'FRESHER' | '0-1_YEARS' | '1-3_YEARS' | '3+_YEARS';
  resumeUrl?: string;
  resumeOriginalName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  preferredLocations?: string[];
}

export interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  linkedinUrl?: string;
  industry?: string;
  description?: string;
  locations: string[];
  isActive: boolean;
  createdById?: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export type SourcePlatform =
  | 'LinkedIn'
  | 'Naukri'
  | 'Indeed'
  | 'Foundit'
  | 'Company Website'
  | 'Glassdoor'
  | 'Other';

export type JobType =
  | 'FULL_TIME'
  | 'INTERNSHIP'
  | 'CONTRACT'
  | 'PART_TIME'
  | 'APPRENTICESHIP';

export type WorkMode = 'WORK_FROM_OFFICE' | 'HYBRID' | 'REMOTE';

export type ApplicationType = 'PORTAL_APPLICATION' | 'EXTERNAL_REDIRECT';

export type RequirementStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'EXPIRED';

export interface Requirement {
  _id: string;
  companyId: Company | string;
  companyName?: string;
  companyLogo?: string;
  title: string;
  description: string;
  categoryId?: Category | string;
  skills: string[];
  experience: string;
  jobType: JobType;
  location: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryDisclosed: boolean;
  sourcePlatform: SourcePlatform;
  sourceUrl?: string;
  applicationType: ApplicationType;
  applicationUrl?: string;
  deadline?: string;
  status: RequirementStatus;
  createdBy: User | string;
  publishedAt?: string;
  viewsCount: number;
  clicksCount: number;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  hasApplied?: boolean;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Application {
  _id: string;
  requirementId: Requirement | string;
  studentId: User | string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  remarks?: string;
}

export type NotificationType =
  | 'NEW_REQUIREMENT'
  | 'APPLICATION_STATUS'
  | 'DEADLINE_REMINDER'
  | 'SYSTEM';

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: any;
}

export interface AuthResponse {
  user: User;
  token: string;
  studentProfile?: StudentProfile | null;
}
