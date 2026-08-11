import { z } from 'zod';

const isValidHttpUrl = (url?: string) => {
  if (!url || url.trim() === '') return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const createRequirementSchema = z
  .object({
    companyId: z.string().min(1, 'Company is required'),
    companyName: z.string().optional(),
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    description: z.string().min(10, 'Job description must be at least 10 characters'),
    categoryId: z.string().optional(),
    skills: z.array(z.string()).default([]),
    experience: z.string().default('Fresher'),
    jobType: z.enum(['FULL_TIME', 'INTERNSHIP', 'CONTRACT', 'PART_TIME', 'APPRENTICESHIP']).default('FULL_TIME'),
    location: z.string().min(2, 'Job location is required'),
    workMode: z.enum(['WORK_FROM_OFFICE', 'HYBRID', 'REMOTE']).default('WORK_FROM_OFFICE'),
    salaryMin: z.union([z.number(), z.string().transform((v) => Number(v) || 0)]).optional().default(0),
    salaryMax: z.union([z.number(), z.string().transform((v) => Number(v) || 0)]).optional().default(0),
    salaryDisclosed: z.boolean().default(false),
    sourcePlatform: z.enum([
      'LinkedIn',
      'Naukri',
      'Indeed',
      'Foundit',
      'Company Website',
      'Glassdoor',
      'Other',
    ]),
    sourceUrl: z
      .string()
      .optional()
      .refine(isValidHttpUrl, 'Source URL must be a valid HTTP or HTTPS link'),
    applicationType: z.enum(['PORTAL_APPLICATION', 'EXTERNAL_REDIRECT']),
    applicationUrl: z
      .string()
      .optional()
      .refine(isValidHttpUrl, 'Application URL must be a valid HTTP or HTTPS link'),
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
      message: 'Application URL is required for EXTERNAL_REDIRECT and must be a valid HTTP or HTTPS link',
      path: ['applicationUrl'],
    }
  );

export const updateRequirementSchema = z.object({
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'INTERNSHIP', 'CONTRACT', 'PART_TIME', 'APPRENTICESHIP']).optional(),
  location: z.string().optional(),
  workMode: z.enum(['WORK_FROM_OFFICE', 'HYBRID', 'REMOTE']).optional(),
  salaryMin: z.union([z.number(), z.string().transform((v) => Number(v) || 0)]).optional(),
  salaryMax: z.union([z.number(), z.string().transform((v) => Number(v) || 0)]).optional(),
  salaryDisclosed: z.boolean().optional(),
  sourcePlatform: z.enum([
    'LinkedIn',
    'Naukri',
    'Indeed',
    'Foundit',
    'Company Website',
    'Glassdoor',
    'Other',
  ]).optional(),
  sourceUrl: z.string().optional().refine(isValidHttpUrl, 'Source URL must be valid HTTP/HTTPS'),
  applicationType: z.enum(['PORTAL_APPLICATION', 'EXTERNAL_REDIRECT']).optional(),
  applicationUrl: z.string().optional().refine(isValidHttpUrl, 'Application URL must be valid HTTP/HTTPS'),
  deadline: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED']).optional(),
});
