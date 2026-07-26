import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, VerificationStatus, Language } from '../types';

// User Schema
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  location?: {
    lat: number;
    lng: number;
    address: string;
    accuracy?: number;
  };
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  verificationStatus: VerificationStatus;
  points: number;
  badges: string[];
  preferredLanguage: Language;
  isOnline: boolean;
  stats: {
    uploadsCount: number;
    verificationsCount: number;
    communityVotes: number;
    accuracy: number;
  };
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['community_user', 'community_validator', 'verifier_protector'], 
    default: 'community_user' 
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    accuracy: { type: Number }
  },
  avatar: { type: String },
  lastLogin: { type: Date },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'flagged', 'rejected'], 
    default: 'pending' 
  },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  preferredLanguage: { 
    type: String, 
    enum: ['en', 'hi', 'ta', 'te', 'ml', 'kn', 'gu', 'mr', 'bn'], 
    default: 'en' 
  },
  isOnline: { type: Boolean, default: false },
  stats: {
    uploadsCount: { type: Number, default: 0 },
    verificationsCount: { type: Number, default: 0 },
    communityVotes: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Upload Schema
export interface IUpload extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    accuracy?: number;
  };
  hazardType?: string;
  severity?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  flagReason?: string;
  upvotes: number;
  downvotes: number;
  views: number;
  tags: string[];
  isLocal: boolean;
  isOfflineUpload: boolean;
  aiAnalysis?: {
    confidence: number;
    detectedHazards: string[];
    urgencyScore: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    language: Language;
    keywords: string[];
  };
  metadata: any;
}

const UploadSchema = new Schema<IUpload>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    accuracy: { type: Number }
  },
  hazardType: { type: String },
  severity: { type: String },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'flagged', 'rejected'], 
    default: 'pending' 
  },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  flagReason: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  isLocal: { type: Boolean, default: false },
  isOfflineUpload: { type: Boolean, default: false },
  aiAnalysis: {
    confidence: { type: Number },
    detectedHazards: [{ type: String }],
    urgencyScore: { type: Number },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    language: { type: String },
    keywords: [{ type: String }]
  },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// Comment Schema
export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  uploadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  uploadId: { type: Schema.Types.ObjectId, ref: 'Upload', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ verificationStatus: 1 });

UploadSchema.index({ userId: 1 });
UploadSchema.index({ verificationStatus: 1 });
UploadSchema.index({ createdAt: -1 });
UploadSchema.index({ 'location.lat': 1, 'location.lng': 1 });

CommentSchema.index({ uploadId: 1 });
CommentSchema.index({ userId: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
export const Upload = mongoose.model<IUpload>('Upload', UploadSchema);
export const Comment = mongoose.model<IComment>('Comment', CommentSchema);