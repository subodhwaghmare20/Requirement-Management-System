import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicationClick extends Document {
  _id: mongoose.Types.ObjectId;
  requirementId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  sourcePlatform: string;
  clickedAt: Date;
  ipAddress?: string;
  createdAt: Date;
}

const ApplicationClickSchema: Schema = new Schema(
  {
    requirementId: {
      type: Schema.Types.ObjectId,
      ref: 'Requirement',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sourcePlatform: {
      type: String,
      required: true,
      trim: true,
    },
    clickedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

ApplicationClickSchema.index({ requirementId: 1, studentId: 1 });

export const ApplicationClick = mongoose.model<IApplicationClick>(
  'ApplicationClick',
  ApplicationClickSchema
);
