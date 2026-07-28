import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Users, TrendingUp, Clock, MapPin, BarChart3, Map, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import QuickActions from './QuickActions';
import { formatTimeAgo } from '../../lib/utils';

import { API_BASE_URL } from '../../services/api';

const API_BASE = API_BASE_URL;

const ProtectorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    pendingReports: 0,
    verifiedToday: 0,
    highPriority: 0,
    communityEngagement: 0,
  });
  const [topUpvotedReports, setTopUpvotedReports] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reports`);
        const data = await res.json();
        const uploads: any[] = Array.isArray(data) ? data : [];
        const today = new Date(); today.setHours(0, 0, 0, 0);
        setStatsData({
          pendingReports: uploads.filter(u => u.verificationStatus === 'pending').length,
          verifiedToday: uploads.filter(u => u.verificationStatus === 'verified' && new Date(u.verifiedAt || u.updatedAt) >= today).length,
          highPriority: uploads.filter(u => u.severity === 'severe' || u.severity === 'critical').length,
          communityEngagement: uploads.reduce((sum: number, u: any) => sum + (u.upvotes || 0), 0),
        });
        setTopUpvotedReports(
          uploads
            .sort((a: any, b: any) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)))
            .slice(0, 5)
        );
      } catch (e) {
        console.error('ProtectorDashboard: Failed to load reports', e);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Protector Dashboard 🛡️
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {user?.name}! Monitor and respond to community reports
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Pending Review', value: statsData.pendingReports, icon: Clock, color: 'from-yellow-600 to-orange-600', link: '/verify' },
            { title: 'Verified Today', value: statsData.verifiedToday, icon: CheckCircle, color: 'from-green-600 to-emerald-600', link: '/verify' },
            { title: 'High Priority', value: statsData.highPriority, icon: AlertTriangle, color: 'from-red-600 to-orange-600', link: '/verify' },
            { title: 'Community Votes', value: statsData.communityEngagement, icon: TrendingUp, color: 'from-blue-600 to-teal-600', link: '/community' },
          ].map((stat, index) => (
            <motion.a
              key={stat.title}
              href={stat.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.a>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-3">
            <QuickActions />
          </div>

          {/* Top Community Issues */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Top Community Issues</h3>
            <div className="space-y-4">
              {topUpvotedReports.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No reports yet</p>
              ) : topUpvotedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={report.thumbnailUrl || report.fileUrl}
                      alt={report.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm mb-1">{report.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{report.location.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {report.upvotes} votes
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                            report.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {report.verificationStatus}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{formatTimeAgo(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <a href="/analytics" className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Advanced Analytics</h3>
            </div>
            <p className="text-gray-600">Deep insights into platform performance and hazard trends</p>
          </a>
          
          <a href="/map" className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Map className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Hazard Mapping</h3>
            </div>
            <p className="text-gray-600">Interactive map with heatmaps and geospatial analysis</p>
          </a>
          
          <a href="/social" className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Social Monitoring</h3>
            </div>
            <p className="text-gray-600">Real-time social media intelligence and sentiment analysis</p>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ProtectorDashboard;