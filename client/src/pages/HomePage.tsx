import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import {
  Zap,
  Search,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Globe,
  Building2
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200/80 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Institute Placement Opportunity Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Centralized Platform for External Job Opportunities
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminating fragmented link sharing. Verified job openings aggregated from LinkedIn, Naukri, Indeed, Foundit, and company portals, curated specifically for students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    <span>Student Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    <span>Sign In</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Platform Source Badges */}
          <div className="pt-12 border-t border-slate-100">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
              Curated Openings From Leading Sources
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600">
              <span className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200/60 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
              </span>
              <span className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200/60 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-600" /> Naukri Tech
              </span>
              <span className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200/60 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" /> Indeed
              </span>
              <span className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200/60 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" /> Foundit
              </span>
              <span className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200/60 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" /> Company Websites
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Designed for Placement Efficiency
          </h2>
          <p className="text-sm text-slate-600">
            Empowering students, trainers, and HR leads with clean workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-surface p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Apply Click Tracking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track student redirect clicks on external career portal links accurately without claiming unverified external applications.
            </p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Targeted Filters & Search
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students can filter opportunities by tech stack, experience, location, source platform, and salary disclosure.
            </p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Structured Controls
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Role-based requirement posting workflows with Draft, Published, Closed, and Expired status lifecycle management.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
