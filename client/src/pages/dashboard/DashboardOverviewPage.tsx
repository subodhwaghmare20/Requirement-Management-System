import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Briefcase,
  User,
  PlusCircle,
  Building2,
  FileCheck,
  ArrowRight
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="card-surface p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Placement Portal
          </span>
          <Badge variant="indigo" size="sm">
            {user.role}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          {user.role === 'STUDENT' &&
            'Explore verified external job opportunities from LinkedIn, Naukri, Indeed, and corporate drives.'}
          {user.role === 'TRAINER' &&
            'Manage and post external job requirements for your institute students.'}
          {user.role === 'HR' &&
            'Publish job openings, review candidate applications, and track placement statistics.'}
          {user.role === 'ADMIN' &&
            'Full administrative access to manage users, categories, companies, and requirements.'}
        </p>

        <div className="pt-2 flex flex-wrap gap-2">
          <Link to="/jobs">
            <Button variant="primary" size="sm">
              <Briefcase className="w-4 h-4" />
              <span>Explore Opportunities</span>
            </Button>
          </Link>
          {(user.role === 'TRAINER' || user.role === 'HR' || user.role === 'ADMIN') && (
            <Link to="/post-job">
              <Button variant="outline" size="sm">
                <PlusCircle className="w-4 h-4" />
                <span>Post Requirement</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Workspace Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <Link to="/jobs" className="card-surface-hover p-5 space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Explore Jobs
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Filter verified openings by technology, location, and work mode.
              </p>
            </div>
            <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
              <span>View Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2 */}
          {user.role === 'STUDENT' ? (
            <Link to="/applications" className="card-surface-hover p-5 space-y-3 group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  My Applications
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Track the real-time status of your portal applications.
                </p>
              </div>
              <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                <span>View Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ) : (
            <Link to="/my-postings" className="card-surface-hover p-5 space-y-3 group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Manage Requirements
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create, publish, edit, or close job requirement listings.
                </p>
              </div>
              <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                <span>Manage Postings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          )}

          {/* Card 3 */}
          {user.role === 'STUDENT' ? (
            <Link to="/profile" className="card-surface-hover p-5 space-y-3 group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Profile & Resume
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update your technical skills, passout year, and resume PDF.
                </p>
              </div>
              <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ) : (
            <Link to="/companies" className="card-surface-hover p-5 space-y-3 group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Company Directory
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Maintain hiring organization profiles and website links.
                </p>
              </div>
              <div className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                <span>View Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
