import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AccuracyIndicator } from '../common/AccuracyIndicator';
import { calculateAccuracy } from '../../lib/accuracyUtils';

interface ReportAccuracyDisplayProps {
  reportId: string;
  context: 'upload' | 'view';
  reportData?: Record<string, unknown>;
  showOnClick?: boolean;
}

export const ReportAccuracyDisplay: React.FC<ReportAccuracyDisplayProps> = ({
  reportId,
  context,
  reportData,
  showOnClick = false
}) => {
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(!showOnClick);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateAccuracy = useCallback(async () => {
    if (accuracy > 0 && context === 'view') return; // Don't recalculate for view context
    
    setIsLoading(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    const calculatedAccuracy = calculateAccuracy(context, reportData);
    setAccuracy(calculatedAccuracy);
    setIsLoading(false);
    
    if (showOnClick) {
      setIsVisible(true);
    }
  }, [accuracy, context, reportData, showOnClick]);

  useEffect(() => {
    if (!showOnClick) {
      handleCalculateAccuracy();
    }
  }, [reportId, context, showOnClick, handleCalculateAccuracy]);

  const handleClick = () => {
    if (showOnClick && !isVisible) {
      handleCalculateAccuracy();
    }
  };

  if (!isVisible && !isLoading) {
    return showOnClick ? (
      <button
        onClick={handleClick}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
      >
        View AI Analysis Accuracy
      </button>
    ) : null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span>Analyzing accuracy...</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              AI Analysis Accuracy:
            </span>
            <AccuracyIndicator accuracy={accuracy} showDetails={false} size="sm" />
          </div>
          {context === 'view' && (
            <p className="text-xs text-gray-500">
              Detailed analysis may show different accuracy than initial assessment
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};