import React from 'react';
import { calculateAccuracy, simulateAccuracyCalculation } from '../lib/accuracyUtils';

// Hook for managing accuracy state
export const useAccuracy = (context: 'upload' | 'view', reportId?: string) => {
  const [accuracy, setAccuracy] = React.useState<number>(0);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const calculateAndSetAccuracy = React.useCallback(async (reportData?: Record<string, unknown>) => {
    setIsCalculating(true);
    
    await simulateAccuracyCalculation();
    
    const calculatedAccuracy = calculateAccuracy(context, reportData);
    setAccuracy(calculatedAccuracy);
    setIsCalculating(false);
    
    return calculatedAccuracy;
  }, [context]);

  React.useEffect(() => {
    if (reportId) {
      calculateAndSetAccuracy();
    }
  }, [reportId, calculateAndSetAccuracy]);

  return { accuracy, isCalculating, calculateAndSetAccuracy };
};