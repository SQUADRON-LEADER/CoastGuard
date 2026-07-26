import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Map as MapIcon, 
  Layers, 
  Filter, 
  Eye, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Maximize2,
  Grid,
  List
} from 'lucide-react';
import { Upload, HazardType, UploadStatus } from '../../types';
import { formatTimeAgo, getSeverityColor, getStatusColor } from '../../lib/utils';

interface MapFilters {
  hazardType: HazardType | 'all';
  status: UploadStatus | 'all';
  timeRange: 'today' | 'week' | 'month' | 'all';
  severity: 'all' | 'low' | 'medium' | 'high' | 'critical';
}

const InteractiveMap: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');
  const [filters, setFilters] = useState<MapFilters>({
    hazardType: 'all',
    status: 'all',
    timeRange: 'week',
    severity: 'all',
  });
  const [showHeatmap, setShowHeatmap] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load from real API - legacy component (not used in main app)
  }, []);

  const filteredUploads = uploads.filter(upload => {
    if (filters.hazardType !== 'all' && upload.hazardType !== filters.hazardType) return false;
    if (filters.status !== 'all' && upload.status !== filters.status) return false;
    if (filters.severity !== 'all' && upload.severity !== filters.severity) return false;
    
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const uploadDate = new Date(upload.createdAt);
      const diffDays = (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
      
      switch (filters.timeRange) {
        case 'today': if (diffDays > 1) return false; break;
        case 'week': if (diffDays > 7) return false; break;
        case 'month': if (diffDays > 30) return false; break;
      }
    }
    
    return true;
  });

  const hazardTypeOptions = [
    { value: 'all', label: 'All Hazards', icon: '🌊' },
    { value: 'tsunami', label: 'Tsunami', icon: '🌊' },
    { value: 'storm_surge', label: 'Storm Surge', icon: '⛈️' },
    { value: 'high_waves', label: 'High Waves', icon: '🌊' },
    { value: 'coastal_flooding', label: 'Coastal Flooding', icon: '💧' },
    { value: 'oil_spill', label: 'Oil Spill', icon: '🛢️' },
    { value: 'marine_debris', label: 'Marine Debris', icon: '🗑️' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-gray-500' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'verified', label: 'Verified', color: 'bg-green-500' },
    { value: 'flagged', label: 'Flagged', color: 'bg-orange-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  ];

  const getHeatmapData = () => {
    const heatmapPoints = filteredUploads.map(upload => ({
      lat: upload.location.lat,
      lng: upload.location.lng,
      intensity: upload.severity === 'critical' ? 1 : 
                 upload.severity === 'high' ? 0.8 :
                 upload.severity === 'medium' ? 0.6 : 0.4,
      upload,
    }));
    return heatmapPoints;
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MapIcon className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Interactive Hazard Map</h2>
              <p className="text-blue-100">Real-time ocean hazard visualization</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-100">View Mode:</span>
            <div className="flex bg-white/20 rounded-lg p-1">
              {[
                { value: 'map', icon: MapIcon },
                { value: 'grid', icon: Grid },
                { value: 'list', icon: List },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value as any)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === mode.value ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <mode.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Hazard Type Filter */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Hazard Type</label>
            <select
              value={filters.hazardType}
              onChange={(e) => setFilters({ ...filters, hazardType: e.target.value as any })}
              className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white/50"
            >
              {hazardTypeOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-800">
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white/50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as any })}
              className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white/50"
            >
              <option value="today" className="text-gray-800">Today</option>
              <option value="week" className="text-gray-800">This Week</option>
              <option value="month" className="text-gray-800">This Month</option>
              <option value="all" className="text-gray-800">All Time</option>
            </select>
          </div>

          {/* Heatmap Toggle */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Display</label>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`w-full p-2 rounded-lg border border-white/30 transition-all duration-200 ${
                showHeatmap ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Layers className="h-4 w-4 inline mr-2" />
              Heatmap {showHeatmap ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {viewMode === 'map' && (
          <div className="h-96 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl relative overflow-hidden">
            {/* Mock Map Interface */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Interactive Map View</h3>
                <p className="text-gray-600 mb-4">
                  Showing {filteredUploads.length} reports with {showHeatmap ? 'heatmap overlay' : 'pin markers'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                  {filteredUploads.slice(0, 4).map((upload) => (
                    <motion.div
                      key={upload.id}
                      whileHover={{ scale: 1.1 }}
                      className={`w-4 h-4 rounded-full ${getSeverityColor(upload.severity)} cursor-pointer shadow-lg`}
                      onClick={() => setSelectedUpload(upload)}
                      title={upload.title}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Maximize2 className="h-4 w-4 text-gray-600" />
              </button>
              <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUploads.map((upload, index) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedUpload(upload)}
              >
                <div className="relative h-48">
                  <img
                    src={upload.fileUrl}
                    alt={upload.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                      {upload.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(upload.severity)}`}></div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg">
                      <p className="text-sm font-medium truncate">{upload.title}</p>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span>{upload.upvotes} votes</span>
                        <span>{formatTimeAgo(upload.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredUploads.map((upload, index) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedUpload(upload)}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={upload.thumbnailUrl || upload.fileUrl}
                    alt={upload.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{upload.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                          {upload.status}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(upload.severity)}`}></div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{upload.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{upload.location.address}</span>
                        </span>
                        <span>{formatTimeAgo(upload.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>{upload.upvotes} votes</span>
                        <span>{upload.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upload Detail Modal */}
        {selectedUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUpload(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <img
                  src={selectedUpload.fileUrl}
                  alt={selectedUpload.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedUpload(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-xl">
                    <h3 className="text-xl font-bold mb-2">{selectedUpload.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedUpload.status)}`}>
                        {selectedUpload.status}
                      </span>
                      <span className="capitalize">{selectedUpload.severity} severity</span>
                      <span>{selectedUpload.upvotes} votes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">{selectedUpload.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Location</h4>
                    <p className="text-sm text-gray-600">{selectedUpload.location.address}</p>
                    <p className="text-xs text-gray-500">
                      Accuracy: {selectedUpload.location.accuracy}m
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Reported By</h4>
                    <div className="flex items-center space-x-2">
                      <img
                        src={selectedUpload.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                        alt={selectedUpload.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-700">{selectedUpload.userName}</span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                {selectedUpload.aiAnalysis && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <h4 className="font-medium text-purple-800 mb-3">AI Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-600">Confidence:</span>
                        <span className="ml-2 font-medium">{(selectedUpload.aiAnalysis.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-purple-600">Urgency Score:</span>
                        <span className="ml-2 font-medium">{selectedUpload.aiAnalysis.urgencyScore}/100</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-purple-600 text-sm">Detected Hazards:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedUpload.aiAnalysis.detectedHazards.map((hazard, index) => (
                          <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            {hazard.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Log */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Action History</h4>
                  <div className="space-y-2">
                    {selectedUpload.actionLog.map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-gray-800">
                            <span className="font-medium">{log.action}</span> by {log.performedBy}
                          </p>
                          <p className="text-gray-500 text-xs">{formatTimeAgo(log.timestamp)}</p>
                          {log.details && <p className="text-gray-600 text-xs mt-1">{log.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                {selectedUpload.comments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Community Comments</h4>
                    <div className="space-y-3">
                      {selectedUpload.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <img
                            src={comment.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{comment.userName}</span>
                              {comment.isVerifier && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                  Verifier
                                </span>
                              )}
                              <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <h4 className="text-2xl font-bold text-blue-600">{filteredUploads.length}</h4>
            <p className="text-sm text-blue-700">Total Reports</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <h4 className="text-2xl font-bold text-green-600">
              {filteredUploads.filter(u => u.status === 'verified').length}
            </h4>
            <p className="text-sm text-green-700">Verified</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <h4 className="text-2xl font-bold text-yellow-600">
              {filteredUploads.filter(u => u.status === 'pending').length}
            </h4>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <h4 className="text-2xl font-bold text-red-600">
              {filteredUploads.filter(u => u.severity === 'critical' || u.severity === 'high').length}
            </h4>
            <p className="text-sm text-red-700">High Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;