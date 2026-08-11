import React from 'react';
import { Requirement } from '../../types';
import { ExternalLink, ShieldAlert, X, Globe, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ExternalRedirectModalProps {
  requirement: Requirement;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRedirecting?: boolean;
}

export const ExternalRedirectModal: React.FC<ExternalRedirectModalProps> = ({
  requirement,
  isOpen,
  onClose,
  onConfirm,
  isRedirecting = false,
}) => {
  if (!isOpen) return null;

  const companyObj = typeof requirement.companyId === 'object' ? requirement.companyId : null;
  const companyName = requirement.companyName || companyObj?.name || 'Hiring Company';
  const targetUrl = requirement.applicationUrl || requirement.sourceUrl || '';

  let hostname = '';
  try {
    if (targetUrl) {
      hostname = new URL(targetUrl).hostname;
    }
  } catch {
    hostname = requirement.sourcePlatform;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          disabled={isRedirecting}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25">
            <ExternalLink className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
              External Job Provider
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Redirecting to External Application
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              {requirement.title} at <span className="text-slate-800">{companyName}</span>
            </p>
          </div>

          {/* External Notice Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Target Website: {hostname || requirement.sourcePlatform}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              You are leaving our institute portal to complete your application on the official <strong className="text-slate-700">{requirement.sourcePlatform}</strong> website or company portal.
            </p>
          </div>

          {/* Tracking Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-medium text-left flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> We record your link click for placement drive tracking. We do not claim an application was submitted until you complete it on the external site.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRedirecting}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isRedirecting}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              {isRedirecting ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <>
                  <span>Proceed to Apply ↗</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
