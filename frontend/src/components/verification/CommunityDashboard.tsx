import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Eye,
  Heart,
  Share2,
  Flag,
  Filter,
  Search,
  TrendingUp,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { Upload, Comment } from '../../types';
import { formatTimeAgo, getHazardIcon } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import { ReportAccuracyDisplay } from '../common/ReportAccuracyDisplay';
import toast from 'react-hot-toast';

interface CommunityValidation {
  id: string;
  uploadId: string;
  userId: string;
  userName: string;
  validationType: 'accuracy' | 'relevance' | 'safety' | 'completeness';
  score: number; // 1-5 stars
  comment: string;
  timestamp: Date;
  helpful: number;
}

const CommunityDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports, updateReport } = useReports();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [validations, setValidations] = useState<CommunityValidation[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationForm, setValidationForm] = useState({
    accuracy: 0,
    relevance: 0,
    safety: 0,
    completeness: 0,
    comment: '',
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated' | 'assigned'>('assigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [discussionMode, setDiscussionMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Upload | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    // Show all real reports to community validators
    const communityUploads = reports.filter(upload =>
      upload.verificationStatus === 'pending' ||
      upload.verificationStatus === 'verified' ||
      (upload.upvotes ?? 0) >= 5
    );
    setUploads(communityUploads);
    
    // Mock validation data
    setValidations([
      {
        id: '1',
        uploadId: '1',
        userId: user?.id || '',
        userName: user?.name || '',
        validationType: 'accuracy',
        score: 4,
        comment: 'Location and timing seem accurate based on local conditions',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        helpful: 3,
      },
      {
        id: '2',
        uploadId: '2',
        userId: user?.id || '',
        userName: user?.name || '',
        validationType: 'safety',
        score: 5,
        comment: 'Critical safety information - immediate action needed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        helpful: 7,
      },
    ]);
  }, [user, reports]);

  const filteredUploads = uploads.filter(upload => {
    if (searchQuery && !upload.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !upload.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    switch (filter) {
      case 'pending': return upload.verificationStatus === 'pending';
      case 'validated': return upload.verificationStatus === 'verified';
      case 'assigned': return upload.upvotes >= 3; // Community interest threshold
      default: return true;
    }
  });

  const handleVote = (uploadId: string, voteType: 'up' | 'down') => {
    const currentVote = userVotes[uploadId];
    
    if (currentVote === voteType) {
      toast.error(`You have already ${voteType === 'up' ? 'upvoted' : 'downvoted'} this report`);
      return;
    }
    
    setUploads(prev => prev.map(upload => {
      if (upload.id === uploadId) {
        let newUpvotes = upload.upvotes;
        let newDownvotes = upload.downvotes;
        
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;
        
        if (voteType === 'up') newUpvotes++;
        if (voteType === 'down') newDownvotes++;
        
        return { ...upload, upvotes: newUpvotes, downvotes: newDownvotes };
      }
      return upload;
    }));
    
    setUserVotes(prev => ({ ...prev, [uploadId]: voteType }));
    toast.success(`Vote recorded! +2 community points`);
  };

  const openValidationModal = (upload: Upload) => {
    setSelectedUpload(upload);
    setShowValidationModal(true);
  };

  const submitValidation = async () => {
    if (!selectedUpload) return;
    
    const avgScore = (validationForm.accuracy + validationForm.relevance + 
                     validationForm.safety + validationForm.completeness) / 4;
    
    const newValidation: CommunityValidation = {
      id: Date.now().toString(),
      uploadId: selectedUpload.id,
      userId: user?.id || '',
      userName: user?.name || '',
      validationType: 'accuracy', // Primary validation type
      score: avgScore,
      comment: validationForm.comment,
      timestamp: new Date(),
      helpful: 0,
    };
    
    setValidations(prev => [...prev, newValidation]);

    // Mark the report as verified and update local state so it moves to the validated tab
    const updatedFields = {
      verificationStatus: 'verified' as const,
      verifiedBy: user?.name || 'Community',
      verifiedAt: new Date(),
    };

    setUploads(prev =>
      prev.map(upload =>
        upload.id === selectedUpload.id ? { ...upload, ...updatedFields } : upload
      )
    );

    try {
      await updateReport(selectedUpload.id, updatedFields);
    } catch (error) {
      console.error('Failed to persist validation status:', error);
    }

    setShowValidationModal(false);
    setSelectedUpload(null);
    setValidationForm({ accuracy: 0, relevance: 0, safety: 0, completeness: 0, comment: '' });
    
    toast.success('Validation submitted! Report marked as verified (+10 community points)');
  };

  const openRejectModal = (upload: Upload) => {
    setRejectTarget(upload);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!rejectTarget || !rejectionReason.trim()) return;
    setIsRejecting(true);
    const updatedFields = {
      verificationStatus: 'rejected' as const,
      verifiedBy: user?.name || 'Community',
      verifiedAt: new Date(),
      flagReason: rejectionReason,
    };
    setUploads(prev =>
      prev.map(u => u.id === rejectTarget.id ? { ...u, ...updatedFields } : u)
    );
    try {
      await updateReport(rejectTarget.id, updatedFields);
    } catch (err) {
      console.error('Failed to persist rejection:', err);
    }
    setIsRejecting(false);
    setShowRejectModal(false);
    setRejectTarget(null);
    setRejectionReason('');
    toast.success('Report rejected and flagged for review.');
  };

  const addComment = (uploadId: string) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || '',
      userAvatar: user?.avatar,
      content: newComment,
      createdAt: new Date(),
      isVerifier: false,
      language: 'en',
    };
    
    setUploads(prev => prev.map(upload => {
      if (upload.id === uploadId) {
        return { ...upload, comments: [...upload.comments, comment] };
      }
      return upload;
    }));
    
    setNewComment('');
    toast.success('Comment added! (+3 community points)');
  };

  const StarRating: React.FC<{ value: number; onChange: (value: number) => void; readonly?: boolean }> = ({ 
    value, onChange, readonly = false 
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star 
            className={`h-5 w-5 ${star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        </button>
      ))}
    </div>
  );

  const userStats = {
    validationsCompleted: validations.filter(v => v.userId === user?.id).length,
    helpfulVotes: validations.filter(v => v.userId === user?.id).reduce((sum, v) => sum + v.helpful, 0),
    communityRank: 12, // Mock rank
    pointsEarned: 245, // Mock points
  };

  const statAccents: Record<string, string> = {
    'Validations Completed': '#059669',
    'Helpful Votes Received': '#3B9EFF',
    'Community Rank': '#8B5CF6',
    'Points Earned': '#F59E0B',
  };

  return (
    <div className="dashboard-bg" style={{ padding: '24px 24px 48px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Video */}
      <video
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* ── HERO BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="dash-hero"
          style={{ marginBottom: '24px' }}
        >
          <div className="dash-hero-grid" />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '16px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <Users size={26} color="white" />
              </div>
              <div>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.03em' }}>
                  Community Validation Dashboard
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.84rem', margin: '4px 0 0' }}>
                  Help verify and validate community reports — earn points for every contribution
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 16px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="live-dot" />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 500 }}>Community active</span>
              </div>
              <button
                onClick={() => setDiscussionMode(!discussionMode)}
                style={{
                  padding: '8px 18px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                  background: discussionMode ? 'rgba(59,158,255,0.85)' : 'rgba(255,255,255,0.12)',
                  color: 'white', fontSize: '0.78rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <MessageSquare size={13} />
                <span>Discussion Mode</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
          {[
            { title: 'Validations Completed', value: userStats.validationsCompleted, icon: CheckCircle },
            { title: 'Helpful Votes Received', value: userStats.helpfulVotes, icon: ThumbsUp },
            { title: 'Community Rank', value: `#${userStats.communityRank}`, icon: Award },
            { title: 'Points Earned', value: userStats.pointsEarned, icon: Star },
          ].map((stat, index) => {
            const accent = statAccents[stat.title] || '#3B9EFF';
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="premium-stat"
                style={{ '--stat-color': `${accent}22` } as React.CSSProperties}
              >
                <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', marginBottom: '12px', background: `${accent}18` }}>
                  <stat.icon size={20} color={accent} />
                </div>
                <div style={{
                  fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.04em',
                  background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  marginBottom: '4px',
                }}>{stat.value}</div>
                <p style={{ color: '#8D9AB0', fontSize: '0.78rem', fontWeight: 500, margin: 0 }}>{stat.title}</p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', borderRadius: '0 0 16px 16px', background: `linear-gradient(90deg, ${accent}, ${accent}44)`, opacity: 0.7 }} />
              </motion.div>
            );
          })}
        </div>

        {/* ── SEARCH AND FILTERS ── */}
        <div className="premium-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ flex: 1, maxWidth: 400 }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8D9AB0', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community reports..."
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px 14px 10px 36px',
                    background: '#F8FAFD', border: '1.5px solid rgba(10,37,64,0.1)',
                    borderRadius: '12px', fontSize: '0.875rem', color: '#061829', outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#3B9EFF'; e.target.style.boxShadow = '0 0 0 3px rgba(59,158,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(10,37,64,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', background: '#F8FAFD', borderRadius: '12px', padding: '4px', border: '1px solid rgba(10,37,64,0.08)', gap: '2px' }}>
              {[
                { value: 'assigned', label: 'Assigned to Me' },
                { value: 'pending', label: 'Pending' },
                { value: 'validated', label: 'Validated' },
                { value: 'all', label: 'All Reports' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  style={{
                    padding: '7px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s',
                    background: filter === option.value ? 'linear-gradient(135deg, #0A2540, #1565C0)' : 'transparent',
                    color: filter === option.value ? 'white' : '#5A6A84',
                    boxShadow: filter === option.value ? '0 2px 8px rgba(10,37,64,0.2)' : 'none',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Community Validation Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredUploads.map((upload, index) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="elevated-card overflow-hidden"
            >
              {/* Image Header */}
              <div className="relative h-48">
                <img
                  src={upload.fileUrl || upload.thumbnailUrl || ''}
                  alt={upload.title}
                  className="w-full h-full object-cover bg-gradient-to-br from-ocean-100 to-teal-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-img')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-img w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100';
                      fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-ocean-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 22V12h6v10"/></svg><span class="text-xs text-ocean-400 font-medium">No image attached</span>`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    upload.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                    upload.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700' :
                    upload.verificationStatus === 'rejected' ? 'bg-red-50 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {upload.verificationStatus}
                  </span>
                  {upload.upvotes >= 10 && (
                    <span className="bg-ocean-50 text-ocean-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      High Interest
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg flex items-center space-x-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>{upload.views}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-bold text-ocean-800 line-clamp-2">{upload.title}</h3>
                  <div className="flex items-center space-x-2 ml-3 shrink-0">
                    {upload.verificationStatus !== 'rejected' && (
                      <button
                        onClick={() => openValidationModal(upload)}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>{upload.verificationStatus === 'verified' ? 'Re-evaluate' : 'Validate'}</span>
                      </button>
                    )}
                    {upload.verificationStatus !== 'rejected' && (
                      <button
                        onClick={() => openRejectModal(upload)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                    {upload.verificationStatus === 'rejected' && (
                      <button
                        onClick={() => openValidationModal(upload)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Re-evaluate</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-ocean-500 text-sm mb-4 line-clamp-3">{upload.description}</p>

                {/* AI Accuracy Analysis */}
                <ReportAccuracyDisplay 
                  reportId={upload.id}
                  context="view"
                  reportData={{
                    hazardType: upload.hazardType,
                    severity: upload.severity,
                    hasLocation: !!upload.location,
                    hasDescription: !!upload.description,
                  }}
                  showOnClick={true}
                />

                {/* Hazard Info */}
                {upload.hazardType && (
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{getHazardIcon(upload.hazardType)}</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {upload.hazardType.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      upload.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      upload.severity === 'severe' ? 'bg-red-100 text-red-700' :
                      upload.severity === 'serious' ? 'bg-orange-100 text-orange-700' :
                      upload.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {upload.severity}
                    </span>
                  </div>
                )}

                {/* Location & Reporter */}
                <div className="flex items-center justify-between text-xs text-ocean-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{upload.location.address.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={upload.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                      alt={upload.userName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{upload.userName}</span>
                  </div>
                </div>

                {/* Community Validation Summary */}
                <div className="bg-sand-50 rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-ocean-800 text-xs mb-2">Community Validation</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-ocean-500">Accuracy:</span>
                      <div className="flex items-center space-x-2">
                        <StarRating value={4} onChange={() => {}} readonly />
                        <span className="text-ocean-400">(12 votes)</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-ocean-500">Relevance:</span>
                      <div className="flex items-center space-x-2">
                        <StarRating value={5} onChange={() => {}} readonly />
                        <span className="text-ocean-400">(8 votes)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleVote(upload.id, 'up')}
                      className={`flex items-center space-x-2 transition-colors ${
                        userVotes[upload.id] === 'up' 
                          ? 'text-green-600' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className={`h-5 w-5 ${userVotes[upload.id] === 'up' ? 'fill-current' : ''}`} />
                      <span className="font-medium">{upload.upvotes}</span>
                    </button>

                    <button
                      onClick={() => handleVote(upload.id, 'down')}
                      className={`flex items-center space-x-2 transition-colors ${
                        userVotes[upload.id] === 'down' 
                          ? 'text-red-600' 
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className={`h-5 w-5 ${userVotes[upload.id] === 'down' ? 'fill-current' : ''}`} />
                      <span className="font-medium">{upload.downvotes}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">{upload.comments.length}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-orange-600 transition-colors">
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Discussion Mode - Comments */}
                {discussionMode && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-3 mb-4">
                      {upload.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <img
                            src={comment.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800 text-sm">{comment.userName}</span>
                              <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                        alt={user?.name || 'You'}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add to the discussion..."
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && addComment(upload.id)}
                        />
                        <button
                          onClick={() => addComment(upload.id)}
                          disabled={!newComment.trim()}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reject Modal */}
        <AnimatePresence>
          {showRejectModal && rejectTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => !isRejecting && setShowRejectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full shadow-glass-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ocean-800">Reject Report</h3>
                    <p className="text-xs text-ocean-500">This will flag the report for the submitter</p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-sand-50 rounded-xl">
                  <p className="text-sm font-medium text-ocean-800 line-clamp-2">{rejectTarget.title}</p>
                  <p className="text-xs text-ocean-500 mt-1">{rejectTarget.description.substring(0, 100)}...</p>
                </div>

                <label className="block text-sm font-semibold text-ocean-700 mb-2">
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  autoFocus
                  className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent mb-5"
                  placeholder="e.g. Blurry image, wrong location, not a coastal hazard..."
                />

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    disabled={isRejecting}
                    className="flex-1 border border-gray-200 text-ocean-700 py-2.5 rounded-xl font-medium hover:bg-sand-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRejection}
                    disabled={!rejectionReason.trim() || isRejecting}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
                  >
                    {isRejecting ? (
                      <><span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /><span>Rejecting...</span></>
                    ) : (
                      <><XCircle className="h-4 w-4" /><span>Confirm Rejection</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Modal */}
        <AnimatePresence>
          {showValidationModal && selectedUpload && (
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
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-glass-xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-ocean-800">Community Validation</h3>
                    <button
                      onClick={() => setShowValidationModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-6">
                    <img
                      src={selectedUpload.fileUrl}
                      alt={selectedUpload.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <h4 className="text-base font-bold text-ocean-800 mb-2">{selectedUpload.title}</h4>
                    <p className="text-ocean-500 text-sm">{selectedUpload.description}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-ocean-700 mb-2">
                        Rate the accuracy of this report
                      </label>
                      <StarRating 
                        value={validationForm.accuracy} 
                        onChange={(value) => setValidationForm({ ...validationForm, accuracy: value })} 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ocean-700 mb-2">
                        Rate the relevance to community safety
                      </label>
                      <StarRating 
                        value={validationForm.relevance} 
                        onChange={(value) => setValidationForm({ ...validationForm, relevance: value })} 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ocean-700 mb-2">
                        Rate the safety importance
                      </label>
                      <StarRating 
                        value={validationForm.safety} 
                        onChange={(value) => setValidationForm({ ...validationForm, safety: value })} 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ocean-700 mb-2">
                        Rate the completeness of information
                      </label>
                      <StarRating 
                        value={validationForm.completeness} 
                        onChange={(value) => setValidationForm({ ...validationForm, completeness: value })} 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ocean-700 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        value={validationForm.comment}
                        onChange={(e) => setValidationForm({ ...validationForm, comment: e.target.value })}
                        rows={4}
                        className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        placeholder="Share your thoughts on this report's validity and usefulness..."
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowValidationModal(false)}
                      className="flex-1 border border-gray-200 text-ocean-700 py-3 rounded-xl font-medium hover:bg-sand-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitValidation}
                      disabled={!validationForm.accuracy || !validationForm.relevance || !validationForm.safety || !validationForm.completeness}
                      className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-50"
                    >
                      Submit Validation
                    </button>
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

export default CommunityDashboard;