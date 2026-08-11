import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  logoUrl: z.string().optional().refine(
    (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    'Logo URL must be a valid URL or path'
  ),
  website: z.string().optional().refine(
    (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://'),
    'Website URL must start with http:// or https://'
  ),
  linkedinUrl: z.string().optional().refine(
    (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://'),
    'LinkedIn URL must start with http:// or https://'
  ),
  industry: z.string().optional(),
  description: z.string().optional(),
  locations: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCompanySchema = createCompanySchema.partial();
