import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Requirement, SourcePlatform, JobType, WorkMode, ApplicationType, RequirementStatus } from '../../types';
import { CompanySelector } from '../common/CompanySelector';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Briefcase, MapPin, Globe, DollarSign, Calendar, Plus, X, AlertCircle } from 'lucide-react';

const isValidHttpUrl = (url?: string) => {
  if (!url || url.trim() === '') return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const requirementFormSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    companyId: z.string().min(1, 'Company selection is required'),
    companyName: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    experience: z.string().min(1, 'Experience is required'),
    jobType: z.enum(['FULL_TIME', 'INTERNSHIP', 'CONTRACT', 'PART_TIME', 'APPRENTICESHIP']),
    location: z.string().min(2, 'Location is required'),
    workMode: z.enum(['WORK_FROM_OFFICE', 'HYBRID', 'REMOTE']),
    salaryMin: z.union([z.number(), z.string().transform((v) => Number(v) || 0)]).optional(),
    salaryMax: z.union([z.number(), z.string().transform((v) => Number(v) || 0)]).optional(),
    salaryDisclosed: z.boolean().default(false),
    sourcePlatform: z.enum(['LinkedIn', 'Naukri', 'Indeed', 'Foundit', 'Company Website', 'Glassdoor', 'Other']),
    sourceUrl: z.string().optional().refine(isValidHttpUrl, 'Source URL must be valid http:// or https://'),
    applicationType: z.enum(['PORTAL_APPLICATION', 'EXTERNAL_REDIRECT']),
    applicationUrl: z.string().optional().refine(isValidHttpUrl, 'Application URL must be valid http:// or https://'),
    deadline: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED']).default('PUBLISHED'),
  })
  .refine(
    (data) => {
      if (data.applicationType === 'EXTERNAL_REDIRECT') {
        return !!data.applicationUrl && data.applicationUrl.trim().length > 0 && isValidHttpUrl(data.applicationUrl);
      }
      return true;
    },
    {
      message: 'Application URL is required for External Redirect drives and must be a valid HTTP/HTTPS link',
      path: ['applicationUrl'],
    }
  );

type RequirementFormData = z.infer<typeof requirementFormSchema>;

interface RequirementFormProps {
  initialData?: Requirement | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const RequirementForm: React.FC<RequirementFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState<string>('');

