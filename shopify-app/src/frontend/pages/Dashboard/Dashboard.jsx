import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext.js';
import { useChat } from '../../contexts/ChatContext.js';
import { api } from '../../services/api.js';
import StatCard from '../../components/Dashboard/StatCard.jsx';
import RecentConversations from '../../components/Dashboard/RecentConversations.jsx';
import ActivityChart from '../../components/Dashboard/ActivityChart.jsx';
import QuickActions from '../../components/Dashboard/QuickActions.jsx';
import Loading from '../../components/Common/Loading.jsx';

const Dashboard = () => {
  const { shop } = useAuth();
  const { socket } = useChat();
  const [realTimeStats, setRealTimeStats] = useState({
    activeConversations: 0,
    unreadMessages: 0,
    onlineAgents: 0
  });

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error, refetch } = useQuery(
    ['dashboard', shop],
    () => api.get('/api/admin/dashboard'),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000,
    }
  );

  // Fetch recent conversations
  const { data: recentConversations } = useQuery(
    ['recent-conversations', shop],
    () => api.get('/api/chat/conversations?limit=5'),
    {
      refetchInterval: 15000, // Refetch every 15 seconds
    }
  );

  // Fetch analytics data
  const { data: analyticsData } = useQuery(
    ['analytics', shop],
    () => api.get('/api/analytics?period=7d'),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for real-time updates
    socket.on('stats-update', (stats) => {
      setRealTimeStats(stats);
    });

    socket.on('new-conversation', () => {
      refetch();
      toast.success('New conversation started!');
    });

    socket.on('new-message', () => {
      refetch();
    });

    return () => {
      socket.off('stats-update');
      socket.off('new-conversation');
      socket.off('new-message');
    };
  }, [socket, refetch]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || 'Something went wrong while loading the dashboard.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const analytics = analyticsData?.data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your chat support.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatCard
            title="Total Conversations"
            value={stats.totalConversations || 0}
            change={analytics.conversationsGrowth || 0}
            icon={MessageSquare}
            color="blue"
            trend="up"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Active Conversations"
            value={realTimeStats.activeConversations || stats.activeConversations || 0}
            change={analytics.activeGrowth || 0}
            icon={Activity}
            color="green"
            trend="up"
            isLive
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Unread Messages"
            value={realTimeStats.unreadMessages || stats.unreadMessages || 0}
            change={analytics.unreadGrowth || 0}
            icon={AlertCircle}
            color="orange"
            trend="up"
            isLive
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard
            title="Avg Response Time"
            value={`${stats.averageResponseTime || 0}m`}
            change={analytics.responseTimeChange || 0}
            icon={Clock}
            color="purple"
            trend="down"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Activity Overview</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Conversations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Messages</span>
                </div>
              </div>
            </div>
            <ActivityChart data={analytics.activityData || []} />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <QuickActions />
          </motion.div>
        </div>
      </div>

      {/* Recent Conversations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
          <a
            href="/conversations"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </a>
        </div>
        <RecentConversations 
          conversations={recentConversations?.conversations || []}
          isLoading={!recentConversations}
        />
      </motion.div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chat Widget</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Webhooks</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-gray-900">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-gray-900">120ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-gray-900">0.01%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity?.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{activity.description}</span>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 