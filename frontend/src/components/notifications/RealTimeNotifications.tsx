import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  X,
  Eye,
  MessageCircle,
  Upload,
  Shield
} from 'lucide-react';
import { Notification } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatTimeAgo } from '../../lib/utils';
import toast from 'react-hot-toast';

interface RealTimeNotificationsProps {
  onNewNotification?: (notification: Notification) => void;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ onNewNotification }) => {
  const { user } = useAuth();
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  // Auto-dismiss notifications after 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveNotifications(prev => prev.filter(notification => {
        const age = Date.now() - new Date(notification.createdAt).getTime();
        return age < 15000; // Remove notifications older than 15 seconds
      }));
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || !isEnabled) return;

    // Real-time notifications for protectors - immediate alerts for new reports
    if (user.role === 'verifier_protector') {
      const interval = setInterval(() => {
        // Simulate new report submission by a user
        const notificationTypes = [
          {
            type: 'verification_request',
            title: '🚨 NEW REPORT: User Submitted Critical Alert',
            message: 'User "Priya Sharma" reported critical storm surge at Chennai Marina - 23 community upvotes - NEEDS IMMEDIATE VERIFICATION',
            priority: 'urgent',
          },
          {
            type: 'verification_request',
            title: '🔍 NEW REPORT: High Priority Submission',
            message: 'User "Anita Kumar" reported oil spill near Kochi Port - 18 community upvotes - Environmental concern',
            priority: 'high',
          },
          {
            type: 'verification_request',
            title: '📋 NEW REPORT: Community Submission',
            message: 'User "Ravi Krishnan" reported unusual tide patterns at Goa Beach - 8 community upvotes',
            priority: 'medium',
          },
          {
            type: 'urgent_alert',
            title: '⚠️ MULTIPLE REPORTS: Same Area Alert',
            message: '3 users reported high waves at Mumbai Marine Drive in last 30 minutes - Pattern detected',
            priority: 'urgent',
          },
        ];

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const newNotification: Notification = {
          id: `live_${Date.now()}`,
          userId: user.id,
          type: randomNotification.type as any,
          title: randomNotification.title,
          message: randomNotification.message,
          isRead: false,
          priority: randomNotification.priority as any,
          createdAt: new Date(),
          actionUrl: randomNotification.type === 'verification_request' ? '/verify' : undefined,
        };

        setLiveNotifications(prev => [newNotification, ...prev.slice(0, 2)]); // Keep only 3 notifications max
        
        // Enhanced toast notifications for protectors (reduced frequency and duration)
        if (randomNotification.priority === 'urgent') {
          toast.error(`🛡️ VERIFIER ALERT: ${randomNotification.message}`, {
            duration: 4000, // Reduced from 8000
            icon: '🚨',
            style: {
              background: '#DC2626',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
        } else if (randomNotification.priority === 'high') {
          toast(`🛡️ VERIFICATION NEEDED: ${randomNotification.message}`, {
            duration: 3000, // Reduced from 6000
            icon: '🛡️',
            style: {
              background: '#EA580C',
              color: '#fff',
            },
          });
        } else {
          toast.success(`🛡️ NEW REPORT: ${randomNotification.message}`, {
            duration: 2000, // Reduced from 4000
            icon: '🛡️',
          });
        }

        if (onNewNotification) {
          onNewNotification(newNotification);
        }
      }, 30000); // Reduced frequency: every 30 seconds instead of 8 seconds

      return () => clearInterval(interval);
    }

    // For regular users, simulate different types of notifications
    if (user.role === 'community_user' || user.role === 'community_validator') {
      const interval = setInterval(() => {
        const userNotificationTypes = user.role === 'community_validator' ? [
          {
            type: 'validation_request',
            title: '⭐ New Validation Request',
            message: 'High-priority report from Mumbai Marine Drive needs community validation - 15 upvotes',
            priority: 'medium',
          },
          {
            type: 'validation_completed',
            title: '✅ Validation Completed',
            message: 'Your validation of Chennai storm surge report was marked as helpful by 8 community members',
            priority: 'medium',
          },
          {
            type: 'community_milestone',
            title: '🏆 Community Achievement',
            message: 'You reached #12 in community validator rankings! +50 bonus points earned',
            priority: 'medium',
          },
          {
            type: 'discussion_reply',
            title: '💬 Discussion Reply',
            message: 'Dr. Raj Patel replied to your validation comment on Kochi oil spill report',
            priority: 'medium',
          },
        ] : [
          {
            type: 'upload_verified',
            title: '🎉 Your Report Was Verified!',
            message: 'Your Marine Drive wave report has been verified by Dr. Raj Patel - You earned 50 points!',
            priority: 'medium',
          },
          {
            type: 'badge_earned',
            title: '🏆 New Badge Earned!',
            message: 'You earned the "Eagle Eye" badge for early hazard detection - +100 points!',
            priority: 'medium',
          },
          {
            type: 'urgent_alert',
            title: '⚠️ Critical Alert Near You',
            message: 'URGENT: Storm surge approaching 2km from your location - Take immediate safety measures',
            priority: 'high',
          },
          {
            type: 'new_comment',
            title: '💬 New Comment on Your Report',
            message: 'Dr. Raj Patel commented on your Marine Drive report with additional safety guidance',
            priority: 'medium',
          },
        ];

        const randomNotification = userNotificationTypes[Math.floor(Math.random() * userNotificationTypes.length)];
        
        const newNotification: Notification = {
          id: `${user.role}_live_${Date.now()}`,
          userId: user.id,
          type: randomNotification.type as any,
          title: randomNotification.title,
          message: randomNotification.message,
          isRead: false,
          priority: randomNotification.priority as any,
          createdAt: new Date(),
        };

        setLiveNotifications(prev => [newNotification, ...prev.slice(0, 2)]); // Keep only 3 notifications max
        
        // Enhanced user notifications (reduced duration)
        if (randomNotification.priority === 'high') {
          toast.error(randomNotification.message, {
            duration: 3000, // Reduced from 8000
            icon: '⚠️',
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          });
        } else {
          toast.success(randomNotification.message, {
            duration: 2000, // Reduced from 5000
            icon: randomNotification.type === 'badge_earned' || randomNotification.type === 'community_milestone' ? '🏆' : 
                  randomNotification.type === 'upload_verified' || randomNotification.type === 'validation_completed' ? '✅' : 
                  randomNotification.type === 'validation_request' ? '⭐' : '💬',
          });
        }

        if (onNewNotification) {
          onNewNotification(newNotification);
        }
      }, user.role === 'community_validator' ? 45000 : 60000); // Community validators: 45 seconds, regular users: 60 seconds

      return () => clearInterval(interval);
    }
  }, [user, isEnabled, onNewNotification]);

  const markAsRead = (notificationId: string) => {
    setLiveNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const dismissNotification = (notificationId: string) => {
    setLiveNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'verification_request': return Shield;
      case 'upload_verified': return CheckCircle;
      case 'urgent_alert': return AlertTriangle;
      case 'badge_earned': return CheckCircle;
      case 'community_milestone': return CheckCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-orange-500';
      case 'high': return 'from-orange-500 to-yellow-500';
      case 'medium': return 'from-blue-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="fixed top-20 right-6 w-80 z-40">
      {/* Live Notifications Toggle */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
            isEnabled 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm">{isEnabled ? 'Live Alerts ON' : 'Live Alerts OFF'}</span>
        </button>
      </div>

      {/* Live Notifications */}
      <AnimatePresence>
        {liveNotifications.map((notification, index) => {
          const IconComponent = getNotificationIcon(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                mb-3 bg-white rounded-xl shadow-lg border-l-4 overflow-hidden
                ${notification.priority === 'urgent' ? 'border-red-500' :
                  notification.priority === 'high' ? 'border-orange-500' :
                  'border-blue-500'
                }
              `}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getNotificationColor(notification.priority)}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-800 text-sm">{notification.title}</h4>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        )}
                        
                        {notification.actionUrl && (
                          <button
                            onClick={() => window.location.href = notification.actionUrl!}
                            className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeNotifications;