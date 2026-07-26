import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language, HazardType, SeverityLevel } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return 'Unknown';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return 'Unknown';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return d.toLocaleDateString();
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function isLocalUpload(userLat: number, userLng: number, uploadLat: number, uploadLng: number): boolean {
  const distance = calculateDistance(userLat, userLng, uploadLat, uploadLng);
  return distance <= 50; // Within 50km radius
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getLocationAccuracy(accuracy?: number): string {
  if (!accuracy) return 'Unknown';
  if (accuracy < 10) return 'High';
  if (accuracy < 50) return 'Medium';
  return 'Low';
}

export function calculateUrgencyScore(
  severity: SeverityLevel, 
  upvotes: number, 
  timeElapsed: number,
  communityEngagement: number = 0
): number {
  let score = 0;
  
  // Severity weight (0-40 points)
  switch (severity) {
    case 'critical': score += 40; break;
    case 'severe': score += 32; break;
    case 'serious': score += 24; break;
    case 'moderate': score += 16; break;
    case 'mild': score += 8; break;
  }
  
  // Community engagement (0-30 points)
  score += Math.min(upvotes * 2 + communityEngagement, 30);
  
  // Time decay (0-30 points, decreases over time)
  const hoursElapsed = timeElapsed / (1000 * 60 * 60);
  score += Math.max(30 - hoursElapsed, 0);
  
  return Math.min(score, 100);
}

export function translateText(text: string, targetLanguage: Language): Promise<string> {
  // Mock translation service - in real app, integrate with Google Translate API
  const translations: Record<string, Record<Language, string>> = {
    'Hello': {
      en: 'Hello',
      hi: 'नमस्ते',
      ta: 'வணக்கம்',
      te: 'నమస్కారం',
      ml: 'നമസ്കാരം',
      kn: 'ನಮಸ್ಕಾರ',
      gu: 'નમસ્તે',
      mr: 'नमस्कार',
      bn: 'নমস্কার'
    },
    'Upload Report': {
      en: 'Upload Report',
      hi: 'रिपोर्ट अपलोड करें',
      ta: 'அறிக்கை பதிவேற்றவும்',
      te: 'నివేదికను అప్‌లోడ్ చేయండి',
      ml: 'റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക',
      kn: 'ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      gu: 'રિપોર્ટ અપલોડ કરો',
      mr: 'अहवाल अपलोड करा',
      bn: 'রিপোর্ট আপলোড করুন'
    }
  };
  
  return Promise.resolve(translations[text]?.[targetLanguage] || text);
}

export function detectLanguage(text: string): Language {
  // Mock language detection - in real app, use proper NLP service
  const patterns = {
    hi: /[\u0900-\u097F]/,
    ta: /[\u0B80-\u0BFF]/,
    te: /[\u0C00-\u0C7F]/,
    ml: /[\u0D00-\u0D7F]/,
    kn: /[\u0C80-\u0CFF]/,
    gu: /[\u0A80-\u0AFF]/,
    mr: /[\u0900-\u097F]/,
    bn: /[\u0980-\u09FF]/,
  };
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang as Language;
  }
  
  return 'en';
}

export function formatPoints(points: number): string {
  if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
  return points.toString();
}

export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'bg-red-600';
    case 'severe': return 'bg-red-500';
    case 'serious': return 'bg-orange-500';
    case 'moderate': return 'bg-yellow-500';
    case 'mild': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

export function getStatusColor(status: VerificationStatus): string {
  switch (status) {
    case 'verified': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'flagged': return 'text-orange-600 bg-orange-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });
  });
}

export function generateUploadId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateUpload(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not supported' };
  }
  
  return { isValid: true };
}

export function extractMetadata(file: File): Promise<any> {
  return new Promise((resolve) => {
    // Mock metadata extraction
    resolve({
      deviceInfo: navigator.userAgent,
      timestamp: new Date(),
      fileSize: file.size,
      fileType: file.type,
    });
  });
}

export function analyzeImageWithAI(imageUrl: string): Promise<{
  confidence: number;
  detectedHazards: HazardType[];
  urgencyScore: number;
  keywords: string[];
}> {
  // Mock AI analysis
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        confidence: 0.85 + Math.random() * 0.15,
        detectedHazards: ['high_waves', 'coastal_flooding'],
        urgencyScore: Math.floor(Math.random() * 40) + 60,
        keywords: ['waves', 'flooding', 'coastal', 'emergency'],
      });
    }, 1500);
  });
}

export function calculateLeaderboardRank(points: number, allUsers: User[]): number {
  const sortedUsers = allUsers.sort((a, b) => b.points - a.points);
  return sortedUsers.findIndex(user => user.points === points) + 1;
}

export function getHazardIcon(hazardType: HazardType): string {
  const icons = {
    tsunami: 'TSUNAMI',
    storm_surge: 'STORM SURGE',
    high_waves: 'HIGH WAVES',
    coastal_flooding: 'FLOODING',
    unusual_tides: 'TIDES',
    swell_surges: 'SWELL',
    oil_spill: 'OIL SPILL',
    marine_debris: 'DEBRIS',
    erosion: 'EROSION',
    pollution: 'POLLUTION',
  };
  return icons[hazardType] || 'HAZARD';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      // Return placeholder for non-image files
      resolve('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=300');
    }
  });
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function getOfflineQueue(): Upload[] {
  const queue = localStorage.getItem('offline_upload_queue');
  return queue ? JSON.parse(queue) : [];
}

export function addToOfflineQueue(upload: Upload): void {
  const queue = getOfflineQueue();
  queue.push(upload);
  localStorage.setItem('offline_upload_queue', JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
  localStorage.removeItem('offline_upload_queue');
}

export function processOfflineUploads(): Promise<void> {
  return new Promise((resolve) => {
    const queue = getOfflineQueue();
    // Mock processing - in real app, sync with server
    setTimeout(() => {
      clearOfflineQueue();
      resolve();
    }, 2000);
  });
}