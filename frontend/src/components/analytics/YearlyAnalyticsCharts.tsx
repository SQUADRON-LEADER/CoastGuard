import React from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { YearlyAnalytics } from '../../data/yearlyAnalytics';

interface YearlyAnalyticsChartsProps {
  yearData: YearlyAnalytics;
  comparisonData?: YearlyAnalytics;
  showComparison?: boolean;
}

export const YearlyAnalyticsCharts: React.FC<YearlyAnalyticsChartsProps> = ({
  yearData,
  comparisonData,
  showComparison = false
}) => {
  const { t } = useTranslation();

  // Color schemes for charts
  const colors = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4'
  };

  const pieColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  // Prepare monthly trend data
  const monthlyTrendData = yearData?.monthlyData?.map((month, index: number) => {
    const baseData = {
      month: month.month.substring(0, 3),
      reports: month.reports,
      verified: month.verified,
      users: month.users,
      accuracy: month.accuracy,
      responseTime: month.avgResponseTime
    };

    if (showComparison && comparisonData?.monthlyData?.[index]) {
      const compMonth = comparisonData.monthlyData[index];
      return {
        ...baseData,
        reportsComp: compMonth.reports,
        verifiedComp: compMonth.verified,
        usersComp: compMonth.users,
        accuracyComp: compMonth.accuracy,
        responseTimeComp: compMonth.avgResponseTime
      };
    }

    return baseData;
  });

  // Prepare hazard type data for pie chart
  const hazardTypeData = yearData?.hazardTypes?.map((hazard) => ({
    name: hazard.type.replace('_', ' '),
    value: hazard.count,
    percentage: hazard.percentage,
    trend: hazard.trend
  }));

  // Prepare severity breakdown data
  const severityData = yearData?.severityBreakdown?.map((severity) => ({
    level: severity.level,
    count: severity.count,
    percentage: severity.percentage,
    responseTime: severity.avgResponseTime
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{color: string; name: string; value: number}>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-800">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Metric card component
  const MetricCard = ({ title, value, change, icon: Icon, color }: { 
    title: string; 
    value: string | number; 
    change: number | null; 
    icon: React.ComponentType<{size?: number; className?: string}> | any; 
    color: string 
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${color} text-white p-6 rounded-xl shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== null && (
            <div className="flex items-center space-x-1 mt-2">
              {change > 0 ? (
                <TrendingUp size={16} className="text-white/90" />
              ) : change < 0 ? (
                <TrendingDown size={16} className="text-white/90" />
              ) : null}
              <span className="text-white/90 text-sm">
                {change > 0 ? '+' : ''}{change?.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <Icon size={32} className="text-white/80" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('analytics.totalReports')}
          value={yearData?.totalReports?.toLocaleString()}
          change={showComparison && comparisonData ? 
            parseFloat(((yearData.totalReports - comparisonData.totalReports) / comparisonData.totalReports * 100).toFixed(1)) : null}
          icon={AlertTriangle}
          color="bg-blue-500"
        />
        <MetricCard
          title={t('analytics.verifiedReports')}
          value={yearData?.verifiedReports?.toLocaleString()}
          change={showComparison && comparisonData ? 
            parseFloat(((yearData.verifiedReports - comparisonData.verifiedReports) / comparisonData.verifiedReports * 100).toFixed(1)) : null}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <MetricCard
          title={t('analytics.activeUsers')}
          value={yearData?.activeUsers?.toLocaleString()}
          change={showComparison && comparisonData ? 
            parseFloat(((yearData.activeUsers - comparisonData.activeUsers) / comparisonData.activeUsers * 100).toFixed(1)) : null}
          icon={Users}
          color="bg-purple-500"
        />
        <MetricCard
          title={t('analytics.avgResponseTime')}
          value={`${yearData?.responseTime?.toFixed(1)}h`}
          change={showComparison && comparisonData ? 
            parseFloat(((comparisonData.responseTime - yearData.responseTime) / comparisonData.responseTime * 100).toFixed(1)) : null}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Monthly Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {t('analytics.monthlyTrends')}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar 
              dataKey="reports" 
              fill={colors.primary} 
              name={t('analytics.reports')}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="verified" 
              fill={colors.success} 
              name={t('analytics.verified')}
              radius={[2, 2, 0, 0]}
            />
            
            {showComparison && comparisonData && (
              <>
                <Bar 
                  dataKey="reportsComp" 
                  fill={colors.secondary} 
                  name={`${t('analytics.reports')} (${comparisonData.year})`}
                  opacity={0.7}
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="verifiedComp" 
                  fill={colors.warning} 
                  name={`${t('analytics.verified')} (${comparisonData.year})`}
                  opacity={0.7}
                  radius={[2, 2, 0, 0]}
                />
              </>
            )}
            
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke={colors.danger} 
              strokeWidth={3}
              name={t('analytics.accuracy')}
              dot={{ fill: colors.danger, strokeWidth: 2, r: 4 }}
            />
            
            {showComparison && comparisonData && (
              <Line 
                type="monotone" 
                dataKey="accuracyComp" 
                stroke={colors.info} 
                strokeWidth={3}
                strokeDasharray="5 5"
                name={`${t('analytics.accuracy')} (${comparisonData.year})`}
                dot={{ fill: colors.info, strokeWidth: 2, r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Hazard Types Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {t('analytics.hazardDistribution')}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hazardTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {hazardTypeData?.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {hazardTypeData?.map((hazard, index) => (
              <div key={hazard.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span className="font-medium text-gray-700 capitalize">
                    {hazard.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{hazard.value.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">({hazard.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Severity Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {t('analytics.severityBreakdown')}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="level" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar 
              dataKey="count" 
              fill={colors.primary} 
              name={t('analytics.count')}
              radius={[4, 4, 0, 0]}
            />
            
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke={colors.warning}
              fill={colors.warning}
              fillOpacity={0.3}
              name={t('analytics.avgResponseTime')}
            />
            
            {showComparison && comparisonData && (
              <Area
                type="monotone"
                dataKey="responseTimeComp"
                stroke={colors.info}
                fill={colors.info}
                fillOpacity={0.2}
                strokeDasharray="5 5"
                name={`${t('analytics.avgResponseTime')} (${comparisonData.year})`}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Seasonal Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {t('analytics.seasonalAnalysis')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {yearData.seasonalTrends.map((season) => (
            <div key={season.season} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">{season.season}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('analytics.reports')}:</span>
                  <span className="font-medium">{season.reports.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('analytics.avgSeverity')}:</span>
                  <span className="font-medium">{season.avgSeverity.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('analytics.responseTime')}:</span>
                  <span className="font-medium">{season.responseTime.toFixed(1)}h</span>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600 text-xs">{t('analytics.dominantHazards')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {season.dominantHazards.map((hazard, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {hazard.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
