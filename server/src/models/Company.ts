import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  logoUrl?: string;
  website?: string;
  linkedinUrl?: string;
  industry?: string;
  description?: string;
  locations: string[];
  isActive: boolean;
  createdById: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    logoUrl: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    linkedinUrl: { type: String, default: '', trim: true },
    industry: { type: String, default: 'Technology', trim: true },
    description: { type: String, default: '', trim: true },
    locations: [{ type: String, trim: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

CompanySchema.index({ name: 'text', industry: 'text' });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
