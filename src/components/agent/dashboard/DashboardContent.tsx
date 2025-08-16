import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { Search, Filter, Star, TrendingUp, MessageSquare, Award, UserCircle, Plus, RefreshCw, Download, Target, Clock, CheckCircle, Activity, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardContentProps {
  stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }>;
  agentName: string;
  activities: Array<{
    customer: string;
    action: string;
    time: string;
    type: string;
  }>;
  feedback: {
    csat: number;
    dsat: number;
    totalResponses: number;
    recentFeedback: Array<{
      rating: number;
      feedback: string;
      customer: string;
      date: string;
    }>;
  };
  onStatClick: (statTitle: string) => void;
  onQueueAction: (chatId: string) => void;
  queue: any[];
  todayPerformance: any;
}

export const DashboardContent = ({ 
  stats, 
  agentName,
  activities, 
  feedback,
  onStatClick, 
  onQueueAction,
  queue,
  todayPerformance
}: DashboardContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleGlobalSearch = () => {
    if (searchQuery.trim()) {
      console.log('Global search for:', searchQuery);
      // Global search functionality would be implemented here
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-[#11b890]/5 to-[#11b890]/10">
      {/* Professional Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-xl shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-sm text-slate-600 mt-1">Real-time insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh dashboard data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 py-8 space-y-8 pb-16">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onStatClick(stat.title)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-xl shadow-lg">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-lg font-semibold text-slate-700">{stat.title}</p>
                  <p className="text-sm text-slate-500">vs last month</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-lg">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Performance Metrics</CardTitle>
                  <CardDescription className="text-slate-600">Your key performance indicators and achievements</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* CSAT Score */}
              <div className="bg-gradient-to-br from-[#11b890]/10 to-[#11b890]/5 border border-[#11b890]/20 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-[#11b890]" />
                  <span className="text-sm font-medium text-[#11b890]">CSAT Score</span>
                </div>
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      stroke="#11b890" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="219.9" 
                      strokeDashoffset={`${219.9 * (1 - feedback.csat / 100)}`} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900">{feedback.csat.toFixed(1)}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 text-center">Customer satisfaction</p>
              </div>

              {/* DSAT Score */}
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">DSAT Score</span>
                </div>
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      stroke="#dc2626" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="219.9" 
                      strokeDashoffset={`${219.9 * (1 - feedback.dsat / 100)}`} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900">{feedback.dsat.toFixed(1)}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 text-center">Customer dissatisfaction</p>
              </div>

              {/* Total Responses */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Total Responses</span>
                </div>
                <p className="text-3xl font-bold text-blue-900 text-center mb-2">{feedback.totalResponses}</p>
                <p className="text-xs text-blue-600 text-center">All time responses</p>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/60 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Avg. Response Time</span>
                </div>
                <p className="text-3xl font-bold text-purple-900 text-center mb-2">{todayPerformance.avgResponse || '2.5 min'}</p>
                <p className="text-xs text-purple-600 text-center">Today's average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Feedback - Full Width on Mobile, 2/3 on Desktop */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl h-fit">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-lg">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Recent Feedback</CardTitle>
                    <CardDescription className="text-slate-600">Latest customer satisfaction responses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {feedback.recentFeedback && feedback.recentFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {feedback.recentFeedback.map((fb, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-slate-50/50 to-[#11b890]/5 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {getRatingStars(fb.rating)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {fb.date}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 mb-2 italic">"{fb.feedback}"</p>
                        <p className="text-xs font-medium text-slate-600">— {fb.customer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No feedback yet</h3>
                    <p className="text-slate-600">Customer feedback will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Queue & Activity */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl h-fit">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-lg">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">My Queue</CardTitle>
                    <CardDescription className="text-slate-600">Active conversations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {queue && queue.length > 0 ? (
                  <div className="space-y-3">
                    {queue.slice(0, 3).map((chat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50/50 to-[#11b890]/5 rounded-xl border border-slate-200">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {chat.customer}
                          </h4>
                          <p className="text-xs text-slate-600 truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <Badge variant={chat.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                            {chat.priority}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-white hover:bg-[#11b890]/10 border-[#11b890]/30"
                            onClick={() => onQueueAction(String(chat.id))}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-slate-900 mb-2">No active chats</h3>
                    <p className="text-xs text-slate-600">New conversations will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl h-fit">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
                    <CardDescription className="text-slate-600">Latest actions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {activities && activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.slice(0, 4).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl border border-slate-200">
                        <div className="flex-shrink-0 mt-0.5">
                          {activity.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-[#11b890]" />
                          ) : activity.type === 'warning' ? (
                            <Clock className="w-4 h-4 text-amber-600" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 font-medium">
                            <span className="font-semibold">{activity.customer}</span> - {activity.action}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-slate-900 mb-2">No recent activity</h3>
                    <p className="text-xs text-slate-600">Your actions will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-Width Recent Activity Section for Mobile */}
        <div className="lg:hidden">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};
