import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  MessageCircle,
  AlertTriangle,
  Eye,
  FileText,
  X,
  Flag,
  Zap,
  Camera,
  Video,
  Shield
} from 'lucide-react';
import { Upload, VerificationStatus, HazardType } from '../../types';
import { formatTimeAgo, getHazardIcon, getSeverityColor, getStatusColor } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import toast from 'react-hot-toast';

const VerificationPanel: React.FC = () => {
  console.log('VerificationPanel: Component started loading');
  
  const { user } = useAuth();
  const { reports, updateReport } = useReports();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all' | 'flagged' | 'verified' | 'rejected'>('pending');
  const [verificationComment, setVerificationComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'verify' | 'reject' | null>(null);

  console.log('VerificationPanel: State initialized');

  useEffect(() => {
    console.log('VerificationPanel: useEffect triggered with reports:', reports);
    // Use reports from ReportsContext instead of mockUploads
    console.log('VerificationPanel: Reports from context:', reports);
    console.log('VerificationPanel: Number of reports:', reports.length);
    try {
      setUploads(Array.isArray(reports) ? reports : []);
      console.log('VerificationPanel: Successfully set uploads');
    } catch (error) {
      console.error('Error setting uploads:', error);
      setUploads([]);
    }
  }, [reports]);

    const filteredUploads = uploads.filter(upload => {
    if (!upload || !upload.verificationStatus) {
      return false;
    }
    
    switch (filter) {
      case 'pending': {
        return upload.verificationStatus === 'pending';
      }
      case 'verified':
        return upload.verificationStatus === 'verified';
      case 'flagged':
        return upload.verificationStatus === 'flagged';
      case 'rejected':
        return upload.verificationStatus === 'rejected';
      default:
        return true;
    }
  });
  
  console.log('VerificationPanel: Filter=', filter, 'Total uploads=', uploads.length, 'Filtered=', filteredUploads.length);
  console.log('VerificationPanel: Upload statuses:', uploads.map(u => u?.verificationStatus || 'unknown'));

  const stats = {
    pending: uploads.filter(u => u?.verificationStatus === 'pending').length,
    verified: uploads.filter(u => u?.verificationStatus === 'verified').length,
    flagged: uploads.filter(u => u?.verificationStatus === 'flagged').length,
    rejected: uploads.filter(u => u?.verificationStatus === 'rejected').length,
    highPriority: uploads.filter(u => u?.severity === 'severe' || u?.severity === 'critical').length,
  };

  const handleVerificationAction = (upload: Upload, action: 'verify' | 'reject') => {
    setSelectedUpload(upload);
    setVerificationAction(action);
    setShowVerificationModal(true);
  };

  const confirmVerification = async () => {
    if (!selectedUpload || !verificationAction) return;

    const newStatus: VerificationStatus = verificationAction === 'verify' ? 'verified' : 'rejected';
    
    // Update the report in the database via ReportsContext
    const updatedReport = {
      ...selectedUpload,
      verificationStatus: newStatus,
      verifiedBy: user?.name || 'Protector',
      verifiedAt: new Date(),
      flagReason: verificationAction === 'reject' ? rejectionReason : undefined,
      actionLog: [
        ...selectedUpload.actionLog,
        {
          id: Date.now().toString(),
          action: verificationAction === 'verify' ? 'Report Verified' : 'Report Rejected',
          performedBy: user?.name || 'Protector',
          timestamp: new Date(),
          details: verificationAction === 'verify' ? verificationComment : rejectionReason,
          previousStatus: selectedUpload.verificationStatus,
          newStatus: newStatus,
        }
      ]
    };

    try {
      // Update in database via ReportsContext
      await updateReport(selectedUpload.id, updatedReport);
      
      // Update local state
      setUploads(prev => prev.map(upload => {
        if (upload.id === selectedUpload.id) {
          return updatedReport;
        }
        return upload;
      }));

      toast.success(`Report ${verificationAction === 'verify' ? 'verified' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report. Please try again.');
    }

    setShowVerificationModal(false);
    setSelectedUpload(null);
    setVerificationComment('');
    setRejectionReason('');
    setVerificationAction(null);
  };

  const getFileTypeIcon = (type: string) => {
    if (type === 'photo') return Camera;
    if (type === 'video') return Video;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-sand-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-ocean-800 mb-4">Verification Center</h1>
          <p className="text-lg text-ocean-500">
            Review and verify community reports to ensure accurate information reaches those who need it
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-amber-500', filter: 'pending' },
            { title: 'Verified Reports', value: stats.verified, icon: CheckCircle, color: 'bg-emerald-600', filter: 'verified' },
            { title: 'Flagged Reports', value: stats.flagged, icon: Flag, color: 'bg-coral-500', filter: 'flagged' },
            { title: 'Rejected Reports', value: stats.rejected, icon: XCircle, color: 'bg-red-600', filter: 'rejected' },
            { title: 'High Priority', value: stats.highPriority, icon: AlertTriangle, color: 'bg-coral-600', filter: 'all' },
          ].map((stat, index) => (
            <motion.button
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setFilter(stat.filter as 'pending' | 'all' | 'flagged' | 'verified')}
              className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer ${
                filter === stat.filter ? 'ring-2 ring-blue-300' : ''
              }`}
            >
            >
              <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ocean-800">{stat.value}</h3>
              <p className="text-ocean-500 text-sm">{stat.title}</p>
            </motion.button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap bg-white rounded-xl p-1 shadow-sm mb-8 w-fit gap-1">
          {[
            { value: 'pending', label: `Pending (${stats.pending})`, color: 'text-amber-600' },
            { value: 'flagged', label: `Flagged (${stats.flagged})`, color: 'text-orange-600' },
            { value: 'verified', label: `Verified (${stats.verified})`, color: 'text-emerald-600' },
            { value: 'rejected', label: `Rejected (${stats.rejected})`, color: 'text-red-600' },
            { value: 'all', label: 'All Reports', color: 'text-ocean-500' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as 'pending' | 'all' | 'flagged' | 'verified' | 'rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === option.value
                  ? 'bg-ocean-600 text-white shadow-sm'
                  : `${option.color} hover:text-ocean-600`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        {filteredUploads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ocean-500 mb-2">
              {filter === 'pending' ? 'No Pending Reports' : 
               filter === 'verified' ? 'No Verified Reports' : 
               filter === 'flagged' ? 'No Flagged Reports' : 
               filter === 'rejected' ? 'No Rejected Reports' : 'No Reports Found'}
            </h3>
            <p className="text-ocean-400">
              {filter === 'pending' ? 'All reports have been processed. Great work!' : 
               filter === 'verified' ? 'No reports have been verified yet.' : 
               filter === 'flagged' ? 'No reports have been flagged.' : 
               filter === 'rejected' ? 'No reports have been rejected.' : 'No reports match the current filter.'}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">{filteredUploads.map((upload, index) => {
            console.log(`Rendering upload ${index}:`, { id: upload?.id, title: upload?.title, status: upload?.verificationStatus });
            if (!upload || !upload.id) {
              console.log(`Skipping upload ${index} - missing id:`, upload);
              return null;
            }
            const FileIcon = getFileTypeIcon(upload.type || 'report');
            return (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="elevated-card overflow-hidden hover:shadow-card-hover transition-all duration-300"
              >
                {/* Image Header */}
                <div className="relative h-48">
                  <img
                    src={upload.fileUrl || upload.thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkMzMS4xNzk3IDMyIDM3IDI2LjE3OTcgMzcgMTlDMzcgMTEuODIwMyAzMS4xNzk3IDYgMjQgNkMxNi44MjAzIDYgMTEgMTEuODIwMyAxMSAxOUMxMSAyNi4xNzk3IDE2LjgyMDMgMzIgMjQgMzJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Im0xNCAyNCAyIDIgNS01IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='}
                    alt={upload.title || 'Report'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Image failed to load for report ${upload.id}:`, upload.fileUrl);
                      console.error('Full upload object:', upload);
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkMzMS4xNzk3IDMyIDM3IDI2LjE3OTcgMzcgMTlDMzcgMTEuODIwMyAzMS4xNzk3IDYgMjQgNkMxNi44MjAzIDYgMTEgMTEuODIwMyAxMSAxOUMxMSAyNi4xNzk3IDE2LjgyMDMgMzIgMjQgMzJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Im0xNCAyNCAyIDIgNS01IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.verificationStatus || 'pending')}`}>
                      {(upload.verificationStatus || 'pending').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Severity Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-4 h-4 rounded-full ${getSeverityColor(upload.severity || 'mild')} border-2 border-white shadow-sm`}></div>
                  </div>
                  
                  {/* File Type */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg flex items-center space-x-1">
                      <FileIcon className="h-4 w-4" />
                      <span className="text-xs font-medium capitalize">{upload.type || 'report'}</span>
                    </div>
                  </div>
                  
                  {/* Community Engagement */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg flex items-center space-x-2 text-xs">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{upload.upvotes || 0}</span>
                      <MessageCircle className="h-3 w-3" />
                      <span>{upload.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-ocean-800 line-clamp-2">{upload.title || 'Untitled Report'}</h3>
                    <button
                      onClick={() => setSelectedUpload(upload)}
                      className="text-ocean-600 hover:text-ocean-700 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-ocean-500 text-sm mb-4 line-clamp-3">{upload.description || 'No description provided'}</p>

                  {/* Hazard Info */}
                  {upload.hazardType && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">{getHazardIcon(upload.hazardType as HazardType)}</span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {upload.hazardType.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        upload.severity === 'critical' ? 'bg-coral-50 text-coral-700' :
                        upload.severity === 'severe' ? 'bg-coral-50 text-coral-700' :
                        upload.severity === 'serious' ? 'bg-orange-100 text-orange-700' :
                        upload.severity === 'moderate' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {upload.severity || 'mild'}
                      </span>
                    </div>
                  )}

                  {/* Location & Time */}
                  <div className="flex items-center justify-between text-sm text-ocean-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{upload.location?.address || 'Location unavailable'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(upload.createdAt || new Date())}</span>
                    </div>
                  </div>                  {/* Reporter Info */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-sand-50 rounded-xl">
                    <img
                      src={upload.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100'}
                      alt={upload.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-ocean-800">{upload.userName}</h4>
                      <p className="text-sm text-ocean-500">Community Reporter</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-ocean-800">{upload.upvotes} votes</p>
                      <p className="text-xs text-ocean-400">{upload.views} views</p>
                    </div>
                  </div>

                  {/* AI Analysis Preview */}
                  {upload.aiAnalysis && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">AI Analysis</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-purple-600">Confidence:</span>
                          <span className="ml-1 font-bold">{(upload.aiAnalysis.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-purple-600">Urgency:</span>
                          <span className="ml-1 font-bold">{upload.aiAnalysis.urgencyScore}/100</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Actions */}
                  {upload.verificationStatus === 'pending' && (
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVerificationAction(upload, 'verify')}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Verify</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVerificationAction(upload, 'reject')}
                        className="flex-1 bg-coral-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </motion.button>
                    </div>
                  )}

                  {upload.verificationStatus === 'flagged' && (
                    <div className="space-y-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-orange-700 mb-1">
                          <Flag className="h-4 w-4" />
                          <span className="text-sm font-medium">Flagged for Review</span>
                        </div>
                        {upload.flagReason && (
                          <p className="text-sm text-orange-600">{upload.flagReason}</p>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleVerificationAction(upload, 'verify')}
                          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerificationAction(upload, 'reject')}
                          className="flex-1 bg-coral-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {upload.verificationStatus === 'verified' && (
                    <div className="space-y-2">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Verified by {upload.verifiedBy} {upload.verifiedAt && formatTimeAgo(upload.verifiedAt)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleVerificationAction(upload, 'reject')}
                        className="w-full flex items-center justify-center space-x-2 border-2 border-red-300 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject (Re-evaluate)</span>
                      </button>
                    </div>
                  )}

                  {upload.verificationStatus === 'rejected' && (
                    <div className="space-y-2">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-red-700 mb-1">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Rejected</span>
                        </div>
                        {upload.flagReason && (
                          <p className="text-sm text-red-500">{upload.flagReason}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleVerificationAction(upload, 'verify')}
                        className="w-full flex items-center justify-center space-x-2 border-2 border-emerald-300 text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200 text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Verify (Re-evaluate)</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        )}

        {/* Detailed Report Modal */}
        <AnimatePresence>
          {selectedUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedUpload(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="relative">
                  <img
                    src={selectedUpload.fileUrl}
                    alt={selectedUpload.title}
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={() => setSelectedUpload(null)}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">{selectedUpload.title}</h3>
                    <div className="flex items-center space-x-4 text-white text-sm">
                      <span className={`px-3 py-1 rounded-full ${getStatusColor(selectedUpload.verificationStatus)}`}>
                        {selectedUpload.verificationStatus}
                      </span>
                      <span className="capitalize">{selectedUpload.severity} severity</span>
                      <span>{selectedUpload.upvotes} community votes</span>
                      <span>{selectedUpload.views} views</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Report Details */}
                    <div>
                      <h4 className="text-xl font-bold text-ocean-800 mb-4">Report Details</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-ocean-800 mb-2">Description</h5>
                          <p className="text-ocean-700 bg-sand-50 p-4 rounded-xl">{selectedUpload.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-ocean-800 mb-2">Location</h5>
                            <p className="text-ocean-500 text-sm">{selectedUpload.location.address}</p>
                            <p className="text-xs text-ocean-400 mt-1">
                              GPS: {selectedUpload.location.lat.toFixed(4)}, {selectedUpload.location.lng.toFixed(4)}
                            </p>
                            <p className="text-xs text-ocean-400">Accuracy: ±{selectedUpload.location.accuracy}m</p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-ocean-800 mb-2">Reporter</h5>
                            <div className="flex items-center space-x-2">
                              <img
                                src={selectedUpload.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                                alt={selectedUpload.userName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium text-ocean-800">{selectedUpload.userName}</p>
                                <p className="text-xs text-ocean-400">Community Member</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Environmental Data */}
                        {selectedUpload.metadata && (
                          <div>
                            <h5 className="font-medium text-ocean-800 mb-2">Environmental Conditions</h5>
                            <div className="bg-ocean-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-ocean-600">Weather:</span>
                                <span className="font-medium">{selectedUpload.metadata.weather}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-ocean-600">Tide Level:</span>
                                <span className="font-medium">{selectedUpload.metadata.tideLevel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-ocean-600">Visibility:</span>
                                <span className="font-medium">{selectedUpload.metadata.visibility}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-ocean-600">Device:</span>
                                <span className="font-medium">{selectedUpload.metadata.deviceInfo}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Analysis & Actions */}
                    <div>
                      {/* AI Analysis */}
                      {selectedUpload.aiAnalysis && (
                        <div className="mb-6">
                          <h4 className="text-xl font-bold text-ocean-800 mb-4">AI Analysis</h4>
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  {(selectedUpload.aiAnalysis.confidence * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-purple-700">Confidence</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  {selectedUpload.aiAnalysis.urgencyScore}
                                </div>
                                <div className="text-sm text-purple-700">Urgency Score</div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-purple-600 text-sm font-medium">Detected Hazards:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedUpload.aiAnalysis.detectedHazards.map((hazard, index) => (
                                  <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                                    {getHazardIcon(hazard as HazardType)} {hazard.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-purple-600 text-sm font-medium">Keywords:</span>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {selectedUpload.aiAnalysis.keywords.map((keyword, index) => (
                                  <span key={index} className="bg-gray-100 text-ocean-700 px-2 py-1 rounded-full text-xs">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action History */}
                      <div className="mb-6">
                        <h4 className="text-xl font-bold text-ocean-800 mb-4">Action History</h4>
                        <div className="space-y-3">
                          {selectedUpload.actionLog.map((log) => (
                            <div key={log.id} className="flex items-start space-x-3 p-4 bg-sand-50 rounded-xl">
                              <div className={`w-3 h-3 rounded-full mt-2 ${
                                log.action.includes('Verified') ? 'bg-emerald-500' :
                                log.action.includes('Flagged') ? 'bg-orange-500' :
                                log.action.includes('Rejected') ? 'bg-coral-500' :
                                'bg-ocean-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="font-medium text-ocean-800">{log.action}</p>
                                <p className="text-sm text-ocean-500">by {log.performedBy}</p>
                                <p className="text-xs text-ocean-400">{formatTimeAgo(log.timestamp)}</p>
                                {log.details && <p className="text-sm text-ocean-500 mt-1">{log.details}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Community Comments */}
                      {selectedUpload.comments.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-ocean-800 mb-4">
                            Community Comments ({selectedUpload.comments.length})
                          </h4>
                          <div className="space-y-4 max-h-64 overflow-y-auto">
                            {selectedUpload.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start space-x-3 p-3 bg-sand-50 rounded-xl">
                                <img
                                  src={comment.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                                  alt={comment.userName}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-ocean-800 text-sm">{comment.userName}</span>
                                    {comment.isVerifier && (
                                      <span className="bg-ocean-100 text-ocean-700 px-2 py-1 rounded-full text-xs font-medium">
                                        Verifier
                                      </span>
                                    )}
                                    <span className="text-xs text-ocean-400">{formatTimeAgo(comment.createdAt)}</span>
                                  </div>
                                  <p className="text-ocean-700 text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Action Modal */}
        <AnimatePresence>
          {showVerificationModal && selectedUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowVerificationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full p-6"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    verificationAction === 'verify' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {verificationAction === 'verify' ? (
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-coral-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-800 mb-2">
                    {verificationAction === 'verify' ? 'Verify Report' : 'Reject Report'}
                  </h3>
                  <p className="text-ocean-500">
                    {verificationAction === 'verify' 
                      ? 'Confirm this report is accurate and helpful to the community'
                      : 'Explain why this report should be rejected'
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-sand-50 rounded-xl p-4">
                    <h4 className="font-medium text-ocean-800 mb-2">{selectedUpload.title}</h4>
                    <p className="text-sm text-ocean-500">{selectedUpload.description.substring(0, 150)}...</p>
                  </div>

                  {verificationAction === 'verify' ? (
                    <div>
                      <label className="block text-sm font-medium text-ocean-700 mb-2">
                        Verification Notes (Optional)
                      </label>
                      <textarea
                        value={verificationComment}
                        onChange={(e) => setVerificationComment(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        placeholder="Add any notes about this verification..."
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-ocean-700 mb-2">
                        Reason for Rejection *
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Explain why this report is being rejected..."
                        required
                      />
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowVerificationModal(false)}
                      className="flex-1 border-2 border-gray-200 text-ocean-700 py-3 rounded-xl font-medium hover:bg-sand-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmVerification}
                      disabled={verificationAction === 'reject' && !rejectionReason.trim()}
                      className={`flex-1 py-3 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 ${
                        verificationAction === 'verify'
                          ? 'bg-emerald-600 text-white hover:bg-green-700'
                          : 'bg-coral-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {verificationAction === 'verify' ? 'Confirm Verification' : 'Confirm Rejection'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerificationPanel;