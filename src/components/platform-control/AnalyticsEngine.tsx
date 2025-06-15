
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  DollarSign,
  Activity,
  Eye,
  Target,
  Zap,
  Globe,
  Filter,
  Settings
} from 'lucide-react';

export const AnalyticsEngine = () => {
  const analyticsMetrics = [
    { title: 'Total Sessions', value: '2.4M', change: '+24.8%', icon: Activity, color: 'from-blue-400 to-blue-600' },
    { title: 'Revenue Growth', value: '+$1.2M', change: '+31.7%', icon: DollarSign, color: 'from-emerald-400 to-emerald-600' },
    { title: 'User Engagement', value: '89.3%', change: '+12.4%', icon: Users, color: 'from-purple-400 to-purple-600' },
    { title: 'Conversion Rate', value: '18.7%', change: '+5.2%', icon: Target, color: 'from-orange-400 to-orange-600' },
    { title: 'API Performance', value: '99.8%', change: '+0.3%', icon: Zap, color: 'from-green-400 to-green-600' },
    { title: 'Global Reach', value: '145', change: '+23', icon: Globe, color: 'from-indigo-400 to-indigo-600' }
  ];

  const reports = [
    { 
      id: 1, 
      name: 'Client Usage Analytics', 
      type: 'Usage', 
      lastRun: '2 hours ago', 
      status: 'completed',
      insights: 'API usage increased 23% this month',
      trend: 'up'
    },
    { 
      id: 2, 
      name: 'Revenue Deep Dive', 
      type: 'Financial', 
      lastRun: '1 day ago', 
      status: 'completed',
      insights: 'Enterprise tier driving 67% of revenue',
      trend: 'up'
    },
    { 
      id: 3, 
      name: 'Performance Metrics', 
      type: 'Technical', 
      lastRun: '6 hours ago', 
      status: 'running',
      insights: 'Response time improved by 15ms',
      trend: 'up'
    },
    { 
      id: 4, 
      name: 'Customer Satisfaction', 
      type: 'Operations', 
      lastRun: '3 hours ago', 
      status: 'completed',
      insights: 'CSAT score increased to 4.8/5',
      trend: 'up'
    },
    { 
      id: 5, 
      name: 'Security Analysis', 
      type: 'Security', 
      lastRun: '12 hours ago', 
      status: 'completed',
      insights: 'Zero security incidents this week',
      trend: 'stable'
    },
    { 
      id: 6, 
      name: 'Growth Forecast', 
      type: 'Predictive', 
      lastRun: '1 day ago', 
      status: 'completed',
      insights: 'Projected 40% growth next quarter',
      trend: 'up'
    }
  ];

  const topInsights = [
    {
      title: 'Peak Usage Pattern Identified',
      description: 'API calls peak at 2-4 PM EST daily, consider auto-scaling',
      impact: 'High',
      category: 'Performance'
    },
    {
      title: 'Enterprise Client Expansion',
      description: '67% of enterprise clients are under-utilizing their plans',
      impact: 'Medium',
      category: 'Revenue'
    },
    {
      title: 'Regional Growth Opportunity',
      description: 'EU market showing 45% higher engagement rates',
      impact: 'High',
      category: 'Growth'
    },
    {
      title: 'Feature Adoption Insight',
      description: 'Analytics dashboard is most requested feature',
      impact: 'Medium',
      category: 'Product'
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Intelligence Engine</h1>
          </div>
          <p className="text-gray-600 ml-12">Advanced data insights and predictive analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Custom Filters
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
            <Settings className="w-4 h-4 mr-2" />
            Build Report
          </Button>
        </div>
      </div>

      {/* Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">{metric.change} from last month</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Intelligent Reports */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Intelligent Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{report.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                      <span>Type: {report.type}</span>
                      <span>•</span>
                      <span>Last run: {report.lastRun}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1 font-medium">{report.insights}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={report.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI-Powered Insights */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>AI-Powered Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topInsights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        insight.impact === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      {insight.impact} Impact
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                      {insight.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
            <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Generate More Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Analytics Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Calendar className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-semibold">Custom Date Range</span>
              <span className="text-xs text-gray-500">Set time periods</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Download className="w-8 h-8 mb-2 text-green-600" />
              <span className="font-semibold">Export Data</span>
              <span className="text-xs text-gray-500">Download reports</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Target className="w-8 h-8 mb-2 text-purple-600" />
              <span className="font-semibold">Set KPI Goals</span>
              <span className="text-xs text-gray-500">Track objectives</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Eye className="w-8 h-8 mb-2 text-orange-600" />
              <span className="font-semibold">Real-time Monitor</span>
              <span className="text-xs text-gray-500">Live dashboards</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
