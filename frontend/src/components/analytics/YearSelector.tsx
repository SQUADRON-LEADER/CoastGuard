import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Calendar, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { getAvailableYears, calculateYearOverYearGrowth, getTrendDirection } from '../../data/yearlyAnalytics';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  comparisonYear?: number;
  onComparisonYearChange?: (year: number | undefined) => void;
  showComparison?: boolean;
  onToggleComparison?: () => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
  comparisonYear,
  onComparisonYearChange,
  showComparison = false,
  onToggleComparison
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const availableYears = getAvailableYears();

  const getTrendForYear = (year: number) => {
    const growth = calculateYearOverYearGrowth(year, 'totalReports');
    return {
      growth,
      direction: getTrendDirection(growth)
    };
  };

  const YearDropdown = ({ 
    year, 
    onSelect, 
    isOpen, 
    setIsOpen, 
    placeholder 
  }: {
    year: number;
    onSelect: (year: number) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    placeholder: string;
  }) => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <Calendar size={16} className="text-gray-500" />
        <span className="font-medium text-gray-700">{year || placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {availableYears.map((yearOption) => {
                const trend = getTrendForYear(yearOption);
                const isSelected = yearOption === year;
                
                return (
                  <motion.button
                    key={yearOption}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => {
                      onSelect(yearOption);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 ${
                      isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{yearOption}</span>
                      {trend.growth !== null && (
                        <div className="flex items-center space-x-1">
                          {trend.direction === 'up' ? (
                            <TrendingUp size={14} className="text-green-500" />
                          ) : trend.direction === 'down' ? (
                            <TrendingDown size={14} className="text-red-500" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-400" />
                          )}
                          <span className={`text-xs ${
                            trend.direction === 'up' ? 'text-green-600' :
                            trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('analytics.selectYear')}
            </h3>
            <YearDropdown
              year={selectedYear}
              onSelect={onYearChange}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              placeholder={t('analytics.selectYear')}
            />
          </div>

          {showComparison && (
            <div className="flex items-center space-x-3">
              <ArrowRight size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{t('analytics.compareTo')}</span>
              <YearDropdown
                year={comparisonYear || 0}
                onSelect={(year) => onComparisonYearChange?.(year)}
                isOpen={isComparisonOpen}
                setIsOpen={setIsComparisonOpen}
                placeholder={t('analytics.selectComparisonYear')}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {onToggleComparison && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleComparison}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showComparison
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showComparison ? t('analytics.hideComparison') : t('analytics.compareYears')}
            </motion.button>
          )}
          
          {showComparison && comparisonYear && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComparisonYearChange?.(undefined)}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {t('analytics.clearComparison')}
            </motion.button>
          )}
        </div>
      </div>

      {/* Year Overview */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-4 pt-4 border-t border-gray-100"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary Year Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              {t('analytics.selectedYear')}
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{selectedYear}</div>
            {(() => {
              const trend = getTrendForYear(selectedYear);
              return trend.growth !== null ? (
                <div className="flex items-center space-x-1 mt-1">
                  {trend.direction === 'up' ? (
                    <TrendingUp size={12} className="text-green-500" />
                  ) : trend.direction === 'down' ? (
                    <TrendingDown size={12} className="text-red-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  )}
                  <span className={`text-xs ${
                    trend.direction === 'up' ? 'text-green-600' :
                    trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}% vs {selectedYear - 1}
                  </span>
                </div>
              ) : null;
            })()}
          </div>

          {/* Comparison Year Info */}
          {showComparison && comparisonYear && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                {t('analytics.comparisonYear')}
              </div>
              <div className="text-2xl font-bold text-purple-700 mt-1">{comparisonYear}</div>
              {(() => {
                const trend = getTrendForYear(comparisonYear);
                return trend.growth !== null ? (
                  <div className="flex items-center space-x-1 mt-1">
                    {trend.direction === 'up' ? (
                      <TrendingUp size={12} className="text-green-500" />
                    ) : trend.direction === 'down' ? (
                      <TrendingDown size={12} className="text-red-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                    <span className={`text-xs ${
                      trend.direction === 'up' ? 'text-green-600' :
                      trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}% vs {comparisonYear - 1}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Data Period Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {t('analytics.dataPeriod')}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">
              {showComparison && comparisonYear 
                ? `${Math.min(selectedYear, comparisonYear)} - ${Math.max(selectedYear, comparisonYear)}`
                : `Jan - Dec ${selectedYear}`
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {showComparison && comparisonYear 
                ? t('analytics.multiYearAnalysis')
                : t('analytics.fullYearData')
              }
            </div>
          </div>

          {/* Analysis Type */}
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
              {t('analytics.analysisType')}
            </div>
            <div className="text-sm font-medium text-green-700 mt-1">
              {showComparison ? t('analytics.comparative') : t('analytics.detailed')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {showComparison ? t('analytics.yearOverYear') : t('analytics.comprehensive')}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};