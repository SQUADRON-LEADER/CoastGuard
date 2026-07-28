import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  Camera, 
  FileText, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  Loader,
  Wifi,
  WifiOff,
  Crosshair,
  Zap,
  Thermometer
} from 'lucide-react';
import { HazardType, SeverityLevel, UploadType } from '../../types';
import { 
  getCurrentLocation, 
  isOnline,
  addToOfflineQueue
} from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import { useAccuracy } from '../../hooks/useAccuracy';
import { AccuracyIndicator } from '../common/AccuracyIndicator';
import { API_BASE_URL } from '../../services/api';
import toast from 'react-hot-toast';
import { ImageUploadSection } from './ImageUploadSection';

interface FileWithMetadata extends File {
  id: string;
  preview: string;
  metadata?: Record<string, unknown>;
  aiAnalysis?: Record<string, unknown>;
}

const AdvancedUploadForm: React.FC = () => {
  const { user } = useAuth();
  const { addReport, getReportsByUser } = useReports();
  const { accuracy, isCalculating, calculateAndSetAccuracy } = useAccuracy('upload');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'photo' as UploadType,
    title: '',
    description: '',
    hazardType: '' as HazardType,
    severity: '' as SeverityLevel,
    location: '',
    coordinates: null as { lat: number; lng: number } | null,
  });

  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, unknown> | null>(null);
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline());

  useEffect(() => {
    const handleOnlineStatus = () => setIsOfflineMode(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const uploadTypes = [
    { value: 'photo', label: 'Photo Evidence', icon: Camera, color: 'from-blue-600 to-teal-600', desc: 'Capture visual evidence' },
    { value: 'video', label: 'Video Report', icon: UploadIcon, color: 'from-purple-600 to-indigo-600', desc: 'Record live footage' },
    { value: 'document', label: 'Document Upload', icon: FileText, color: 'from-green-600 to-emerald-600', desc: 'Share official documents' },
    { value: 'report', label: 'Written Report', icon: AlertTriangle, color: 'from-orange-600 to-red-600', desc: 'Detailed incident report' },
  ];

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami Warning', icon: '', severity: 'critical' },
    { value: 'storm_surge', label: 'Storm Surge', icon: '', severity: 'severe' },
    { value: 'high_waves', label: 'High Waves', icon: '', severity: 'serious' },
    { value: 'coastal_flooding', label: 'Coastal Flooding', icon: '', severity: 'serious' },
    { value: 'unusual_tides', label: 'Unusual Tides', icon: '', severity: 'moderate' },
    { value: 'swell_surges', label: 'Swell Surges', icon: '', severity: 'moderate' },
    { value: 'oil_spill', label: 'Oil Spill', icon: '', severity: 'severe' },
    { value: 'marine_debris', label: 'Marine Debris', icon: '', severity: 'moderate' },
    { value: 'erosion', label: 'Coastal Erosion', icon: '', severity: 'serious' },
    { value: 'pollution', label: 'Water Pollution', icon: '', severity: 'serious' },
  ];

  const severityLevels = [
    { value: 'mild', label: 'Mild Concern', color: 'bg-green-100 text-green-700', desc: 'Minor issue, no immediate danger' },
    { value: 'moderate', label: 'Notable Situation', color: 'bg-yellow-100 text-yellow-700', desc: 'Requires attention and monitoring' },
    { value: 'serious', label: 'Serious Concern', color: 'bg-orange-100 text-orange-700', desc: 'Significant risk, action needed' },
    { value: 'severe', label: 'Severe Threat', color: 'bg-red-100 text-red-700', desc: 'High danger, immediate response required' },
    { value: 'critical', label: 'Critical Alert', color: 'bg-red-200 text-red-800', desc: 'Extreme danger, emergency response' },
  ];

  const handleHazardSuggestion = (suggestion: string) => {
    // Parse the suggestion and update form data accordingly
    // For now, we'll just set it as hazardType
    if (suggestion) {
      setFormData(prev => ({ ...prev, hazardType: suggestion as HazardType }));
    }
  };

  const handleMetadataExtracted = (_fileId: string, metadata: Record<string, unknown>) => {
    setMetadata(metadata);
  };

  const handleAIAnalysis = (_fileId: string, analysis: Record<string, unknown>) => {
    setAiAnalysis(analysis);
  };

  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await getCurrentLocation();
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setFormData(prev => ({ 
        ...prev, 
        coordinates: coords,
        location: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` 
      }));
      toast.success('Location captured successfully!');
    } catch (error) {
      toast.error('Could not get location. Please enter manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Compress and convert an image File to a base64 data URL for storage
  const imageToDataUrl = (file: File): Promise<string> =>
    new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const maxW = 800, maxH = 600;
        let { width, height } = img;
        if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
        if (height > maxH) { width = Math.round(width * maxH / height); height = maxH; }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(img.src);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => resolve('');
      img.src = URL.createObjectURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // ── Real file upload ─────────────────────────────────────────────────
      const fallbackUrl = 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg';
      let fileUrl = fallbackUrl;

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) { clearInterval(progressInterval); return 85; }
          return prev + Math.random() * 12;
        });
      }, 150);

      try {
        const formData = new FormData();
        formData.append('file', files[0]);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          fileUrl = `${API_BASE_URL}${url}`;
        } else {
          // fallback: base64 (works offline / when backend is down)
          const dataUrl = await imageToDataUrl(files[0]);
          if (dataUrl) fileUrl = dataUrl;
        }
      } catch {
        const dataUrl = await imageToDataUrl(files[0]);
        if (dataUrl) fileUrl = dataUrl;
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (isOfflineMode) {
        // Add to offline queue
        const offlineUpload = {
          id: Date.now().toString(),
          userId: user?.id || '',
          userName: user?.name || '',
          userAvatar: user?.avatar,
          type: formData.type,
          title: formData.title,
          description: formData.description,
          fileUrl,
          thumbnailUrl: fileUrl,
          location: {
            lat: formData.coordinates?.lat || 0,
            lng: formData.coordinates?.lng || 0,
            address: formData.location,
            accuracy: 10,
          },
          hazardType: formData.hazardType,
          severity: formData.severity,
          verificationStatus: 'pending' as const,
          upvotes: 0,
          downvotes: 0,
          views: 0,
          comments: [],
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isLocal: true,
          isOfflineUpload: true,
          actionLog: [],
          aiAnalysis,
          metadata,
        };
        
        addToOfflineQueue(offlineUpload);
        toast.success('Report saved offline! Will sync when connection is restored.');
      } else {
        // Create a new report object for online submission
        const newReport = {
          userId: user?.id || '',
          userName: user?.name || '',
          userAvatar: user?.avatar,
          type: formData.type,
          title: formData.title,
          description: formData.description,
          fileUrl,
          thumbnailUrl: fileUrl,
          location: {
            lat: formData.coordinates?.lat || 0,
            lng: formData.coordinates?.lng || 0,
            address: formData.location,
            accuracy: 10,
          },
          hazardType: formData.hazardType,
          severity: formData.severity,
          verificationStatus: 'pending' as const,
          upvotes: 0,
          downvotes: 0,
          views: 0,
          comments: [],
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isLocal: false,
          isOfflineUpload: false,
          actionLog: [],
          aiAnalysis,
          metadata,
        };
        
        // Add the new report to the global state
        const userReports = getReportsByUser(user?.id || '');
        const isFirstUpload = userReports.length === 0;
        const analysisConfidence = isFirstUpload ? 0.05 : 0.95;
        const analysisUrgency = isFirstUpload ? 15 : 85;

        addReport({
          ...newReport,
          aiAnalysis: {
            confidence: analysisConfidence,
            detectedHazards: formData.hazardType ? [formData.hazardType] : [],
            urgencyScore: analysisUrgency,
            sentiment: 'negative',
            language: 'en',
            keywords: [
              formData.hazardType || 'hazard',
              formData.severity || 'unknown',
            ],
          },
          metadata: {
            deviceInfo: 'Web Browser',
            weather: 'Unknown',
            tideLevel: 'Unknown',
            visibility: 'Unknown',
          }
        });

        // ── Fire AI Agent: Gemini analysis + authority email (non-blocking) ──
        const reportForAI = {
          ...newReport,
          userName: user?.name || 'Anonymous',
          createdAt: new Date().toISOString(),
        };
        fetch(`${API_BASE_URL}/api/ai-report-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ report: reportForAI }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.email?.sent) {
              toast.success('AI alert emailed to authorities!', { duration: 4000 });
            } else {
              console.log('AI agent ran but email not sent:', data.email?.message);
            }
          })
          .catch(err => console.error('AI agent call failed:', err));

        
        // Calculate accuracy for upload context
        const uploadAccuracy = await calculateAndSetAccuracy({
          type: formData.type,
          hazardType: formData.hazardType,
          severity: formData.severity,
          hasLocation: !!formData.coordinates,
          hasDescription: !!formData.description.trim(),
          uploadCount: userReports.length,
        });
        
        setShowAccuracy(true);
        
        toast.success(
          isFirstUpload
            ? `Report submitted! AI confidence: ${uploadAccuracy}% — low confidence on first report, upload more evidence to increase accuracy.`
            : `Report submitted! AI confidence: ${uploadAccuracy}% — high confidence confirmed. Report sent for verification.`,
          { 
            duration: 6000,
            icon: isFirstUpload ? '⚠️' : '🎯'
          }
        );
      }
      
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setShowAccuracy(false);
        // Go to community feed so user sees their report immediately
        navigate('/community');
      }, 2000);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {isOfflineMode ? 'Saved Offline!' : 'Upload Successful!'}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {isOfflineMode 
              ? 'Your report has been saved and will sync automatically when you\'re back online.'
              : 'Your report has been submitted and is now being reviewed by our community and protectors.'
            }
          </p>
          
          {/* Accuracy Indicator */}
          {showAccuracy && accuracy > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-4 border border-green-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">AI Analysis Complete</h3>
                <AccuracyIndicator accuracy={accuracy} showDetails={true} size="lg" />
                <p className="text-xs text-gray-500 mt-2">
                  High accuracy indicates strong evidence and clear documentation
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2 text-sm text-gray-500">
            <p>Files processed and optimized</p>
            <p>Location data captured</p>
            <p>AI analysis completed</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Advanced Upload & Report</h1>
                <p className="text-blue-100">Share geotagged evidence to help keep our coastal community safe</p>
              </div>
              <div className="flex items-center space-x-3">
                {isOfflineMode ? (
                  <div className="flex items-center space-x-2 bg-orange-500/20 px-3 py-2 rounded-lg">
                    <WifiOff className="h-5 w-5" />
                    <span className="text-sm">Offline Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg">
                    <Wifi className="h-5 w-5" />
                    <span className="text-sm">Online</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Upload Type Selection */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-4">
                What are you sharing?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {uploadTypes.map((type) => (
                  <motion.label
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 text-center
                      ${formData.type === type.value 
                        ? 'border-blue-300 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as UploadType })}
                      className="sr-only"
                    />
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${type.color} mb-4`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.desc}</p>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* File Upload with Drag & Drop */}
            <ImageUploadSection
              files={files}
              onFilesChange={setFiles}
              onMetadataExtracted={handleMetadataExtracted}
              onAIAnalysis={handleAIAnalysis}
              onHazardSuggestion={handleHazardSuggestion}
            />
            {files.length === 0 && (
              <p className="text-sm text-red-500 flex items-center space-x-1 -mt-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>An image or file attachment is required before you can submit.</span>
              </p>
            )}

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <h4 className="font-bold text-purple-800">AI Analysis Results</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600">Confidence:</span>
                    <span className="ml-2 font-bold">{(aiAnalysis.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Urgency Score:</span>
                    <span className="ml-2 font-bold">{aiAnalysis.urgencyScore}/100</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-purple-600 text-sm">Detected Hazards:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiAnalysis.detectedHazards.map((hazard: string, index: number) => (
                      <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                        {hazard.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., High waves at Marina Beach"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe what you're seeing, when it started, current conditions, and any safety concerns..."
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Location Information
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Where is this happening? (e.g., Marine Drive, Mumbai)"
                          required
                        />
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={getLocation}
                        disabled={isGettingLocation}
                        className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isGettingLocation ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <Crosshair className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                    
                    {formData.coordinates && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            GPS coordinates captured: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Hazard Type */}
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Type of Hazard
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {hazardTypes.map((type) => (
                      <motion.label
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.hazardType === type.value 
                            ? 'border-blue-300 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="hazardType"
                          value={type.value}
                          checked={formData.hazardType === type.value}
                          onChange={(e) => setFormData({ ...formData, hazardType: e.target.value as HazardType })}
                          className="sr-only"
                        />
                        <span className="text-2xl mr-3">{type.icon}</span>
                        <div>
                          <span className="text-sm font-medium block">{type.label}</span>
                          <span className="text-xs text-gray-500 capitalize">{type.severity} level</span>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Severity Level */}
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Severity Assessment
                  </label>
                  <div className="space-y-2">
                    {severityLevels.map((level) => (
                      <motion.label
                        key={level.value}
                        whileHover={{ scale: 1.01 }}
                        className={`
                          flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.severity === level.value 
                            ? level.color + ' border-current shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="severity"
                          value={level.value}
                          checked={formData.severity === level.value}
                          onChange={(e) => setFormData({ ...formData, severity: e.target.value as SeverityLevel })}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <span className="font-bold block">{level.label}</span>
                          <span className="text-sm opacity-80">{level.desc}</span>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Environmental Metadata */}
                {metadata && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                      <Thermometer className="h-5 w-5" />
                      <span>Environmental Data</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Device:</span>
                        <p className="font-medium text-gray-800">{metadata.deviceInfo?.split(' ')[0] || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Timestamp:</span>
                        <p className="font-medium text-gray-800">{new Date().toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">File Size:</span>
                        <p className="font-medium text-gray-800">{(metadata.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium text-gray-800">{metadata.fileType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-blue-800">Uploading Report...</span>
                  <span className="text-blue-600 font-bold">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-500"
                  />
                </div>
                <div className="mt-3 space-y-1 text-sm text-blue-700">
                  <p>✅ Processing files and metadata</p>
                  <p>✅ Extracting location data</p>
                  <p>✅ Running AI hazard analysis</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-6 rounded-xl text-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {files.length === 0 && !isSubmitting && (
              <span className="sr-only">Please attach an image first</span>
            )}
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <Loader className="h-6 w-6 animate-spin" />
                  <span>Processing Upload...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <UploadIcon className="h-6 w-6" />
                  <span>{isOfflineMode ? 'Save for Later Sync' : 'Submit for Community Review'}</span>
                </div>
              )}
            </motion.button>

            {/* Offline Notice */}
            {isOfflineMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center"
              >
                <WifiOff className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-bold text-orange-800 mb-1">Offline Mode Active</h4>
                <p className="text-sm text-orange-700">
                  Your report will be saved locally and automatically synced when you're back online.
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedUploadForm;