import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../services/api';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Eye,
  Calendar,
  Brain,
  TrendingUp,
  AlertTriangle,
  Zap,
  Activity,
  Globe,
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { AnalyticsData } from '../../types';
import { ApiService } from '../../services/api';
import { YearSelector } from './YearSelector';
import { YearlyAnalyticsCharts } from './YearlyAnalyticsCharts';
import { getYearData } from '../../data/yearlyAnalytics';

const AnalyticsPanel: React.FC = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  
  // Yearly analytics state
  const [viewMode, setViewMode] = useState<'realtime' | 'yearly'>('realtime');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [comparisonYear, setComparisonYear] = useState<number | undefined>(undefined);
  const [showComparison, setShowComparison] = useState(false);

  // ── Real-time disaster data state ──────────────────────────────────────────
  const [realtimeStats, setRealtimeStats] = useState<{
    total: number; critical: number; severe: number;
    byType: Record<string, number>; bySource: Record<string, number>;
  } | null>(null);
  const [aiInsights, setAiInsights] = useState<{
    summary: string;
    correlations: { title: string; insight: string; risk: string }[];
    riskZones: { zone: string; reason: string; level: string }[];
    recommendations: string[];
  } | null>(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [realtimeLoading, setRealtimeLoading] = useState(false);

  const loadRealtimeData = useCallback(async () => {
    setRealtimeLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/realtime-disasters`);
      const data = await res.json();
      setRealtimeStats(data.stats);
    } catch (_) {}
    finally { setRealtimeLoading(false); }
  }, []);

  const loadAiInsights = useCallback(async () => {
    setAiInsightsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-disaster-correlation`);
      const data = await res.json();
      if (data.success) setAiInsights(data.analysis);
    } catch (_) {}
    finally { setAiInsightsLoading(false); }
  }, []);

  useEffect(() => { loadRealtimeData(); loadAiInsights(); }, [loadRealtimeData, loadAiInsights]);

  // ── Load analytics data from API ──────────────────────────────────────────
  const loadAnalytics = useCallback(async (selectedTimeRange: string = timeRange) => {
    setIsLoading(true);
    try {
      const data = await ApiService.getAnalytics(selectedTimeRange);
      const processedData: AnalyticsData = {
        totalReports: data.totalReports ?? 0,
        verifiedReports: data.verifiedReports ?? 0,
        activeUsers: data.activeUsers ?? 0,
        responseTime: data.responseTime ?? 0,
        hazardDistribution: (data.hazardDistribution || []).map((item: {type?: string; count?: number; percentage?: number}) => ({
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
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, loadAnalytics]);

  const refreshData = async () => {
    await loadAnalytics();
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  const verificationRate = analytics
    ? ((analytics.verifiedReports / (analytics.totalReports || 1)) * 100).toFixed(1)
    : '0.0';
  const avgResponseTime = analytics ? analytics.responseTime.toFixed(1) : '0.0';

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ocean-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-ocean-700 rounded-xl">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ocean-800">{t('analytics.title')}</h2>
            <p className="text-ocean-500">{t('analytics.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {viewMode === 'realtime' && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d' | '90d')}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500"
            >
              <option value="24h">{t('analytics.timeRange.24h')}</option>
              <option value="7d">{t('analytics.timeRange.7d')}</option>
              <option value="30d">{t('analytics.timeRange.30d')}</option>
              <option value="90d">{t('analytics.timeRange.90d')}</option>
            </select>
          )}
          
          {viewMode === 'realtime' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ocean-800">Analytics View</h3>
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('realtime')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'realtime'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-ocean-500 hover:text-ocean-800'
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
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-ocean-500 hover:text-ocean-800'
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
          {/* ── Real-Time Global Disaster Intel Card ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-2xl p-5 border border-gray-700 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Live Global Disaster Intelligence</h3>
                  <p className="text-gray-400 text-xs">USGS · Open-Meteo Marine &amp; Flood · ReliefWeb · GDACS · Community</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { loadRealtimeData(); loadAiInsights(); }}
                  disabled={realtimeLoading || aiInsightsLoading}
                  className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${(realtimeLoading || aiInsightsLoading) ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* ── Live stats row ── */}
            {realtimeStats && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                <div className="bg-gray-800/70 rounded-xl p-2.5 text-center">
                  <p className="text-2xl font-bold text-white">{realtimeStats.total}</p>
                  <p className="text-gray-400 text-xs">Total Events</p>
                </div>
                <div className="bg-red-900/40 rounded-xl p-2.5 text-center">
                  <p className="text-2xl font-bold text-red-300">{realtimeStats.critical}</p>
                  <p className="text-gray-400 text-xs">Critical</p>
                </div>
                <div className="bg-orange-900/40 rounded-xl p-2.5 text-center">
                  <p className="text-2xl font-bold text-orange-300">{realtimeStats.severe}</p>
                  <p className="text-gray-400 text-xs">Severe</p>
                </div>
                {Object.entries(realtimeStats.byType).slice(0, 3).map(([type, cnt]) => (
                  <div key={type} className="bg-gray-800/70 rounded-xl p-2.5 text-center">
                    <p className="text-2xl font-bold text-cyan-300">{cnt as number}</p>
                    <p className="text-gray-400 text-xs capitalize truncate">{type.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── AI Correlation Insights ── */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-300" />
                <span className="text-white font-semibold text-sm">Gemini AI Correlation Analysis</span>
                {(aiInsightsLoading) && (
                  <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin ml-1" />
                )}
              </div>

              {aiInsights ? (
                <>
                  <p className="text-purple-200 text-xs leading-relaxed mb-3">{aiInsights.summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(aiInsights.correlations || []).slice(0, 4).map((c, i) => (
                      <div key={i} className="bg-gray-800/60 rounded-lg p-2 flex items-start gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-white text-xs font-semibold">{c.title}</span>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                              c.risk === 'CRITICAL' ? 'bg-red-900 text-red-300' :
                              c.risk === 'HIGH'     ? 'bg-orange-900 text-orange-300' :
                              c.risk === 'MEDIUM'   ? 'bg-yellow-900 text-yellow-300' :
                                                      'bg-green-900 text-green-300'
                            }`}>{c.risk}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{c.insight.substring(0, 100)}…</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(aiInsights.riskZones || []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-gray-400 text-xs font-semibold mr-1">⚠ High-Risk Zones:</span>
                      {aiInsights.riskZones.map((z, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          z.level === 'CRITICAL' ? 'bg-red-900/60 text-red-300' :
                          z.level === 'HIGH'     ? 'bg-orange-900/60 text-orange-300' :
                                                   'bg-yellow-900/60 text-yellow-300'
                        }`}>{z.zone}</span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400 text-xs">
                  {aiInsightsLoading ? 'Gemini AI is analysing live data streams…' : 'AI analysis unavailable. Check backend connection.'}
                </p>
              )}
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: t('analytics.metrics.totalReports'), 
                value: (analytics?.totalReports ?? 0).toLocaleString(), 
                icon: BarChart3, 
                color: 'bg-ocean-700',
                change: '+12%',
                trend: 'up'
              },
              { 
                title: t('analytics.metrics.verifiedReports'), 
                value: (analytics?.verifiedReports ?? 0).toLocaleString(), 
                icon: CheckCircle, 
                color: 'bg-emerald-600',
                change: `${verificationRate}%`,
                trend: 'up'
              },
              { 
                title: t('analytics.metrics.activeUsers'), 
                value: (analytics?.activeUsers ?? 0).toLocaleString(), 
                icon: Users, 
                color: 'bg-purple-600',
                change: '+8%',
                trend: 'up'
              },
              { 
                title: t('analytics.metrics.avgResponseTime'), 
                value: `${avgResponseTime}h`, 
                icon: Clock, 
                color: 'bg-coral-500',
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
                  <div className={`p-3 rounded-xl ${metric.color}`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-emerald-600 bg-green-100' : 'text-coral-600 bg-red-100'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-ocean-800 mb-1">{metric.value}</h3>
                <p className="text-ocean-500 text-sm">{metric.title}</p>
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
              <h3 className="text-xl font-bold text-ocean-800 mb-4">Platform Activity Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.trends ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="reports" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="verified" stackId="1" stroke="#10B981" fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Hazard Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-ocean-800 mb-4">Hazard Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.hazardDistribution ?? []}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                  >
                    {(analytics?.hazardDistribution ?? []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPanel;