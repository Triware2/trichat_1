
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Server,
  Clock,
  Users,
  BarChart3,
  Bell,
  Settings
} from 'lucide-react';

export const UsageMonitoring = () => {
  const [timeRange, setTimeRange] = useState('24h');

  const usageStats = [
    { title: 'API Calls (24h)', value: '1.2M', limit: '2M', usage: 60, trend: '+15%' },
    { title: 'Active Users', value: '18,392', limit: '25,000', usage: 73, trend: '+8%' },
    { title: 'Storage Used', value: '847 GB', limit: '1.5 TB', usage: 56, trend: '+12%' },
    { title: 'Bandwidth', value: '234 GB', limit: '500 GB', usage: 47, trend: '+5%' }
  ];

  const alerts = [
    { id: 1, severity: 'high', message: 'Client ABC Corp exceeding API rate limits', time: '2 min ago' },
    { id: 2, severity: 'medium', message: 'Storage usage approaching 80% capacity', time: '15 min ago' },
    { id: 3, severity: 'low', message: 'Bandwidth spike detected in EU region', time: '1 hour ago' }
  ];

  const topUsers = [
    { name: 'Enterprise Corp', usage: '450K calls', percentage: 85, status: 'warning' },
    { name: 'Tech Solutions', usage: '320K calls', percentage: 65, status: 'normal' },
    { name: 'Global Industries', usage: '280K calls', percentage: 58, status: 'normal' },
    { name: 'Innovation Labs', usage: '195K calls', percentage: 42, status: 'normal' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usage Monitoring & Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of platform usage and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
          <Button size="sm" className="bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {usageStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Limit: {stat.limit}</span>
                    <span className="font-medium">{stat.usage}%</span>
                  </div>
                  <Progress 
                    value={stat.usage} 
                    className={`h-2 ${stat.usage > 80 ? 'bg-red-100' : 'bg-blue-100'}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Alerts</span>
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                {alerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-white">
                <div className="p-1 rounded-full bg-red-100">
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.severity === 'high' ? 'text-red-600' :
                    alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Top Users by Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.usage}</p>
                  </div>
                  <Badge className={
                    user.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }>
                    {user.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium">{user.percentage}%</span>
                  </div>
                  <Progress 
                    value={user.percentage} 
                    className={`h-2 ${user.percentage > 80 ? 'bg-yellow-100' : 'bg-blue-100'}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
