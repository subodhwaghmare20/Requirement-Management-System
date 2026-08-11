import mongoose, { Schema, Document } from 'mongoose';

export type SourcePlatform =
  | 'LinkedIn'
  | 'Naukri'
  | 'Indeed'
  | 'Foundit'
  | 'Company Website'
  | 'Glassdoor'
  | 'Other';

export type JobType =
  | 'FULL_TIME'
  | 'INTERNSHIP'
  | 'CONTRACT'
  | 'PART_TIME'
  | 'APPRENTICESHIP';

export type WorkMode = 'WORK_FROM_OFFICE' | 'HYBRID' | 'REMOTE';

export type ApplicationType = 'PORTAL_APPLICATION' | 'EXTERNAL_REDIRECT';

export type RequirementStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'EXPIRED';

export interface IRequirement extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  companyName?: string;
  companyLogo?: string;
  title: string;
  description: string;
  categoryId?: mongoose.Types.ObjectId;
  skills: string[];
  experience: string;
  jobType: JobType;
  location: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryDisclosed: boolean;
  sourcePlatform: SourcePlatform;
  sourceUrl?: string;
  applicationType: ApplicationType;
  applicationUrl?: string;
  deadline?: Date;
  status: RequirementStatus;
  createdBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  viewsCount: number;
  clicksCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema: Schema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    skills: [{ type: String, trim: true }],
    experience: {
      type: String,
      default: 'Fresher',
    },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'INTERNSHIP', 'CONTRACT', 'PART_TIME', 'APPRENTICESHIP'],
      default: 'FULL_TIME',
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['WORK_FROM_OFFICE', 'HYBRID', 'REMOTE'],
      default: 'WORK_FROM_OFFICE',
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryDisclosed: {
      type: Boolean,
      default: false,
    },
    sourcePlatform: {
      type: String,
      enum: [
        'LinkedIn',
        'Naukri',
        'Indeed',
        'Foundit',
        'Company Website',
        'Glassdoor',
        'Other',
      ],
      required: [true, 'Source platform is required'],
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    applicationType: {
      type: String,
      enum: ['PORTAL_APPLICATION', 'EXTERNAL_REDIRECT'],
      required: [true, 'Application type is required'],
    },
    applicationUrl: {
      type: String,
      default: '',
      trim: true,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED'],
      default: 'PUBLISHED',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    clicksCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// MongoDB Atlas Query Optimization Indexes
RequirementSchema.index({ status: 1, deadline: 1 });
RequirementSchema.index({ categoryId: 1 });
RequirementSchema.index({ location: 1 });
RequirementSchema.index({ sourcePlatform: 1 });
RequirementSchema.index({ createdAt: -1 });
RequirementSchema.index({ createdBy: 1 });

RequirementSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  skills: 'text',
});

export const Requirement = mongoose.model<IRequirement>(
  'Requirement',
  RequirementSchema
);
