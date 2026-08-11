import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardOverviewPage } from '../pages/dashboard/DashboardOverviewPage';
import { ProfilePage } from '../pages/student/ProfilePage';
import { CompanyManagementPage } from '../pages/admin/CompanyManagementPage';
import { PostJobPage } from '../pages/requirements/PostJobPage';
import { JobListingPage } from '../pages/jobs/JobListingPage';
import { JobDetailPage } from '../pages/jobs/JobDetailPage';
import { StudentApplicationsPage } from '../pages/student/StudentApplicationsPage';
import { ApplicationDetailPage } from '../pages/student/ApplicationDetailPage';
import { SavedJobsPage } from '../pages/student/SavedJobsPage';
import { TrainerDashboardPage } from '../pages/trainer/TrainerDashboardPage';
import { TrainerRequirementsDirectoryPage } from '../pages/trainer/TrainerRequirementsDirectoryPage';
import { TrainerCreateJobPage } from '../pages/trainer/TrainerCreateJobPage';
import { TrainerEditJobPage } from '../pages/trainer/TrainerEditJobPage';
import { HRDashboardPage } from '../pages/hr/HRDashboardPage';
import { HRRequirementsDirectoryPage } from '../pages/hr/HRRequirementsDirectoryPage';
import { HRCandidateApplicationsPage } from '../pages/hr/HRCandidateApplicationsPage';
import { AnalyticsDashboardPage } from '../pages/hr/AnalyticsDashboardPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Authenticated Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Student Job Discovery Routes */}
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Student Profile, Application & Bookmarks Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/applications" element={<StudentApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/saved-jobs" element={<SavedJobsPage />} />
          </Route>

          {/* Trainer Specific Dashboard & Posting Routes */}
          <Route element={<ProtectedRoute allowedRoles={['TRAINER', 'HR', 'ADMIN']} />}>
            <Route path="/dashboard/trainer" element={<TrainerDashboardPage />} />
            <Route path="/dashboard/trainer/requirements" element={<TrainerRequirementsDirectoryPage />} />
            <Route path="/dashboard/trainer/requirements/create" element={<TrainerCreateJobPage />} />
            <Route path="/dashboard/trainer/requirements/:id/edit" element={<TrainerEditJobPage />} />
          </Route>

          {/* Admin Specific Master Panel Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
          </Route>

          {/* HR & Admin Analytics & Candidate Review Routes */}
          <Route element={<ProtectedRoute allowedRoles={['HR', 'ADMIN']} />}>
            <Route path="/dashboard/hr" element={<HRDashboardPage />} />
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/hr/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/hr/requirements" element={<HRRequirementsDirectoryPage />} />
            <Route path="/admin/requirements" element={<HRRequirementsDirectoryPage />} />
            <Route path="/hr/requirements/:requirementId/applications" element={<HRCandidateApplicationsPage />} />
            <Route path="/admin/requirements/:requirementId/applications" element={<HRCandidateApplicationsPage />} />
          </Route>

          {/* Shared Management Routes */}
          <Route element={<ProtectedRoute allowedRoles={['HR', 'ADMIN', 'TRAINER']} />}>
            <Route path="/companies" element={<CompanyManagementPage />} />
            <Route path="/admin/companies" element={<CompanyManagementPage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/my-postings" element={<TrainerRequirementsDirectoryPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
