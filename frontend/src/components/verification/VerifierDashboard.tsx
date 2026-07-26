import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  MessageSquare,
  Users,
  BarChart3,
  Calendar,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Bell,
  Zap,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Upload, VerificationStatus, HazardType, SeverityLevel } from '../../types';
import { formatTimeAgo, getSeverityColor, getStatusColor } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import toast from 'react-hot-toast';

interface VerificationFilters {
  status: VerificationStatus | 'all';
  hazardType: HazardType | 'all';
  severity: SeverityLevel | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
  location: string;
  priority: 'high' | 'medium' | 'low' | 'all';
}

const VerifierDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { reports, updateReport } = useReports();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<Upload[]>([]);
  const [selectedUploads, setSelectedUploads] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'location' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VerificationFilters>({
    status: 'pending',
    hazardType: 'all',
    severity: 'all',
    dateRange: 'week',
    location: '',
    priority: 'all',
  });
  const [bulkAction, setBulkAction] = useState<'verify' | 'reject' | null>(null);
  const [verificationComment, setVerificationComment] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  useEffect(() => {
    console.log('VerifierDashboard: Reports updated:', reports);
    setUploads(reports);
  }, [reports]);

  useEffect(() => {
    let filtered = uploads.filter(upload => {
      // Search filter
      if (searchQuery && !upload.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !upload.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !upload.location.address.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && upload.verificationStatus !== filters.status) return false;
      
      // Hazard type filter
      if (filters.hazardType !== 'all' && upload.hazardType !== filters.hazardType) return false;
      
      // Severity filter
      if (filters.severity !== 'all' && upload.severity !== filters.severity) return false;
      
      // Location filter
      if (filters.location && !upload.location.address.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      // Date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const uploadDate = new Date(upload.createdAt);
        const diffDays = (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (filters.dateRange) {
          case 'today': if (diffDays > 1) return false; break;
          case 'week': if (diffDays > 7) return false; break;
          case 'month': if (diffDays > 30) return false; break;
        }
      }
      
      // Priority filter
      if (filters.priority !== 'all') {
        const priority = upload.severity === 'critical' || upload.severity === 'severe' ? 'high' :
                        upload.severity === 'serious' ? 'medium' : 'low';
        if (priority !== filters.priority) return false;
      }
      
      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const getPriorityScore = (severity: SeverityLevel) => {
            switch (severity) {
              case 'critical': return 5;
              case 'severe': return 4;
              case 'serious': return 3;
              case 'moderate': return 2;
              default: return 1;
            }
          };
          comparison = getPriorityScore(a.severity!) - getPriorityScore(b.severity!);
          break;
        case 'location':
          comparison = a.location.address.localeCompare(b.location.address);
          break;
        case 'status':
          comparison = a.verificationStatus.localeCompare(b.verificationStatus);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredUploads(filtered);
  }, [uploads, searchQuery, filters, sortBy, sortOrder]);

  const handleSelectUpload = (uploadId: string) => {
    setSelectedUploads(prev => 
      prev.includes(uploadId) 
        ? prev.filter(id => id !== uploadId)
        : [...prev, uploadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUploads.length === filteredUploads.length) {
      setSelectedUploads([]);
    } else {
      setSelectedUploads(filteredUploads.map(upload => upload.id));
    }
  };

  const handleBulkAction = (action: 'verify' | 'reject') => {
    if (selectedUploads.length === 0) {
      toast.error('Please select reports to process');
      return;
    }
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const confirmBulkAction = () => {
    if (!bulkAction) return;

    const newStatus: VerificationStatus = bulkAction === 'verify' ? 'verified' : 'rejected';
    
    setUploads(prev => prev.map(upload => {
      if (selectedUploads.includes(upload.id)) {
        return {
          ...upload,
          verificationStatus: newStatus,
          verifiedBy: user?.name || 'Verifier',
          verifiedAt: new Date(),
          flagReason: bulkAction === 'reject' ? verificationComment : undefined,
          actionLog: [
            ...upload.actionLog,
            {
              id: Date.now().toString(),
              action: `Bulk ${bulkAction === 'verify' ? 'Verification' : 'Rejection'}`,
              performedBy: user?.name || 'Verifier',
              timestamp: new Date(),
              details: verificationComment || `Bulk ${bulkAction} action`,
              previousStatus: upload.verificationStatus,
              newStatus: newStatus,
            }
          ]
        };
      }
      return upload;
    }));

    toast.success(`${selectedUploads.length} reports ${bulkAction === 'verify' ? 'verified' : 'rejected'} successfully!`);
    setSelectedUploads([]);
    setShowBulkModal(false);
    setVerificationComment('');
    setBulkAction(null);
  };

  const toggleRowExpansion = (uploadId: string) => {
    setExpandedRows(prev => 
      prev.includes(uploadId) 
        ? prev.filter(id => id !== uploadId)
        : [...prev, uploadId]
    );
  };

  const exportData = () => {
    const csvContent = [
      ['ID', 'Title', 'Location', 'Severity', 'Status', 'Created', 'Verified By'].join(','),
      ...filteredUploads.map(upload => [
        upload.id,
        `"${upload.title}"`,
        `"${upload.location.address}"`,
        upload.severity,
        upload.verificationStatus,
        upload.createdAt.toISOString(),
        upload.verifiedBy || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verification-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const stats = {
    pending: uploads.filter(u => u.verificationStatus === 'pending').length,
    verified: uploads.filter(u => u.verificationStatus === 'verified').length,
    rejected: uploads.filter(u => u.verificationStatus === 'rejected').length,
    highPriority: uploads.filter(u => u.severity === 'critical' || u.severity === 'severe').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{t('verifier.title')}</h1>
                <p className="text-gray-600">{t('verifier.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportData}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>{t('verifier.export')}</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t('verifier.refresh')}</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { title: t('verifier.stats.pendingReview'), value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500', change: '+12%' },
              { title: t('verifier.stats.verifiedToday'), value: stats.verified, icon: CheckCircle, color: 'from-green-500 to-emerald-500', change: '+8%' },
              { title: t('verifier.stats.highPriority'), value: stats.highPriority, icon: AlertTriangle, color: 'from-red-500 to-pink-500', change: '+5%' },
              { title: t('verifier.stats.totalProcessed'), value: stats.verified + stats.rejected, icon: TrendingUp, color: 'from-blue-500 to-purple-500', change: '+15%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports, locations, descriptions..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-colors ${
                  showFilters ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              {selectedUploads.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedUploads.length} selected</span>
                  <button
                    onClick={() => handleBulkAction('verify')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Bulk Verify
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Bulk Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="flagged">Flagged</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    <select
                      value={filters.severity}
                      onChange={(e) => setFilters({ ...filters, severity: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Levels</option>
                      <option value="critical">Critical</option>
                      <option value="severe">Severe</option>
                      <option value="serious">Serious</option>
                      <option value="moderate">Moderate</option>
                      <option value="mild">Mild</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="Filter by location"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="date">Date</option>
                      <option value="priority">Priority</option>
                      <option value="location">Location</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verification Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Verification Queue ({filteredUploads.length} reports)
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUploads.length === filteredUploads.length && filteredUploads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUploads.map((upload, index) => (
                  <React.Fragment key={upload.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedUploads.includes(upload.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUploads.includes(upload.id)}
                          onChange={() => handleSelectUpload(upload.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={upload.thumbnailUrl || upload.fileUrl}
                            alt={upload.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">{upload.title}</h3>
                            <p className="text-sm text-gray-600">by {upload.userName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{upload.location.address.split(',')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          upload.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          upload.severity === 'severe' ? 'bg-red-100 text-red-700' :
                          upload.severity === 'serious' ? 'bg-orange-100 text-orange-700' :
                          upload.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {upload.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.verificationStatus)}`}>
                          {upload.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTimeAgo(upload.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleRowExpansion(upload.id)}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {upload.verificationStatus === 'pending' && (
                            <>
                              <button className="p-1 text-green-600 hover:text-green-700 transition-colors">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    
                    {/* Expanded Row Details */}
                    <AnimatePresence>
                      {expandedRows.includes(upload.id) && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-800 mb-3">Report Details</h4>
                                <p className="text-gray-700 mb-4">{upload.description}</p>
                                
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Community Votes:</span>
                                    <span className="font-medium">{upload.upvotes} upvotes, {upload.downvotes} downvotes</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Views:</span>
                                    <span className="font-medium">{upload.views}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">GPS Accuracy:</span>
                                    <span className="font-medium">±{upload.location.accuracy}m</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                {upload.aiAnalysis && (
                                  <div className="mb-4">
                                    <h4 className="font-medium text-gray-800 mb-3">AI Analysis</h4>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                        <div>
                                          <span className="text-purple-600">Confidence:</span>
                                          <span className="ml-2 font-bold">{(upload.aiAnalysis.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                        <div>
                                          <span className="text-purple-600">Urgency:</span>
                                          <span className="ml-2 font-bold">{upload.aiAnalysis.urgencyScore}/100</span>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {upload.aiAnalysis.keywords.map((keyword, i) => (
                                          <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                            {keyword}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex space-x-3">
                                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                    Verify Report
                                  </button>
                                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                    Reject Report
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Action Modal */}
        <AnimatePresence>
          {showBulkModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Bulk {bulkAction === 'verify' ? 'Verification' : 'Rejection'}
                </h3>
                <p className="text-gray-600 mb-4">
                  You are about to {bulkAction} {selectedUploads.length} reports. This action cannot be undone.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {bulkAction === 'verify' ? 'Verification Notes (Optional)' : 'Rejection Reason (Required)'}
                  </label>
                  <textarea
                    value={verificationComment}
                    onChange={(e) => setVerificationComment(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={bulkAction === 'verify' ? 'Add verification notes...' : 'Explain why these reports are being rejected...'}
                    required={bulkAction === 'reject'}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBulkAction}
                    disabled={bulkAction === 'reject' && !verificationComment.trim()}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                      bulkAction === 'verify'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Confirm {bulkAction === 'verify' ? 'Verification' : 'Rejection'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifierDashboard;