import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  User as UserIcon,
  Phone,
  GraduationCap,
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
      showToast('Profile updated successfully!', 'success');
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
      showToast('Resume uploaded to Cloudinary CDN successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload resume', 'error');
    } finally {
      setIsUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading student profile details..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Keep your skills, course details, and resume PDF up to date for hiring drives.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Details */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Personal Details</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
            <Input label="Email (Account ID)" value={userEmail} disabled className="bg-slate-100 text-slate-500 cursor-not-allowed" />
            <Input label="Mobile Number" placeholder="+91 9876543210" {...register('mobile')} />
            <Input label="Headline" placeholder="e.g. MERN Stack Developer" {...register('headline')} />
          </div>
        </div>

        {/* Academic Details */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Academic Details</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Course / Specialization" placeholder="e.g. Full Stack Web Dev" {...register('course')} />
            <Input label="Batch Code" placeholder="e.g. Batch-2026" {...register('batch')} />
            <Input label="Graduation Year" type="number" placeholder="2026" {...register('graduationYear')} />
          </div>
        </div>

        {/* Skills Tag Management */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Technical Skills</h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a skill (e.g. React, Node.js, Python) and click Add"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddSkill} className="shrink-0 mt-6">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-slate-900">
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && <p className="text-xs text-slate-400">No skills added yet.</p>}
            </div>
          </div>
        </div>

        {/* Resume PDF Section */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Resume & CV Upload</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs text-slate-500 block">Current Resume</span>
              {resumeUrl ? (
                <div>
                  <p className="text-xs font-medium text-slate-800 truncate">{resumeName || 'resume.pdf'}</p>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline mt-1"
                  >
                    <span>View Resume PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No resume uploaded yet.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Upload Resume File (PDF / DOCX)
              </label>
              <div className="relative border border-dashed border-slate-300 hover:border-indigo-400 rounded-lg p-3 text-center cursor-pointer transition-colors bg-white">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileChange}
                  disabled={isUploadingResume}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <UploadCloud className="w-4 h-4 text-slate-400" />
                  <span>{isUploadingResume ? 'Uploading...' : 'Click or drop PDF here (Max 5MB)'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Social Links</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." {...register('linkedinUrl')} error={errors.linkedinUrl?.message} />
            <Input label="GitHub URL" placeholder="https://github.com/..." {...register('githubUrl')} error={errors.githubUrl?.message} />
            <Input label="Portfolio URL" placeholder="https://myportfolio.dev" {...register('portfolioUrl')} error={errors.portfolioUrl?.message} />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
