import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import {
  Briefcase,
  User,
  PlusCircle,
  Building2,
  FileCheck,
  Bookmark,
  Users,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold">
                Institute Career Portal
              </span>
              <Badge variant="indigo" size="sm">
                Role: {user.role}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user.name} 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {user.role === 'STUDENT' &&
                'Explore verified external job opportunities from LinkedIn, Naukri, Indeed, and corporate drives.'}
              {user.role === 'TRAINER' &&
                'Share and manage external job requirements for your institute students.'}
              {user.role === 'HR' &&
                'Publish external job links, review application stats, and coordinate company drives.'}
              {user.role === 'ADMIN' &&
                'Manage all platform users, companies, requirements, audit logs, and analytics.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse All Jobs</span>
            </Link>

            {(user.role === 'TRAINER' || user.role === 'HR' || user.role === 'ADMIN') && (
              <Link
                to="/post-job"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Requirement</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action & Feature Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Quick Access & Workspace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Job Search */}
          <Link
            to="/jobs"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-blue-300"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              External Job Directory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Search & filter external opportunities by tech stack, experience, and salary range.
            </p>
            <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
              <span>View Listings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Role Specific */}
          {user.role === 'STUDENT' ? (
            <Link
              to="/my-applications"
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                My Job Applications
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Track status of portal applications and recorded external drive clicks.
              </p>
              <div className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span>Check History</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link
              to="/my-postings"
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-amber-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Manage Requirements
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Create, edit draft, publish, or close external job requirement listings.
              </p>
              <div className="mt-4 text-xs font-bold text-amber-600 flex items-center gap-1">
                <span>Manage Postings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {/* Card 3: Profile / Companies */}
          {user.role === 'STUDENT' ? (
            <Link
              to="/profile"
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-purple-300"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Student Profile & Resume
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Keep your technical skills, passout year, education, and resume up to date.
              </p>
              <div className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
                <span>Update Resume</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link
              to="/companies"
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-indigo-300"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Company Database
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Maintain hiring company profiles, logos, websites, and background info.
              </p>
              <div className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
                <span>View Companies</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
