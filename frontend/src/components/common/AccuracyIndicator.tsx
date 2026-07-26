import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { getAccuracyColor, getAccuracyLabel } from '../../lib/accuracyUtils';

interface AccuracyIndicatorProps {
  accuracy: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AccuracyIndicator: React.FC<AccuracyIndicatorProps> = ({
  accuracy,
  showDetails = false,
  size = 'md'
}) => {
  const getAccuracyIcon = (acc: number) => {
    if (acc >= 90) return <CheckCircle className="h-4 w-4" />;
    if (acc >= 70) return <Target className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-2 rounded-full font-medium ${getAccuracyColor(accuracy)} ${sizeClasses[size]}`}
    >
      {getAccuracyIcon(accuracy)}
      <span>{accuracy}% Accuracy</span>
      {showDetails && (
        <span className="text-xs opacity-75">
          ({getAccuracyLabel(accuracy)})
        </span>
      )}
    </motion.div>
  );
};