import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Linkedin,
  Github,
  Globe,
  FileText,
  UploadCloud,
  Plus,
  X,
  Save,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().optional(),
  course: z.string().optional(),
  batch: z.string().optional(),
  graduationYear: z.union([z.number(), z.string().transform((v) => Number(v) || undefined)]).optional(),
  linkedinUrl: z.string().optional().refine(
    (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://'),
    'LinkedIn URL must start with http:// or https://'
  ),
  githubUrl: z.string().optional().refine(
    (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://'),
    'GitHub URL must start with http:// or https://'
  ),
  portfolioUrl: z.string().optional().refine(
    (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://'),
    'Portfolio URL must start with http:// or https://'
  ),
  headline: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { showToast } = useToast();
  const { updateLocalUser, updateLocalProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingResume, setIsUploadingResume] = useState<boolean>(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');

  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [resumeName, setResumeName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await studentService.getProfile();
      setUserEmail(data.user.email);
      setSkills(data.profile.skills || []);
      setResumeUrl(data.profile.resumeUrl || '');
      setResumeName(data.profile.resumeOriginalName || '');

      reset({
        fullName: data.user.name,
        mobile: data.user.phone || '',
        course: data.profile.course || '',
        batch: data.profile.batch || '',
        graduationYear: data.profile.graduationYear || undefined,
        linkedinUrl: data.profile.linkedinUrl || '',
        githubUrl: data.profile.githubUrl || '',
        portfolioUrl: data.profile.portfolioUrl || '',
        headline: data.profile.headline || '',
        bio: data.profile.bio || '',
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const onSubmit = async (formData: ProfileFormData) => {
    setIsSaving(true);
    try {
      const result = await studentService.updateProfile({
        ...formData,
        skills,
      });
      updateLocalUser(result.user);
      updateLocalProfile(result.profile);
      showToast('Student profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Resume file size must be less than 5 MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsUploadingResume(true);
    try {
      const res = await studentService.uploadResume(formData);
      setResumeUrl(res.resumeUrl);
      setResumeName(res.resumeOriginalName);
      showToast('Resume uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload resume', 'error');
    } finally {
      setIsUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading student profile details..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Student Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Profile & Career Resume
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Keep your skills, course details, and resume up to date for external hiring drives.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Details Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Your basic contact details for recruiters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-500">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  {...register('mobile')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Professional Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack Web Developer | MERN Stack Specialist"
                {...register('headline')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic & Institute Information</h2>
              <p className="text-xs text-slate-500">Your current enrolled course, batch, and graduation year</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Course / Specialization
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack Web Development"
                {...register('course')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Batch Code / ID
              </label>
              <input
                type="text"
                placeholder="e.g. Batch-2026-FSWD"
                {...register('batch')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Graduation / Passout Year
              </label>
              <input
                type="number"
                placeholder="2026"
                {...register('graduationYear')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Management Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Technical Skills</h2>
              <p className="text-xs text-slate-500">Add key skills to match relevant job requirements</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. React, TypeScript, Node.js, Python) and press Enter"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-blue-100 p-0.5 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-blue-500 hover:text-blue-800" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-slate-400 italic">No skills added yet. Add your core technical stack above.</p>
              )}
            </div>
          </div>
        </div>

        {/* Resume Management Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Resume & CV Upload</h2>
              <p className="text-xs text-slate-500">Upload your latest PDF or Word resume (Max size: 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Current Resume Info */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-slate-800">Current Resume</span>
              </div>
              {resumeUrl ? (
                <div>
                  <p className="text-xs font-semibold text-slate-700 truncate">{resumeName || 'resume.pdf'}</p>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View / Download Resume PDF</span>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No resume uploaded yet.</p>
              )}
            </div>

            {/* Upload Control */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Upload New Resume File
              </label>
              <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileChange}
                  disabled={isUploadingResume}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    {isUploadingResume ? 'Uploading resume...' : 'Click or drop PDF/DOCX here'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 5MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Social Links & Online Profiles</h2>
              <p className="text-xs text-slate-500">Provide direct links to your professional profiles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                {...register('linkedinUrl')}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all ${
                  errors.linkedinUrl ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.linkedinUrl && (
                <p className="mt-1 text-xs text-rose-500">{errors.linkedinUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Github className="w-4 h-4 text-slate-800" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                {...register('githubUrl')}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all ${
                  errors.githubUrl ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.githubUrl && (
                <p className="mt-1 text-xs text-rose-500">{errors.githubUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Portfolio Website</span>
              </label>
              <input
                type="url"
                placeholder="https://myportfolio.dev"
                {...register('portfolioUrl')}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all ${
                  errors.portfolioUrl ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.portfolioUrl && (
                <p className="mt-1 text-xs text-rose-500">{errors.portfolioUrl.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-base disabled:opacity-70"
          >
            {isSaving ? (
              <LoadingSpinner size="sm" label="" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
