import { z } from 'zod';

export const updateStudentProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  mobile: z.string().optional(),
  course: z.string().optional(),
  batch: z.string().optional(),
  skills: z.array(z.string()).optional(),
  graduationYear: z.union([z.number(), z.string().transform((v) => Number(v))]).optional(),
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
