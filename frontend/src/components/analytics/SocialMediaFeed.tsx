import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Share, 
  MapPin,
  Clock,
  AlertTriangle,
  Filter,
  Globe,
  Zap
} from 'lucide-react';
import { SocialMediaPost, Language } from '../../types';
import { formatTimeAgo } from '../../lib/utils';

const SocialMediaFeed: React.FC = () => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'verified'>('all');
  const [languageFilter, setLanguageFilter] = useState<Language | 'all'>('all');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Social media posts will come from a real API feed
    if (isLive) {
      const interval = setInterval(() => {
        // Mock new post every 30 seconds
        const newPost: SocialMediaPost = {
          id: Date.now().toString(),
          platform: ['twitter', 'facebook', 'instagram'][Math.floor(Math.random() * 3)] as any,
          content: 'New coastal activity detected via social monitoring...',
          author: 'Live Monitor',
          authorHandle: '@livemonitor',
          timestamp: new Date(),
          engagement: { likes: 0, shares: 0, comments: 0, reach: 0 },
          sentiment: 'neutral',
          urgencyScore: Math.floor(Math.random() * 100),
          language: 'en',
          hashtags: ['#LiveUpdate'],
          mentions: [],
          mediaUrls: [],
          isVerified: false,
          relatedHazards: [],
        };
        setPosts(prev => [newPost, ...prev.slice(0, 19)]);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const filteredPosts = posts.filter(post => {
    if (filter === 'urgent' && post.urgencyScore < 70) return false;
    if (filter === 'verified' && !post.isVerified) return false;
    if (languageFilter !== 'all' && post.language !== languageFilter) return false;
    return true;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      default: return Globe;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'from-blue-400 to-blue-600';
      case 'facebook': return 'from-blue-600 to-blue-800';
      case 'instagram': return 'from-pink-500 to-purple-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Social Media Intelligence</h2>
            <p className="text-gray-600">Real-time disaster monitoring across platforms</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isLive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { value: 'all', label: 'All Posts' },
            { value: 'urgent', label: 'Urgent Only' },
            { value: 'verified', label: 'Verified Sources' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === option.value
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
        </select>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <h4 className="text-2xl font-bold text-blue-600">{filteredPosts.length}</h4>
          <p className="text-sm text-blue-700">Active Posts</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <h4 className="text-2xl font-bold text-red-600">
            {filteredPosts.filter(p => p.urgencyScore > 70).length}
          </h4>
          <p className="text-sm text-red-700">High Urgency</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <h4 className="text-2xl font-bold text-green-600">
            {filteredPosts.filter(p => p.isVerified).length}
          </h4>
          <p className="text-sm text-green-700">Verified Sources</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <h4 className="text-2xl font-bold text-purple-600">
            {filteredPosts.reduce((sum, p) => sum + p.engagement.reach, 0).toLocaleString()}
          </h4>
          <p className="text-sm text-purple-700">Total Reach</p>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredPosts.map((post, index) => {
          const PlatformIcon = getPlatformIcon(post.platform);
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlatformColor(post.platform)}`}>
                  <PlatformIcon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-800">{post.author}</span>
                      <span className="text-gray-500 text-sm">{post.authorHandle}</span>
                      {post.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(post.sentiment)}`}>
                        {post.sentiment}
                      </span>
                      {post.urgencyScore > 70 && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-bold">{post.urgencyScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  
                  {post.location && (
                    <div className="flex items-center space-x-1 text-gray-500 text-sm mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{post.location.name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.engagement.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span>{post.engagement.shares}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.engagement.comments}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>
                  
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaFeed;