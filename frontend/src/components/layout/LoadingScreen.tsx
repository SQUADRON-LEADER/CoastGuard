import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Waves, MapPin } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onLoadingComplete }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const loadingSteps = useMemo(() => [
    { text: t('loading.initializing'), duration: 800 },
    { text: t('loading.connectingServers'), duration: 600 },
    { text: t('loading.loadingMaps'), duration: 700 },
    { text: t('loading.preparingDashboard'), duration: 500 },
    { text: t('loading.almostReady'), duration: 400 },
  ], [t]);

  useEffect(() => {
    if (!isLoading) return;

    let currentProgress = 0;
    let stepIndex = 0;
    
    const progressInterval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500);
        return;
      }

      // Update loading text based on progress
      const progressPerStep = 100 / loadingSteps.length;
      const newStepIndex = Math.floor(currentProgress / progressPerStep);
      
      if (newStepIndex !== stepIndex && newStepIndex < loadingSteps.length) {
        stepIndex = newStepIndex;
        setLoadingText(loadingSteps[stepIndex].text);
      }

      // Simulate realistic loading with variable speed
      const increment = Math.random() * 3 + 1; // 1-4% increments
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);
    }, 50);

    // Set initial loading text
    setLoadingText(loadingSteps[0].text);

    return () => clearInterval(progressInterval);
  }, [isLoading, onLoadingComplete, t, loadingSteps]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-sand-50"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated Waves */}
            <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1200 200" preserveAspectRatio="none">
              <motion.path
                d="M0,100 Q300,50 600,100 T1200,80 L1200,200 L0,200 Z"
                fill="url(#wave1)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.path
                d="M0,120 Q400,70 800,120 T1200,100 L1200,200 L0,200 Z"
                fill="url(#wave2)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0891B2" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0891B2" stopOpacity="0.15" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute opacity-20"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0.5 + Math.random() * 0.5
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: 360,
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
              >
                {i % 3 === 0 ? (
                  <Waves className="w-8 h-8 text-blue-400" />
                ) : i % 3 === 1 ? (
                  <Waves className="w-6 h-6 text-teal-500" />
                ) : (
                  <MapPin className="w-5 h-5 text-indigo-400" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Loading Content */}
          <div className="relative z-10 text-center px-8 max-w-md mx-auto">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 mx-auto mb-4 flex items-center justify-center"
                >
                  <img src="/logo.png" alt="CoastGuard Logo" className="w-24 h-24 object-contain drop-shadow-lg" />
                </motion.div>
                
                {/* Pulse Animation */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 w-24 h-24 mx-auto bg-ocean-500 rounded-full opacity-20"
                />
              </div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-4xl font-bold text-ocean-800 mb-2"
              >
                CoastGuard
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-ocean-500 text-lg"
              >
                {t('loading.tagline')}
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mb-6"
            >
              <div className="relative">
                <div className="w-full bg-ocean-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-ocean-600 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{ width: '100px' }}
                    />
                  </motion.div>
                </div>
                
                {/* Progress Percentage */}
                <motion.div
                  className="mt-3 flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-2xl font-bold text-ocean-700">
                    {Math.round(progress)}%
                  </span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <motion.p
                key={loadingText}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-ocean-700 text-lg font-medium"
              >
                {loadingText}
              </motion.p>
            </motion.div>

            {/* Dots Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex justify-center space-x-1 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-ocean-600 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;