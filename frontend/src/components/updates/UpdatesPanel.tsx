import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Star, 
  Wrench, 
  Bug, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { FeatureUpdate } from '../../types';
import { formatTimeAgo } from '../../lib/utils';

const UpdatesPanel: React.FC = () => {
  const [updates, setUpdates] = useState<FeatureUpdate[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Updates will be loaded from API when the endpoint is available
  }, []);

  const filteredUpdates = updates.filter(update => 
    filter === 'unread' ? !update.isRead : true
  );

  const markAsRead = (updateId: string) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId ? { ...update, isRead: true } : update
    ));
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'feature': return Star;
      case 'improvement': return Sparkles;
      case 'fix': return Wrench;
      default: return Bell;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'feature': return 'from-blue-600 to-teal-600';
      case 'improvement': return 'from-green-600 to-emerald-600';
      case 'fix': return 'from-orange-600 to-red-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Platform Updates</h1>
          <p className="text-lg text-gray-600">
            Stay informed about new features and improvements to CoastGuard
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm mb-8 w-fit">
          {[
            { value: 'all', label: 'All Updates' },
            { value: 'unread', label: `Unread (${updates.filter(u => !u.isRead).length})` },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                filter === option.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Updates List */}
        <div className="space-y-6">
          {filteredUpdates.map((update, index) => {
            const IconComponent = getUpdateIcon(update.type);
            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`
                  bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer
                  ${!update.isRead ? 'ring-2 ring-blue-200' : ''}
                `}
                onClick={() => markAsRead(update.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getUpdateColor(update.type)}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{update.title}</h3>
                      {!update.isRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{update.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize bg-gray-100 px-3 py-1 rounded-full">
                          {update.type}
                        </span>
                        <span>By {update.createdBy}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(update.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredUpdates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No updates found</h3>
            <p className="text-gray-500">
              {filter === 'unread' ? 'You\'re all caught up!' : 'Check back later for new updates'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpdatesPanel;