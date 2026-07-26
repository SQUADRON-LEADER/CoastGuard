export type UserRole = 'community_user' | 'community_validator' | 'verifier_protector';
export type VerificationStatus = 'pending' | 'verified' | 'flagged' | 'rejected';
export type HazardType = 'tsunami' | 'storm_surge' | 'high_waves' | 'coastal_flooding' | 'unusual_tides' | 'swell_surges' | 'oil_spill' | 'marine_debris' | 'erosion' | 'pollution';
export type SeverityLevel = 'mild' | 'moderate' | 'serious' | 'severe' | 'critical';
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'kn' | 'gu' | 'mr' | 'bn';
export type UploadType = 'photo' | 'video' | 'document' | 'report';

// Application user interface
export interface User {
  id: string;
  email: string;
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
  badges: Badge[];
  preferredLanguage: Language;
  isOnline: boolean;
  stats: {
    uploadsCount: number;
    verificationsCount: number;
    communityVotes: number;
    accuracy: number;
  };
}

export interface Upload {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: UploadType;
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
  hazardType?: HazardType;
  severity?: SeverityLevel;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  flagReason?: string;
  upvotes: number;
  downvotes: number;
  views: number;
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isLocal: boolean;
  isOfflineUpload: boolean;
  actionLog: ActionLog[];
  aiAnalysis?: {
    confidence: number;
    detectedHazards: string[];
    urgencyScore: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    language: Language;
    keywords: string[];
  };
  metadata: {
    deviceInfo?: string;
    weather?: string;
    tideLevel?: string;
    visibility?: string;
  };
}

export interface ActionLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  isVerifier: boolean;
  language: Language;
  isTranslated?: boolean;
  originalContent?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  category: 'reporting' | 'verification' | 'community' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'telegram';
  content: string;
  author: string;
  authorHandle: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  timestamp: Date;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  sentiment: 'positive' | 'neutral' | 'negative';
  urgencyScore: number;
  language: Language;
  hashtags: string[];
  mentions: string[];
  mediaUrls: string[];
  isVerified: boolean;
  relatedHazards: HazardType[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'location' | 'quick_action';
  language: Language;
  isTranslated?: boolean;
  originalContent?: string;
  quickActions?: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
  color?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'upload_verified' | 'upload_flagged' | 'new_comment' | 'badge_earned' | 'urgent_alert' | 'system_update' | 'verification_request' | 'community_milestone';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
}

export interface TeamNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent';
  tags: string[];
  attachments?: string[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  reactions: {
    userId: string;
    type: 'like' | 'helpful' | 'important' | 'concern';
  }[];
}

export interface FeatureUpdate {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'fix' | 'security';
  version: string;
  createdBy: string;
  createdAt: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  affectedRoles: UserRole[];
  changelogUrl?: string;
  mediaUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MapFilters {
  hazardType: HazardType | 'all';
  status: VerificationStatus | 'all';
  timeRange: 'today' | 'week' | 'month' | 'all';
  severity: SeverityLevel | 'all';
  uploadType: UploadType | 'all';
}

export interface AnalyticsData {
  totalReports: number;
  verifiedReports: number;
  activeUsers: number;
  responseTime: number;
  trends: {
    period: string;
    reports: number;
    verifications: number;
    communityEngagement: number;
  }[];
  hazardDistribution: {
    type: HazardType;
    count: number;
    percentage: number;
  }[];
  locationHotspots: {
    location: string;
    lat: number;
    lng: number;
    reportCount: number;
    severity: number;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  points: number;
  rank: number;
  badges: Badge[];
  stats: {
    uploads: number;
    verifications: number;
    communityVotes: number;
    accuracy: number;
  };
  trend: 'up' | 'down' | 'stable';
}