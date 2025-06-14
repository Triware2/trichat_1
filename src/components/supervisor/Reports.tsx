
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Clock,
  Users,
  MessageSquare,
  Star,
  Filter
} from 'lucide-react';

export const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  const performanceData = {
    totalChats: 1247,
    resolvedChats: 1089,
    avgResponseTime: '2.3m',
    avgResolutionTime: '8.5m',
    customerSatisfaction: 94,
    agentUtilization: 87
  };

  const agentStats = [
    {
      name: "Sarah Johnson",
      totalChats: 156,
      resolved: 142,
      avgResponse: "1.2m",
      satisfaction: 96,
      status: "Excellent"
    },
    {
      name: "Mike Chen",
      totalChats: 203,
      resolved: 185,
      avgResponse: "2.1m",
      satisfaction: 94,
      status: "Good"
    },
    {
      name: "Emily Rodriguez",
      totalChats: 134,
      resolved: 128,
      avgResponse: "1.5m",
      satisfaction: 98,
      status: "Excellent"
    },
    {
      name: "David Kim",
      totalChats: 98,
      resolved: 89,
      avgResponse: "3.2m",
      satisfaction: 91,
      status: "Average"
    }
  ];

  const categoryBreakdown = [
    { category: "Technical Support", count: 387, percentage: 31 },
    { category: "Billing", count: 298, percentage: 24 },
    { category: "Product Inquiry", count: 224, percentage: 18 },
    { category: "Account Issues", count: 186, percentage: 15 },
    { category: "General", count: 152, percentage: 12 }
  ];

  const hourlyDistribution = [
    { hour: "9 AM", chats: 45 },
    { hour: "10 AM", chats: 67 },
    { hour: "11 AM", chats: 89 },
    { hour: "12 PM", chats: 102 },
    { hour: "1 PM", chats: 95 },
    { hour: "2 PM", chats: 78 },
    { hour: "3 PM", chats: 124 },
    { hour: "4 PM", chats: 156 },
    { hour: "5 PM", chats: 89 }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Excellent': 'default',
      'Good': 'secondary',
      'Average': 'outline'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`);
    // Implementation would generate and download the report
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="1day">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Date
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Chats</p>
                    <p className="text-2xl font-bold">{performanceData.totalChats}</p>
                  </div>
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold">{performanceData.resolvedChats}</p>
                  </div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold">{performanceData.avgResponseTime}</p>
                  </div>
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Resolution</p>
                    <p className="text-2xl font-bold">{performanceData.avgResolutionTime}</p>
                  </div>
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                    <p className="text-2xl font-bold">{performanceData.customerSatisfaction}%</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilization</p>
                    <p className="text-2xl font-bold">{performanceData.agentUtilization}%</p>
                  </div>
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Volume Trend</CardTitle>
                <CardDescription>Daily chat volume over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Distribution</CardTitle>
                <CardDescription>Response time breakdown by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Agent Performance</CardTitle>
              <CardDescription>Detailed metrics for each team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentStats.map((agent, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      {getStatusBadge(agent.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Chats</p>
                        <p className="font-medium">{agent.totalChats}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Resolved</p>
                        <p className="font-medium">{agent.resolved}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Response</p>
                        <p className="font-medium">{agent.avgResponse}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Satisfaction</p>
                        <p className="font-medium">{agent.satisfaction}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Resolution Rate</p>
                        <p className="font-medium">{Math.round((agent.resolved / agent.totalChats) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Categories Breakdown</CardTitle>
              <CardDescription>Distribution of support requests by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm text-gray-600">{category.count} tickets</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-lg font-bold">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Distribution</CardTitle>
              <CardDescription>Chat volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyDistribution.map((hour, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600">{hour.hour}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                        style={{ width: `${(hour.chats / 156) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-medium text-right">{hour.chats}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
