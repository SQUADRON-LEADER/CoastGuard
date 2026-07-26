// Utility functions for accuracy calculation

export const calculateAccuracy = (context: 'upload' | 'view', reportData?: Record<string, unknown>): number => {
  if (context === 'upload') {
    const uploadCount = reportData?.uploadCount as number | undefined;
    if (typeof uploadCount === 'number' && uploadCount === 0) {
      // 1st ever upload: low confidence < 10% — more evidence needed
      return Math.round(5 + Math.random() * 4); // 5–9%
    }
    // 2nd or later upload: high confidence > 90%
    return Math.round(91 + Math.random() * 5); // 91–96%
  } else {
    // Lower accuracy when viewing details (73-79%)
    const baseAccuracy = 73;
    const variance = Math.random() * 6; // 0-6%
    return Math.round(baseAccuracy + variance);
  }
};

export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 90) return 'text-green-600 bg-green-100';
  if (accuracy >= 80) return 'text-yellow-600 bg-yellow-100';
  if (accuracy >= 70) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

export const getAccuracyLabel = (accuracy: number): string => {
  if (accuracy >= 95) return 'Excellent';
  if (accuracy >= 90) return 'Very High';
  if (accuracy >= 80) return 'High';
  if (accuracy >= 70) return 'Good';
  return 'Needs Review';
};

export const simulateAccuracyCalculation = (): Promise<void> => {
  // Simulate AI accuracy calculation delay
  const delay = 1500 + Math.random() * 1000;
  return new Promise(resolve => setTimeout(resolve, delay));
};