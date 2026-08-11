import React from 'react';
import { Briefcase, ExternalLink, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">External Opportunity Portal</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              Empowering technical institute students with curated external career opportunities from LinkedIn, Naukri, Indeed, Foundit, and top corporate career platforms.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Dedicated strictly for external hiring drives and direct career links.</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Supported Sources
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Career Drives</li>
              <li className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Naukri Tech Openings</li>
              <li className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Indeed Opportunities</li>
              <li className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Direct Corporate Websites</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Institute Support
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-2">
              Have questions regarding job verification or requirement postings?
            </p>
            <a href="mailto:placement@institute.edu" className="text-sm text-blue-400 font-medium hover:underline">
              placement@institute.edu
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Technical Institute Career Division. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
