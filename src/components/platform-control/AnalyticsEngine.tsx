
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Plus,
  Download,
  Eye
} from 'lucide-react';

export const AnalyticsEngine = () => {
  const analyticsMetrics = [
    { 
      title: 'Total Sessions', 
      value: '847,392', 
      change: '+18.7%', 
      icon: Activity, 
      trend: 'up'
    },
    { 
      title: 'Active Users', 
      value: '12,847', 
      change: '+24.3%', 
      icon: Users, 
      trend: 'up'
    },
    { 
      title: 'Conversion Rate', 
      value: '12.4%', 
      change: '+2.1%', 
      icon: TrendingUp, 
      trend: 'up'
    },
    { 
      title: 'Data Points', 
      value: '8.4M', 
      change: '+31.2%', 
      icon: BarChart3, 
      trend: 'up'
    }
  ];

  const reports = [
    { 
      id: 1, 
      name: 'User Behavior Analysis',
      type: 'Behavioral', 
      status: 'ready',
      lastRun: '2 hours ago',
      insights: 23
    },
    { 
      id: 2, 
      name: 'Performance Dashboard',
      type: 'Performance', 
      status: 'running',
      lastRun: '1 day ago',
      insights: 18
    },
    { 
      id: 3, 
      name: 'Revenue Analytics',
      type: 'Financial', 
      status: 'ready',
      lastRun: '3 hours ago',
      insights: 31
    }
  ];

  const insights = [
    { 
      id: 1, 
      insight: 'Mobile traffic increased by 34%',
      impact: 'high', 
      category: 'Traffic',
      time: '1 hour ago'
    },
    { 
      id: 2, 
      insight: 'Peak usage time shifted to 2PM',
      impact: 'medium', 
      category: 'Usage',
      time: '3 hours ago'
    },
    { 
      id: 3, 
      insight: 'Feature adoption rate improved',
      impact: 'high', 
      category: 'Product',
      time: '1 day ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Analytics Engine</h1>
          <p className="text-gray-600">Advanced data analytics and business intelligence</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    {metric.change} from last period
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span>Analytics Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-blue-100">
                    <BarChart3 className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.type} • {report.insights} insights</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      report.status === 'ready' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {report.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{report.lastRun}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Eye className="w-5 h-5 text-gray-600" />
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${
                      insight.impact === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{insight.insight}</h4>
                    <p className="text-sm text-gray-600">{insight.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      insight.impact === 'high' ? 'text-red-700 border-red-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {insight.impact} impact
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{insight.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
