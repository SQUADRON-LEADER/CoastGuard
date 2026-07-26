import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload as UploadIcon, 
  Camera, 
  FileText, 
  MapPin, 
  AlertTriangle,
  Image,
  X,
  CheckCircle
} from 'lucide-react';
import { HazardType, SeverityLevel } from '../../types';

const UploadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'photo' as 'photo' | 'document' | 'report',
    title: '',
    description: '',
    hazardType: '' as HazardType,
    severity: '' as SeverityLevel,
    location: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadTypes = [
    { value: 'photo', label: 'Photo Evidence', icon: Camera, color: 'bg-ocean-700' },
    { value: 'document', label: 'Document Report', icon: FileText, color: 'bg-emerald-600' },
    { value: 'report', label: 'Incident Report', icon: AlertTriangle, color: 'bg-coral-500' },
  ];

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami Warning', icon: '🌊' },
    { value: 'storm_surge', label: 'Storm Surge', icon: '⛈️' },
    { value: 'high_waves', label: 'High Waves', icon: '🌊' },
    { value: 'coastal_flooding', label: 'Coastal Flooding', icon: '💧' },
    { value: 'unusual_tides', label: 'Unusual Tides', icon: '📊' },
    { value: 'swell_surges', label: 'Swell Surges', icon: '〰️' },
  ];

  const severityLevels = [
    { value: 'mild', label: 'Mild Concern', color: 'bg-emerald-50 text-emerald-700' },
    { value: 'moderate', label: 'Notable Situation', color: 'bg-amber-50 text-amber-700' },
    { value: 'serious', label: 'Serious Concern', color: 'bg-orange-100 text-orange-700' },
    { value: 'severe', label: 'Severe Threat', color: 'bg-coral-50 text-coral-700' },
    { value: 'critical', label: 'Critical Alert', color: 'bg-red-200 text-red-800' },
  ];

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock upload process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        type: 'photo',
        title: '',
        description: '',
        hazardType: '' as HazardType,
        severity: '' as SeverityLevel,
        location: '',
      });
      setFiles([]);
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8 elevated-card text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-ocean-800 mb-4">Upload Successful! 🎉</h2>
          <p className="text-lg text-ocean-500 mb-6">
            Your report has been submitted and is now being reviewed by our community and protectors.
          </p>
          <p className="text-sm text-ocean-400">
            Thank you for keeping our community safe!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="elevated-card p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-ocean-800 mb-4">Upload & Report</h1>
            <p className="text-ocean-500">
              Share what you're seeing to help keep our coastal community safe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Type */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                What are you sharing?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {uploadTypes.map((type) => (
                  <motion.label
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 text-center
                      ${formData.type === type.value 
                        ? 'border-ocean-300 bg-ocean-50' 
                        : 'border-gray-200 hover:border-gray-200 hover:shadow-md'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className={`inline-flex p-4 rounded-2xl ${type.color} mb-4`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-ocean-800">{type.label}</h3>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                Upload Files
              </label>
              <div 
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-ocean-500 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-ocean-400">Photos, videos, or documents (Max 10MB each)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* File Preview */}
              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative bg-sand-50 rounded-xl p-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-coral-500 text-white rounded-full p-1 hover:bg-coral-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-ocean-500 truncate">{file.name}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                Give it a clear title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., High waves at Marina Beach"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                Describe what you're seeing
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us what's happening, when it started, and any other important details..."
                required
              />
            </div>

            {/* Hazard Type */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                Type of hazard
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hazardTypes.map((type) => (
                  <motion.label
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${formData.hazardType === type.value 
                        ? 'border-ocean-300 bg-ocean-50' 
                        : 'border-gray-200 hover:border-gray-200'
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
                    <span className="text-sm font-medium">{type.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                How serious is it?
              </label>
              <div className="space-y-2">
                {severityLevels.map((level) => (
                  <motion.label
                    key={level.value}
                    whileHover={{ scale: 1.01 }}
                    className={`
                      flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${formData.severity === level.value 
                        ? level.color + ' border-current' 
                        : 'border-gray-200 hover:border-gray-200'
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
                    <span className="font-medium">{level.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-medium text-ocean-700 mb-4">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200"
                  placeholder="Where is this happening? (e.g., Marine Drive, Mumbai)"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className="w-full bg-ocean-700 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UploadIcon className="h-5 w-5" />
                  <span>Submit for Verification</span>
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadForm;