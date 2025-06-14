
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  MessageSquare,
  Download,
  Filter
} from 'lucide-react';

export const CSATDashboard = () => {
  const trendData = [
    { month: 'Jan', csat: 4.1, nps: 32, responses: 245 },
    { month: 'Feb', csat: 4.2, nps: 38, responses: 267 },
    { month: 'Mar', csat: 4.3, nps: 45, responses: 289 },
    { month: 'Apr', csat: 4.1, nps: 41, responses: 312 },
    { month: 'May', csat: 4.4, nps: 48, responses: 298 },
    { month: 'Jun', csat: 4.3, nps: 45, responses: 334 }
  ];

  const departmentMetrics = [
    { department: 'Technical Support', csat: 4.5, nps: 52, responses: 156, trend: 'up' },
    { department: 'Billing', csat: 4.2, nps: 38, responses: 89, trend: 'down' },
    { department: 'Sales', csat: 4.6, nps: 58, responses: 124, trend: 'up' },
    { department: 'General Support', csat: 4.1, nps: 35, responses: 201, trend: 'neutral' }
  ];

  const agentPerformance = [
    { name: 'Sarah Johnson', csat: 4.8, nps: 67, responses: 45, department: 'Technical Support' },
    { name: 'Mike Chen', csat: 4.6, nps: 54, responses: 38, department: 'Technical Support' },
    { name: 'Emily Rodriguez', csat: 4.7, nps: 61, responses: 42, department: 'Sales' },
    { name: 'David Kim', csat: 4.3, nps: 41, responses: 33, department: 'Billing' },
    { name: 'Lisa Wang', csat: 4.5, nps: 49, responses: 39, department: 'General Support' }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average CSAT</p>
                <p className="text-3xl font-bold text-gray-900">4.3</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+0.2 from last month</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Promoter Score</p>
                <p className="text-3xl font-bold text-gray-900">45</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+8 from last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900">67%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+5% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+12% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CSAT Trends</CardTitle>
            <CardDescription>Customer satisfaction over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">CSAT trend chart would appear here</p>
                <div className="mt-4 space-y-2">
                  {trendData.slice(-3).map((data, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{data.month}</span>
                      <span className="font-medium">{data.csat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Customer sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Positive</span>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Neutral</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>CSAT and NPS by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentMetrics.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.department}</h4>
                    <p className="text-sm text-gray-600">{dept.responses} responses</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">CSAT</p>
                    <p className="text-lg font-semibold">{dept.csat}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">NPS</p>
                    <p className="text-lg font-semibold">{dept.nps}</p>
                  </div>
                  <div className={getTrendColor(dept.trend)}>
                    {getTrendIcon(dept.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
          <CardDescription>Highest CSAT scores this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-600">{agent.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">CSAT: {agent.csat}</p>
                    <p className="text-xs text-gray-600">NPS: {agent.nps}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {agent.responses} responses
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
