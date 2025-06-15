
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
  Eye
} from 'lucide-react';

export const AnalyticsReports = () => {
  const reports = [
    { id: 1, name: 'Client Usage Report', type: 'Usage', lastRun: '2 hours ago', status: 'completed' },
    { id: 2, name: 'Revenue Analytics', type: 'Financial', lastRun: '1 day ago', status: 'completed' },
    { id: 3, name: 'System Performance', type: 'Technical', lastRun: '6 hours ago', status: 'running' },
    { id: 4, name: 'Support Metrics', type: 'Operations', lastRun: '3 hours ago', status: 'completed' }
  ];

  const kpis = [
    { title: 'Total Revenue', value: '$127,430', change: '+8.2%', icon: DollarSign },
    { title: 'Active Clients', value: '2,847', change: '+12.5%', icon: Users },
    { title: 'API Calls', value: '1.2M', change: '+23.1%', icon: Activity },
    { title: 'System Uptime', value: '99.98%', change: '+0.01%', icon: TrendingUp }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and data analytics</p>
        </div>
        <Button className="bg-blue-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-green-600 font-medium">{kpi.change} from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-gray-600">Type: {report.type} • Last run: {report.lastRun}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {report.status}
                </Badge>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
