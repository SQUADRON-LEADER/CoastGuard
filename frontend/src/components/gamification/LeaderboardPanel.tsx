import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Crown,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { LeaderboardEntry, Badge } from '../../types';
import { formatPoints } from '../../lib/utils';

import { API_BASE_URL } from '../../services/api';

const API_BASE = API_BASE_URL;

const LeaderboardPanel: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [category, setCategory] = useState<'overall' | 'uploads' | 'verifications' | 'community'>('overall');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
          setBadges(data.badges || []);
        }
      } catch {
        // API not available yet — leave empty
      }
    };
    loadLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-ocean-500">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-ocean-400" />;
    }
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-600';
      case 'epic': return 'bg-ocean-600';
      case 'rare': return 'bg-emerald-600';
      default: return 'bg-ocean-400';
    }
  };

  return (
    <div className="elevated-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500 rounded-xl">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ocean-800">Community Leaderboard</h2>
            <p className="text-ocean-500">Top contributors to ocean safety</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'all', label: 'All Time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                timeframe === option.value
                  ? 'bg-white text-ocean-800 shadow-sm'
                  : 'text-ocean-500 hover:text-ocean-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { value: 'overall', label: 'Overall' },
            { value: 'uploads', label: 'Uploads' },
            { value: 'verifications', label: 'Verifications' },
            { value: 'community', label: 'Community' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setCategory(option.value as any)}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                category === option.value
                  ? 'bg-white text-ocean-800 shadow-sm'
                  : 'text-ocean-500 hover:text-ocean-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-ocean-400"><Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No leaderboard data yet.</p></div>
        ) : leaderboard.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg
              ${entry.rank <= 3 
                ? 'bg-amber-50/50 border-amber-200' 
                : 'bg-sand-50 border-gray-200 hover:border-gray-200'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3 flex-1">
                <img
                  src={entry.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100'}
                  alt={entry.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-ocean-800">{entry.userName}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-ocean-600">{formatPoints(entry.points)}</span>
                    <span className="text-sm text-ocean-500">points</span>
                    {getTrendIcon(entry.trend)}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-ocean-800">{entry.stats.uploads}</p>
                  <p className="text-ocean-500">Uploads</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-ocean-800">{entry.stats.verifications}</p>
                  <p className="text-ocean-500">Verified</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-ocean-800">{entry.stats.accuracy}%</p>
                  <p className="text-ocean-500">Accuracy</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-1">
                {entry.badges.slice(0, 3).map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.2 }}
                    className={`w-8 h-8 rounded-full ${getBadgeRarityColor(badge.rarity)} flex items-center justify-center text-white text-sm`}
                    title={badge.name}
                  >
                    {badge.icon}
                  </motion.div>
                ))}
                {entry.badges.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-ocean-500 text-xs font-bold">
                    +{entry.badges.length - 3}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badge Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-200"
      >
        <h3 className="text-xl font-bold text-ocean-800 mb-4">Available Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${badge.color} flex items-center justify-center text-white text-xl`}>
                {badge.icon}
              </div>
              <h4 className="font-bold text-ocean-800 text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-ocean-500">{badge.description}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                badge.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                badge.rarity === 'epic' ? 'bg-ocean-100 text-ocean-700' :
                badge.rarity === 'rare' ? 'bg-emerald-50 text-emerald-700' :
                'bg-gray-100 text-ocean-700'
              }`}>
                {badge.rarity}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPanel;