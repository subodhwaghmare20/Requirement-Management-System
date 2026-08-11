import React, { useEffect, useState } from 'react';
import { Requirement, StudentProfile } from '../../types';
import { studentService } from '../../services/studentService';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { FileText, CheckCircle2, AlertCircle, X, ExternalLink, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortalApplyModalProps {
  requirement: Requirement;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PortalApplyModal: React.FC<PortalApplyModalProps> = ({
  requirement,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const companyObj = typeof requirement.companyId === 'object' ? requirement.companyId : null;
  const companyName = requirement.companyName || companyObj?.name || 'Hiring Company';

  useEffect(() => {
    if (!isOpen) return;
    setLoadingProfile(true);
    setSubmitted(false);

    studentService
      .getProfile()
      .then((data: any) => {
        setProfile(data);
      })
      .catch(() => showToast('Failed to load profile details', 'error'))
      .finally(() => setLoadingProfile(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!profile?.resumeUrl) {
      showToast('Please upload a resume in your profile before applying', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await applicationService.submitApplication(requirement._id, profile.resumeUrl);
      setSubmitted(true);
      showToast('Application Submitted Successfully', 'success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Application Submitted Successfully
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Your profile and resume have been submitted to the placement team for <strong className="text-slate-800">{requirement.title}</strong> at <strong className="text-slate-800">{companyName}</strong>.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/applications"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors text-center"
              >
                View My Applications History
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
                Direct Portal Application
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Apply for {requirement.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{companyName}</p>
            </div>

            {loadingProfile ? (
              <div className="py-8 flex justify-center">
                <LoadingSpinner size="md" label="Verifying student profile resume..." />
              </div>
            ) : !profile?.resumeUrl ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Resume Required</h4>
                    <p className="mt-1 leading-relaxed text-slate-700">
                      You must upload a PDF/DOCX resume in your student profile before applying for portal drives.
                    </p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={onClose}
                  className="block w-full text-center py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
                >
                  Upload Resume in Profile →
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Attached Resume</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate font-semibold text-slate-800">
                        {profile.resumeOriginalName || 'Student_Resume.pdf'}
                      </span>
                    </div>

                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline shrink-0 flex items-center gap-1 text-[11px]"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" label="" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
