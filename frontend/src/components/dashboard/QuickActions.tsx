import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  CheckCircle, 
  MessageCircle, 
  AlertTriangle, 
  Bot, 
  MessageSquare,
  Phone,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QuickActions: React.FC = () => {
  const { user } = useAuth();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleWhatsAppContact = () => {
    // Mock WhatsApp integration
    const phoneNumber = '+919876543210'; // Mock protector number
    const message = encodeURIComponent('Hello, I need assistance with a coastal safety concern.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowWhatsAppModal(false);
  };

  const userActions = [
    {
      title: 'Upload Report',
      description: 'Share photos, documents, or incident reports',
      icon: UploadCloud,
      color: 'bg-ocean-700',
      action: () => window.location.href = '/upload',
    },
    {
      title: 'Community Feed',
      description: 'View and vote on local reports',
      icon: Users,
      color: 'bg-emerald-600',
      action: () => window.location.href = '/community',
    },
    {
      title: 'Emergency Chatbot',
      description: 'Get instant help and guidance',
      icon: Bot,
      color: 'bg-purple-600',
      action: () => {}, // Handled by floating chatbot
    },
    {
      title: 'WhatsApp Support',
      description: 'Connect with protectors via WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-600',
      action: () => setShowWhatsAppModal(true),
    },
    {
      title: 'Emergency Contacts',
      description: 'Quick access to emergency numbers',
      icon: Phone,
      color: 'bg-coral-500',
      action: () => alert('Emergency: 108 | Coast Guard: 1554 | Local Police: 100'),
    },
    {
      title: 'Report Hazard',
      description: 'Quick hazard reporting form',
      icon: AlertTriangle,
      color: 'bg-amber-500',
      action: () => window.location.href = '/upload',
    },
  ];

  const protectorActions = [
    {
      title: 'Verify New Reports',
      description: 'Review and verify user-submitted reports',
      icon: CheckCircle,
      color: 'bg-emerald-600',
      action: () => window.location.href = '/verify',
    },
    {
      title: 'Urgent Verifications',
      description: 'High-priority reports needing immediate attention',
      icon: Users,
      color: 'bg-coral-500',
      action: () => window.location.href = '/verify',
    },
    {
      title: 'Community Reports',
      description: 'View all community submissions and feedback',
      icon: Bot,
      color: 'bg-ocean-700',
      action: () => window.location.href = '/community',
    },
    {
      title: 'Verification Analytics',
      description: 'Track verification performance and trends',
      icon: MessageSquare,
      color: 'bg-purple-600',
      action: () => window.location.href = '/analytics',
    },
    {
      title: 'Emergency Response',
      description: 'Handle critical alerts and emergency protocols',
      icon: AlertTriangle,
      color: 'bg-amber-500',
      action: () => window.location.href = '/verify',
    },
    {
      title: 'Verifier Support',
      description: 'Technical support and verification guidelines',
      icon: Phone,
      color: 'bg-ocean-500',
      action: () => alert('Verifier Support: verifier@coastguard.in | Emergency: +91-11-2345-6789'),
    },
  ];

  const actions = user?.role === 'verifier_protector' ? protectorActions : userActions;

  return (
    <>
      <div className="glass-panel p-6">
        <h3 className="text-base font-bold text-ocean-800 mb-5">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm hover:border-ocean-200 hover:shadow-md hover:bg-white/80 transition-all duration-300 text-left group"
            >
              <div className={`inline-flex p-2.5 rounded-xl ${action.color} mb-3 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-ocean-800 text-sm mb-1">{action.title}</h4>
              <p className="text-xs text-ocean-500">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* WhatsApp Modal */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWhatsAppModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-glass-xl"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-ocean-800 mb-2">WhatsApp Support</h3>
                <p className="text-ocean-500 text-sm">
                  Connect directly with a protector in your area for immediate assistance
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
                >
                  Open WhatsApp Chat
                </motion.button>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="w-full border border-gray-200 text-ocean-700 py-3 rounded-xl font-semibold hover:bg-sand-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickActions;