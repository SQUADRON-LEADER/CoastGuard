import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Send,
  Heart,
  Share2,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { Upload, Comment } from '../../types';
import { formatTimeAgo, getHazardIcon } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import toast from 'react-hot-toast';

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useReports();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [filter, setFilter] = useState<'all' | 'local' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUploads(reports);
  }, [reports]);

  const filteredUploads = uploads
    .filter(upload => {
      if (filter === 'local') return upload.isLocal;
      if (filter === 'verified') return upload.verificationStatus === 'verified';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleVote = (uploadId: string, voteType: 'up' | 'down') => {
    const currentVote = userVotes[uploadId];
    
    // Prevent double voting with better feedback
    if (currentVote === voteType) {
      toast.error(`You have already ${voteType === 'up' ? 'upvoted' : 'downvoted'} this report`);
      return;
    }
    
    setUploads(prev => prev.map(upload => {
      if (upload.id === uploadId) {
        let newUpvotes = upload.upvotes;
        let newDownvotes = upload.downvotes;
        
        // Remove previous vote if exists
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;
        
        // Add new vote
        if (voteType === 'up') newUpvotes++;
        if (voteType === 'down') newDownvotes++;
        
        return {
          ...upload,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
        };
      }
      return upload;
    }));
    
    setUserVotes(prev => ({ ...prev, [uploadId]: voteType }));
    
    // Enhanced feedback with points
    if (voteType === 'up') {
      toast.success('👍 Upvote recorded! +5 community points', {
        icon: '⬆️',
        duration: 3000,
      });
    } else {
      toast.success('👎 Downvote recorded - helping improve report quality', {
        icon: '⬇️',
        duration: 3000,
      });
    }
  };

  const handleComment = (uploadId: string) => {
    const commentText = newComments[uploadId]?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar,
      content: commentText,
      createdAt: new Date(),
      isVerifier: user?.role === 'verifier_protector',
      language: 'en',
    };

    setUploads(prev => prev.map(upload => {
      if (upload.id === uploadId) {
        return {
          ...upload,
          comments: [...upload.comments, newComment],
        };
      }
      return upload;
    }));

    setNewComments(prev => ({ ...prev, [uploadId]: '' }));
    toast.success('💬 Comment added! +2 community points', {
      icon: '💬',
      duration: 3000,
    });
  };

  const toggleComments = (uploadId: string) => {
    setShowComments(prev => ({ ...prev, [uploadId]: !prev[uploadId] }));
  };

  const handleShare = (upload: Upload) => {
    if (navigator.share) {
      navigator.share({
        title: upload.title,
        text: upload.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFlag = (uploadId: string) => {
    // Add confirmation dialog for flagging
    if (!confirm('Are you sure you want to flag this report for review? This will notify protectors.')) {
      return;
    }
    
    setUploads(prev => prev.map(upload => {
      if (upload.id === uploadId) {
        return {
          ...upload,
          verificationStatus: 'flagged' as const,
          flagReason: `Flagged by community member: ${user?.name || 'Anonymous'}`,
          actionLog: [
            ...(upload.actionLog || []),
            {
              id: Date.now().toString(),
              action: 'Report Flagged',
              performedBy: user?.name || 'Community Member',
              timestamp: new Date(),
              details: 'Flagged by community for protector review',
              previousStatus: upload.verificationStatus,
              newStatus: 'flagged',
            }
          ]
        };
      }
      return upload;
    }));
    toast.success('🚩 Report flagged for protector review - Thank you for helping maintain quality!', {
      duration: 4000,
    });
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-ocean-800 mb-4">Community Feed 🌊</h1>
          <p className="text-lg text-ocean-500 mb-6">
            See what's happening in your coastal community
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex bg-white rounded-xl p-1 shadow-sm">
              {[
                { value: 'all', label: 'All Reports' },
                { value: 'local', label: 'Near You' },
                { value: 'verified', label: 'Verified' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === option.value
                      ? 'bg-ocean-600 text-white shadow-sm'
                      : 'text-ocean-500 hover:text-ocean-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex bg-white rounded-xl p-1 shadow-sm">
              {[
                { value: 'recent', label: 'Most Recent' },
                { value: 'popular', label: 'Most Popular' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === option.value
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-ocean-500 hover:text-teal-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feed */}
        <div className="space-y-6">
          {filteredUploads.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 elevated-card"
            >
              <div className="text-6xl mb-4">🌊</div>
              <h3 className="text-xl font-bold text-ocean-700 mb-2">No reports in this view</h3>
              <p className="text-ocean-400 mb-6">Be the first to report a coastal hazard in your area.</p>
              <a href="/upload" className="bg-ocean-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-ocean-700 transition-colors">
                Submit a Report 📸
              </a>
            </motion.div>
          )}
          {filteredUploads.map((upload, index) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="elevated-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={upload.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100'}
                      alt={upload.userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-ocean-800">{upload.userName}</h3>
                        {user?.role === 'verifier_protector' && (
                          <span className="bg-ocean-100 text-ocean-700 px-2 py-1 rounded-full text-xs font-medium">
                            Protector
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-ocean-400">
                        <MapPin className="h-4 w-4" />
                        <span>{upload.location?.address || 'Location not specified'}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(upload.createdAt)}</span>
                        {upload.isLocal && (
                          <span className="bg-ocean-100 text-ocean-700 px-2 py-1 rounded-full text-xs font-medium">
                            Near You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getVerificationBadge(upload.verificationStatus)}
                    <button
                      onClick={() => handleFlag(upload.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Flag report"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-ocean-800 mb-2">{upload.title}</h3>
                <p className="text-ocean-700 mb-4">{upload.description}</p>

                {/* Hazard Info */}
                {upload.hazardType && (
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center space-x-1">
                      <span>{getHazardIcon(upload.hazardType)}</span>
                      <span>{upload.hazardType.replace('_', ' ')}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      upload.severity === 'critical' ? 'bg-coral-50 text-coral-700' :
                      upload.severity === 'severe' ? 'bg-coral-50 text-coral-700' :
                      upload.severity === 'serious' ? 'bg-orange-100 text-orange-700' :
                      upload.severity === 'moderate' ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {upload.severity} concern
                    </span>
                  </div>
                )}
              </div>

              {/* Image */}
              {upload.fileUrl && (
                <div className="px-6 pb-4">
                  <img
                    src={upload.fileUrl}
                    alt={upload.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(upload.id, 'up')}
                      className={`flex items-center space-x-2 transition-colors duration-200 ${
                        userVotes[upload.id] === 'up' 
                          ? 'text-emerald-600' 
                          : 'text-ocean-500 hover:text-emerald-600'
                      }`}
                    >
                      <ThumbsUp className={`h-5 w-5 ${userVotes[upload.id] === 'up' ? 'fill-current' : ''}`} />
                      <span className="font-medium">{upload.upvotes}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(upload.id, 'down')}
                      className={`flex items-center space-x-2 transition-colors duration-200 ${
                        userVotes[upload.id] === 'down' 
                          ? 'text-coral-600' 
                          : 'text-ocean-500 hover:text-coral-600'
                      }`}
                    >
                      <ThumbsDown className={`h-5 w-5 ${userVotes[upload.id] === 'down' ? 'fill-current' : ''}`} />
                      <span className="font-medium">{upload.downvotes}</span>
                    </motion.button>

                    <button 
                      onClick={() => toggleComments(upload.id)}
                      className="flex items-center space-x-2 text-ocean-500 hover:text-ocean-600 transition-colors duration-200"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{(upload.comments || []).length}</span>
                    </button>

                    <button 
                      onClick={() => handleShare(upload)}
                      className="flex items-center space-x-2 text-ocean-500 hover:text-ocean-600 transition-colors duration-200"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-ocean-400">
                    <Eye className="h-4 w-4" />
                    <span>{upload.views} views</span>
                  </div>
                </div>

                {/* Comments */}
                {showComments[upload.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {(upload.comments || []).map((comment, _ci) => (
                      <div key={(comment as any)._id || comment.id || _ci} className="flex items-start space-x-3">
                        <img
                          src={comment.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-ocean-800">{comment.userName}</span>
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
                    
                    {/* Add Comment */}
                    <div className="flex items-center space-x-3 mt-4">
                      <img
                        src={user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50'}
                        alt={user?.name || 'You'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newComments[upload.id] || ''}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [upload.id]: e.target.value }))}
                          placeholder="Add a comment..."
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(upload.id)}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleComment(upload.id)}
                          disabled={!newComments[upload.id]?.trim()}
                          className="bg-ocean-600 text-white p-2 rounded-lg hover:bg-ocean-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;