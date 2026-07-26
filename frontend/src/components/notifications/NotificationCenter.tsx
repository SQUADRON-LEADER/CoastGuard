import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Notification } from '../../types';
import { formatTimeAgo } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  useEffect(() => {
    // No mock data — notifications will come from real API in future
  }, [user]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.isRead) return false;
    if (filter === 'urgent' && notification.priority !== 'urgent') return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'upload_verified': return CheckCircle;
      case 'upload_flagged': return AlertTriangle;
      case 'badge_earned': return Star;
      case 'urgent_alert': return AlertTriangle;
      case 'system_update': return TrendingUp;
      case 'verification_request': return Clock;
      case 'community_milestone': return Star;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'bg-coral-500';
    
    switch (type) {
      case 'upload_verified': return 'bg-emerald-600';
      case 'upload_flagged': return 'bg-amber-500';
      case 'badge_earned': return 'bg-amber-500';
      case 'system_update': return 'bg-ocean-600';
      case 'verification_request': return 'bg-purple-600';
      case 'community_milestone': return 'bg-purple-500';
      default: return 'bg-ocean-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-coral-50 text-coral-700 animate-pulse';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-ocean-100 text-ocean-700';
      default: return 'bg-gray-100 text-ocean-700';
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="relative p-3 bg-white rounded-full shadow-card hover:shadow-card-hover transition-all duration-300"
      >
        <Bell className="h-6 w-6 text-ocean-700" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-20 right-6 w-96 max-h-[80vh] elevated-card shadow-glass-xl z-50 flex flex-col overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-ocean-700 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Notifications</h3>
              <p className="text-xs opacity-90">{unreadCount} unread updates</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white/20 rounded-lg p-1">
            {[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'urgent', label: 'Urgent' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  filter === option.value ? 'bg-white text-ocean-600' : 'text-white hover:bg-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-white/80 hover:text-white transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => {
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  p-4 border-b border-gray-100 hover:bg-sand-50 transition-colors duration-200 cursor-pointer
                  ${!notification.isRead ? 'bg-ocean-50/50' : ''}
                `}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl ${getNotificationColor(notification.type, notification.priority)}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-ocean-800 text-sm">{notification.title}</h4>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-ocean-500 rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-ocean-500 text-sm mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-xs text-ocean-400">{formatTimeAgo(notification.createdAt)}</span>
                      </div>
                      
                      {notification.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = notification.actionUrl!;
                          }}
                          className="text-ocean-600 hover:text-ocean-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-ocean-500 mb-2">No notifications</h3>
            <p className="text-ocean-400 text-sm">
              {filter === 'unread' ? 'You\'re all caught up!' : 'Check back later for updates'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationCenter;