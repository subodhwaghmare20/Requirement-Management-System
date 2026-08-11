import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  requirementId: mongoose.Types.ObjectId;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  remarks?: string;
}

const ApplicationSchema: Schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requirementId: {
      type: Schema.Types.ObjectId,
      ref: 'Requirement',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required to apply'],
    },
    status: {
      type: String,
      enum: [
        'APPLIED',
        'UNDER_REVIEW',
        'SHORTLISTED',
        'INTERVIEW',
        'SELECTED',
        'REJECTED',
        'WITHDRAWN',
      ],
      default: 'APPLIED',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications by the same student for the same requirement
ApplicationSchema.index({ studentId: 1, requirementId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema
);
