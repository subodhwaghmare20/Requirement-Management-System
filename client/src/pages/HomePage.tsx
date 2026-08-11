import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Zap,
  Users,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  Building,
  Target
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Institute External Career Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Centralized Hub for External Job Opportunities
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating fragmented WhatsApp link sharing. Verified job openings from LinkedIn, Naukri, Indeed, Foundit & company career portals, curated specifically for institute students.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>Student & Trainer Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-base border border-slate-700 transition-all flex items-center gap-2"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* Platform Badges */}
          <div className="mt-16 pt-8 border-t border-slate-800/80">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-6">
              Aggregation From Top External Career Portals
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-300">
              <span className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> LinkedIn Jobs
              </span>
              <span className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" /> Naukri Tech
              </span>
              <span className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" /> Indeed Openings
              </span>
              <span className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" /> Foundit
              </span>
              <span className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" /> Company Websites
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed to Streamline External Placements
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Everything your HR team, trainers, and students need to manage external job drives effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Direct External Link Tracking
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track student redirect clicks on external career portal links accurately without false status claims.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Advanced Filters & Search
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Students can filter opportunities by tech stack, experience level, salary range, location, and platform source.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Trainer & HR Controls
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Role-based posting workflows with Draft, Published, Closed, and Expired status lifecycle management.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
