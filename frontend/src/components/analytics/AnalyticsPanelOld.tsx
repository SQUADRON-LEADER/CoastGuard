import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  MapPin,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { AnalyticsData, HazardType } from '../../types';
import { ApiService } from '../../services/api';
import { YearSelector } from './YearSelector';
import { YearlyAnalyticsCharts } from './YearlyAnalyticsCharts';
import { getYearData, getAvailableYears } from '../../data/yearlyAnalytics';

const AnalyticsPanel: React.FC = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Yearly analytics state
  const [viewMode, setViewMode] = useState<'realtime' | 'yearly'>('realtime');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [comparisonYear, setComparisonYear] = useState<number | undefined>(undefined);
  const [showComparison, setShowComparison] = useState(false);

    // Load analytics data from API
  const loadAnalytics = async (selectedTimeRange: string = timeRange) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading analytics data...');
      const data = await ApiService.getAnalytics(selectedTimeRange);
      console.log('Analytics data loaded:', data);
      
      const processedData: AnalyticsData = {
        totalReports: data.totalReports ?? 0,
        verifiedReports: data.verifiedReports ?? 0,
        activeUsers: data.activeUsers ?? 0,
        responseTime: data.responseTime ?? 0,
        hazardDistribution: (data.hazardDistribution || []).map(item => ({
          type: String(item.type || 'unknown'),
          count: Number(item.count || 0),
          percentage: Number(item.percentage || 0)
        })),
        trends: data.trends || [],
        locationHotspots: data.locationHotspots || []
      };
      
      setAnalytics(processedData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      console.log('Using empty data instead');
      setError('Failed to load real-time data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and time range change
  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const refreshData = async () => {
    await loadAnalytics();
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const verificationRate = analytics
    ? ((analytics.verifiedReports / (analytics.totalReports || 1)) * 100).toFixed(1)
    : '0.0';
  const avgResponseTime = analytics ? analytics.responseTime.toFixed(1) : '0.0';

  console.log('AnalyticsPanel rendering with data:', analytics);
  console.log('isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('analytics.title')}</h2>
            <p className="text-gray-600">{t('analytics.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">{t('analytics.timeRange.24h')}</option>
            <option value="7d">{t('analytics.timeRange.7d')}</option>
            <option value="30d">{t('analytics.timeRange.30d')}</option>
            <option value="90d">{t('analytics.timeRange.90d')}</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Analytics View</h3>
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('realtime')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'realtime'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Real-time Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'yearly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly Analytics
            </motion.button>
          </div>
        </div>
      </div>

      {/* Yearly Analytics View */}
      {viewMode === 'yearly' && (
        <>
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            comparisonYear={comparisonYear}
            onComparisonYearChange={setComparisonYear}
            showComparison={showComparison}
            onToggleComparison={() => setShowComparison(!showComparison)}
          />
          
          <YearlyAnalyticsCharts
            yearData={getYearData(selectedYear)!}
            comparisonData={comparisonYear ? getYearData(comparisonYear) : undefined}
            showComparison={showComparison}
          />
        </>
      )}

      {/* Real-time Analytics View */}
      {viewMode === 'realtime' && (
        <>
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('realtime')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'realtime'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <span>Real-time</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'yearly'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Yearly Analytics</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Yearly Analytics View */}
      {viewMode === 'yearly' && (
        <>
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            comparisonYear={comparisonYear}
            onComparisonYearChange={setComparisonYear}
            showComparison={showComparison}
            onToggleComparison={() => setShowComparison(!showComparison)}
          />
          {(() => {
            const yearData = getYearData(selectedYear);
            const comparisonData = comparisonYear ? getYearData(comparisonYear) : undefined;
            
            if (!yearData) {
              return (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Data Available</h3>
                  <p className="text-gray-500">Data for {selectedYear} is not available.</p>
                </div>
              );
            }

            return (
              <YearlyAnalyticsCharts
                yearData={yearData}
                comparisonData={comparisonData}
                showComparison={showComparison && !!comparisonData}
              />
            );
          })()}
        </>
      )}

      {/* Real-time Analytics View */}
      {viewMode === 'realtime' && (
        <>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: t('analytics.metrics.totalReports'), 
            value: (analytics?.totalReports ?? 0).toLocaleString(), 
            icon: BarChart3, 
            color: 'from-blue-600 to-teal-600',
            change: '+12%',
            trend: 'up'
          },
          { 
            title: t('analytics.metrics.verifiedReports'), 
            value: (analytics?.verifiedReports ?? 0).toLocaleString(), 
            icon: CheckCircle, 
            color: 'from-green-600 to-emerald-600',
            change: `${verificationRate}%`,
            trend: 'up'
          },
          { 
            title: t('analytics.metrics.activeUsers'), 
            value: (analytics?.activeUsers ?? 0).toLocaleString(), 
            icon: Users, 
            color: 'from-purple-600 to-indigo-600',
            change: '+8%',
            trend: 'up'
          },
          { 
            title: t('analytics.metrics.avgResponseTime'), 
            value: `${avgResponseTime}h`, 
            icon: Clock, 
            color: 'from-orange-600 to-red-600',
            change: '-15%',
            trend: 'down'
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Platform Activity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.trends ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="reports" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="Reports"
              />
              <Area 
                type="monotone" 
                dataKey="verifications" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Verifications"
              />
              <Area 
                type="monotone" 
                dataKey="communityEngagement" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.6}
                name="Community Engagement"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hazard Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Hazard Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.hazardDistribution ?? []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percentage }) => {
                  const displayName = typeof name === 'string' ? name.replace('_', ' ') : String(name || 'Unknown');
                  return `${displayName} ${percentage?.toFixed(1) || 0}%`;
                }}
              >
                {(analytics?.hazardDistribution ?? []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Location Hotspots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">High-Activity Locations</h3>
          <div className="space-y-3">
            {(analytics?.locationHotspots ?? []).map((location, index) => (
              <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{location.location}</h4>
                    <p className="text-sm text-gray-600">{location.reportCount} reports</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      location.severity > 7 ? 'bg-red-500' :
                      location.severity > 5 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{location.severity.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Real-time Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New report verified', user: 'Dr. Raj Patel', time: '2 min ago', type: 'success' },
              { action: 'Critical alert posted', user: 'Anita Kumar', time: '5 min ago', type: 'urgent' },
              { action: 'Community milestone reached', user: 'System', time: '12 min ago', type: 'info' },
              { action: 'Oil spill report flagged', user: 'Environmental Team', time: '18 min ago', type: 'warning' },
              { action: 'New user registered', user: 'Coastal Community', time: '25 min ago', type: 'info' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'urgent' ? 'bg-red-500' :
                  activity.type === 'warning' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPanel;