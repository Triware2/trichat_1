
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar as CalendarIcon, 
  Clock,
  Users,
  MessageSquare,
  Star,
  Filter
} from 'lucide-react';

export const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>({});
  const [agentStats, setAgentStats] = useState<any[]>([]);
  const { toast } = useToast();

  // Generate dynamic data based on date range
  const generateReportData = (range: string) => {
    const multiplier = range === '1day' ? 0.3 : range === '7days' ? 1 : range === '30days' ? 3.5 : 10;
    
    const baseData = {
      totalChats: Math.floor(356 * multiplier),
      resolvedChats: Math.floor(310 * multiplier),
      avgResponseTime: range === '1day' ? '1.8m' : range === '7days' ? '2.3m' : '2.7m',
      avgResolutionTime: range === '1day' ? '6.2m' : range === '7days' ? '8.5m' : '9.8m',
      customerSatisfaction: range === '1day' ? 96 : range === '7days' ? 94 : 92,
      agentUtilization: range === '1day' ? 91 : range === '7days' ? 87 : 84
    };

    const baseAgentStats = [
      {
        name: "Sarah Johnson",
        totalChats: Math.floor(45 * multiplier),
        resolved: Math.floor(41 * multiplier),
        avgResponse: range === '1day' ? "1.0m" : "1.2m",
        satisfaction: 96,
        status: "Excellent"
      },
      {
        name: "Mike Chen",
        totalChats: Math.floor(58 * multiplier),
        resolved: Math.floor(53 * multiplier),
        avgResponse: range === '1day' ? "1.9m" : "2.1m",
        satisfaction: 94,
        status: "Good"
      },
      {
        name: "Emily Rodriguez",
        totalChats: Math.floor(38 * multiplier),
        resolved: Math.floor(36 * multiplier),
        avgResponse: range === '1day' ? "1.3m" : "1.5m",
        satisfaction: 98,
        status: "Excellent"
      },
      {
        name: "David Kim",
        totalChats: Math.floor(28 * multiplier),
        resolved: Math.floor(25 * multiplier),
        avgResponse: range === '1day' ? "2.8m" : "3.2m",
        satisfaction: 91,
        status: "Average"
      }
    ];

    setPerformanceData(baseData);
    setAgentStats(baseAgentStats);
    console.log('Generated report data for range:', range, baseData);
  };

  useEffect(() => {
    generateReportData(dateRange);
  }, [dateRange]);

  const categoryBreakdown = [
    { category: "Technical Support", count: Math.floor(387 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)), percentage: 31 },
    { category: "Billing", count: Math.floor(298 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)), percentage: 24 },
    { category: "Product Inquiry", count: Math.floor(224 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)), percentage: 18 },
    { category: "Account Issues", count: Math.floor(186 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)), percentage: 15 },
    { category: "General", count: Math.floor(152 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)), percentage: 12 }
  ];

  const hourlyDistribution = [
    { hour: "9 AM", chats: Math.floor(45 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "10 AM", chats: Math.floor(67 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "11 AM", chats: Math.floor(89 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "12 PM", chats: Math.floor(102 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "1 PM", chats: Math.floor(95 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "2 PM", chats: Math.floor(78 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "3 PM", chats: Math.floor(124 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "4 PM", chats: Math.floor(156 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) },
    { hour: "5 PM", chats: Math.floor(89 * (dateRange === '1day' ? 0.3 : dateRange === '7days' ? 1 : dateRange === '30days' ? 3.5 : 10)) }
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
    const dateRangeText = dateRange === 'custom' && customStartDate && customEndDate 
      ? `${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`
      : dateRange === '1day' ? 'Last 24 Hours'
      : dateRange === '7days' ? 'Last 7 Days'
      : dateRange === '30days' ? 'Last 30 Days'
      : 'Last 3 Months';

    // Simulate file download
    const reportData = {
      dateRange: dateRangeText,
      performanceData,
      agentStats,
      categoryBreakdown,
      hourlyDistribution,
      generatedAt: new Date().toISOString()
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: format === 'pdf' ? 'application/pdf' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support-report-${dateRange}.${format === 'pdf' ? 'pdf' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: `${format.toUpperCase()} Export Complete`,
      description: `Report downloaded for ${dateRangeText}`,
    });
    
    console.log('Exported report:', format, reportData);
  };

  const handleCustomDate = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
      generateReportData('custom');
      toast({
        title: "Custom Date Range Applied",
        description: `Report updated for ${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`,
      });
    } else {
      toast({
        title: "Select Date Range",
        description: "Please select both start and end dates",
      });
    }
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    toast({
      title: "Date Range Updated",
      description: `Report data updated for ${range === '1day' ? 'Last 24 Hours' : range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'Last 3 Months'}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white z-10"
          >
            <option value="1day">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateRange === 'custom' && (
            <div className="flex gap-2 items-center">
              <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {customStartDate ? format(customStartDate, 'MMM dd') : 'Start Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={(date) => {
                      setCustomStartDate(date);
                      setShowStartCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {customEndDate ? format(customEndDate, 'MMM dd') : 'End Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={(date) => {
                      setCustomEndDate(date);
                      setShowEndCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button size="sm" onClick={handleCustomDate}>
                Apply
              </Button>
            </div>
          )}
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
                    <p className="text-sm text-gray-400">Data range: {dateRange}</p>
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
                    <p className="text-sm text-gray-400">Data range: {dateRange}</p>
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
              <CardDescription>Detailed metrics for each team member ({dateRange})</CardDescription>
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
              <CardDescription>Distribution of support requests by category ({dateRange})</CardDescription>
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
              <CardDescription>Chat volume by hour of day ({dateRange})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyDistribution.map((hour, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600">{hour.hour}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                        style={{ width: `${Math.min((hour.chats / Math.max(...hourlyDistribution.map(h => h.chats))) * 100, 100)}%` }}
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