  const initialCompanyId =
    typeof initialData?.companyId === 'object'
      ? initialData?.companyId._id
      : initialData?.companyId || '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequirementFormData>({
    resolver: zodResolver(requirementFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      companyId: initialCompanyId,
      companyName: initialData?.companyName || '',
      description: initialData?.description || '',
      experience: initialData?.experience || 'Fresher',
      jobType: initialData?.jobType || 'FULL_TIME',
      location: initialData?.location || '',
      workMode: initialData?.workMode || 'WORK_FROM_OFFICE',
      salaryMin: initialData?.salaryMin || 0,
      salaryMax: initialData?.salaryMax || 0,
      salaryDisclosed: initialData?.salaryDisclosed || false,
      sourcePlatform: initialData?.sourcePlatform || 'LinkedIn',
      sourceUrl: initialData?.sourceUrl || '',
      applicationType: initialData?.applicationType || 'EXTERNAL_REDIRECT',
      applicationUrl: initialData?.applicationUrl || '',
      deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
      status: initialData?.status || 'PUBLISHED',
    },
  });

  const selectedAppType = watch('applicationType');
  const salaryDisclosedWatch = watch('salaryDisclosed');

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

  const handleCompanySelect = (company: any) => {
    if (company._id) {
      setValue('companyId', company._id);
      setValue('companyName', company.name);
    } else {
      setValue('companyId', 'CUSTOM_NEW');
      setValue('companyName', company.name);
    }
  };

  const handleFormSubmit = async (data: RequirementFormData) => {
    await onSubmit({
      ...data,
      skills,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title & Company Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Requirement Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Frontend Engineer (React/TypeScript)"
            {...register('title')}
            className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white text-slate-900 text-sm font-medium transition-all ${
              errors.title ? 'border-rose-300' : 'border-slate-200'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Hiring Company *
          </label>
          <CompanySelector value={initialCompanyId} onSelect={handleCompanySelect} />
          {errors.companyId && <p className="mt-1 text-xs text-rose-500">{errors.companyId.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Job Description & Requirements *
        </label>
        <textarea
          rows={4}
          placeholder="Paste external job description, eligibility criteria, and key responsibilities..."
          {...register('description')}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white text-slate-900 text-sm font-medium transition-all ${
            errors.description ? 'border-rose-300' : 'border-slate-200'
          }`}
        />
        {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>}
      </div>

      {/* Source Platform & Application Type */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          External Source & Application Method
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Source Platform *
            </label>
            <select
              {...register('sourcePlatform')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Naukri">Naukri</option>
              <option value="Indeed">Indeed</option>
              <option value="Foundit">Foundit</option>
              <option value="Company Website">Company Website</option>
              <option value="Glassdoor">Glassdoor</option>
              <option value="Other">Other Source</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Application Method *
            </label>
            <select
              {...register('applicationType')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium"
            >
              <option value="EXTERNAL_REDIRECT">⚡ External Redirect (Redirects to original website link)</option>
              <option value="PORTAL_APPLICATION">📝 Portal Application (Student applies directly on portal)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Source Listing URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/jobs/view/..."
              {...register('sourceUrl')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium"
            />
            {errors.sourceUrl && <p className="mt-1 text-xs text-rose-500">{errors.sourceUrl.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {selectedAppType === 'EXTERNAL_REDIRECT' ? 'External Application URL *' : 'Application URL (Optional)'}
            </label>
            <input
              type="url"
              placeholder="https://company.careers/apply/..."
              {...register('applicationUrl')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 text-sm font-medium ${
                errors.applicationUrl ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.applicationUrl && <p className="mt-1 text-xs text-rose-500">{errors.applicationUrl.message}</p>}
          </div>
        </div>
      </div>

      {/* Role Details: Job Type, Work Mode, Location, Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Job Type
          </label>
          <select
            {...register('jobType')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
            <option value="PART_TIME">Part Time</option>
            <option value="APPRENTICESHIP">Apprenticeship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Work Mode
          </label>
          <select
            {...register('workMode')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          >
            <option value="WORK_FROM_OFFICE">Work From Office</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Location *
          </label>
          <input
            type="text"
            placeholder="e.g. Bangalore / Remote"
            {...register('location')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          />
          {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Experience Required
          </label>
          <input
            type="text"
            placeholder="e.g. Fresher / 0-2 Yrs"
            {...register('experience')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          />
        </div>
      </div>

      {/* Salary & Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Salary Disclosed?</span>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                {...register('salaryDisclosed')}
                className="w-4 h-4 rounded-xs text-blue-600 focus:ring-blue-500"
              />
              Show Salary Figures
            </label>
          </div>

          {salaryDisclosedWatch && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Min Salary (₹)
                </label>
                <input
                  type="number"
                  placeholder="300000"
                  {...register('salaryMin')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Max Salary (₹)
                </label>
                <input
                  type="number"
                  placeholder="600000"
                  {...register('salaryMax')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-medium"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Application Deadline
          </label>
          <input
            type="date"
            {...register('deadline')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          />
        </div>
      </div>

      {/* Skills Tag Management */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Key Technical Skills Required
        </label>
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
            placeholder="Type required skill (e.g. React, Node.js, SQL) and press Enter"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-blue-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Form Action Buttons: Save Draft vs Publish */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-sm"
          >
            Cancel
          </button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => handleFormSubmit({ ...data, status: 'DRAFT' }))}
            className="px-6 py-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => handleFormSubmit({ ...data, status: 'PUBLISHED' }))}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" label="" />
            ) : (
              <span>Publish Requirement</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
