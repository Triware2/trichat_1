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
  Filter,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Award,
  TrendingDown,
  Eye,
  FileText,
  PieChart,
  LineChart,
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define proper interfaces
interface PerformanceData {
  totalChats: number;
  resolvedChats: number;
  avgResponseTime: string;
  avgResolutionTime: string;
  customerSatisfaction: number;
  agentUtilization: number;
  resolutionRate: number;
  firstResponseTime: string;
  slaCompliance: number;
}

interface AgentStats {
  id: string;
  name: string;
  department?: string;
  chatsHandled: number;
  avgResponse: string;
  csatScore: number;
  status: string;
  resolutionRate: number;
  totalHours: number;
}

interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  color: string;
  trend: number;
}

interface HourlyDistribution {
  hour: string;
  chats: number;
  avgResponseTime: number;
  satisfaction: number;
}

interface CSATData {
  overall: number;
  distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  trends: {
    thisWeek: number;
    lastWeek: number;
    monthlyAvg: number;
    growth: number;
  };
}

interface VolumeStats {
  dailyAverage: number;
  peakHour: number;
  totalThisWeek: number;
  growthRate: number;
  peakTime: string;
  totalThisMonth: number;
}

export const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalChats: 0,
    resolvedChats: 0,
    avgResponseTime: '0m',
    avgResolutionTime: '0m',
    customerSatisfaction: 0,
    agentUtilization: 0,
    resolutionRate: 0,
    firstResponseTime: '0m',
    slaCompliance: 0
  });
  const [agentStats, setAgentStats] = useState<AgentStats[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<HourlyDistribution[]>([]);
  const [csatData, setCSATData] = useState<CSATData>({
    overall: 0,
    distribution: [],
    trends: {
      thisWeek: 0,
      lastWeek: 0,
      monthlyAvg: 0,
      growth: 0
    }
  });
  const [volumeStats, setVolumeStats] = useState<VolumeStats>({
    dailyAverage: 0,
    peakHour: 0,
    totalThisWeek: 0,
    growthRate: 0,
    peakTime: '',
    totalThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper to get date range
  const getDateRange = () => {
    let start: Date, end: Date;
    end = new Date();
    if (dateRange === '1day') {
      start = new Date();
      start.setDate(end.getDate() - 1);
    } else if (dateRange === '7days') {
      start = new Date();
      start.setDate(end.getDate() - 7);
    } else if (dateRange === '30days') {
      start = new Date();
      start.setDate(end.getDate() - 30);
    } else if (dateRange === '90days') {
      start = new Date();
      start.setDate(end.getDate() - 90);
    } else if (dateRange === 'custom' && customStartDate && customEndDate) {
      start = customStartDate;
      end = customEndDate;
    } else {
      start = new Date();
      start.setDate(end.getDate() - 7);
    }
    return { start, end };
  };

  // Fetch report data from Supabase
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { start, end } = getDateRange();
      
      // Fetch chats data with related information
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select(`
          id,
          assigned_agent_id,
          status,
          priority,
          created_at,
          closed_at,
          satisfaction_rating,
          response_time,
          resolution_time,
          channel,
          customers (
            id,
            name,
            email
          ),
          profiles:assigned_agent_id (
            id,
            full_name,
            department
          )
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (chatsError) throw chatsError;

      // Fetch agents for stats
      const { data: agents, error: agentsError } = await supabase
        .from('profiles')
        .select('id, full_name, department, status')
        .eq('role', 'agent');

      if (agentsError) throw agentsError;

      // Calculate performance metrics
      const totalChats = (chats || []).length;
      const resolvedChats = (chats || []).filter(c => c.status === 'resolved' || c.status === 'closed').length;
      const avgResponseTime = calculateAverageTime(chats || [], 'response_time');
      const avgResolutionTime = calculateAverageTime(chats || [], 'resolution_time');
      const customerSatisfaction = calculateAverageSatisfaction(chats || []);
      const resolutionRate = totalChats > 0 ? (resolvedChats / totalChats) * 100 : 0;
      const firstResponseTime = avgResponseTime; // Assuming first response is similar for now
      const slaCompliance = calculateSLACompliance(chats || []);
      const agentUtilization = calculateAgentUtilization(agents || [], chats || []);

      setPerformanceData({
        totalChats,
        resolvedChats,
        avgResponseTime,
        avgResolutionTime,
        customerSatisfaction,
        agentUtilization,
        resolutionRate,
        firstResponseTime,
        slaCompliance
      });

      // Process agent statistics
      const processedAgentStats: AgentStats[] = (agents || []).map((agent) => {
        const agentChats = (chats || []).filter(c => c.assigned_agent_id === agent.id);
        const resolvedCount = agentChats.filter(c => c.status === 'resolved' || c.status === 'closed').length;
        const avgResponse = calculateAverageTime(agentChats, 'response_time');
        const avgSatisfaction = calculateAverageSatisfaction(agentChats);
        
        return {
          id: agent.id,
          name: agent.full_name,
          department: agent.department || 'General',
          chatsHandled: agentChats.length,
          avgResponse,
          csatScore: avgSatisfaction,
          status: agent.status || 'Active',
          resolutionRate: agentChats.length > 0 ? (resolvedCount / agentChats.length) * 100 : 0,
          totalHours: 40 // Mock data - would come from time tracking
        };
      });

      setAgentStats(processedAgentStats);

      // Generate category breakdown (using channel as proxy for category)
      const categories = generateCategoryBreakdown(chats || []);
      setCategoryBreakdown(categories);

      // Generate hourly distribution
      const hourlyData = generateHourlyDistribution(chats || []);
      setHourlyDistribution(hourlyData);

      // Generate CSAT data
      const csatAnalysis = generateCSATData(chats || []);
      setCSATData(csatAnalysis);

      // Generate volume statistics
      const volumeAnalysis = generateVolumeStats(chats || []);
      setVolumeStats(volumeAnalysis);

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch report data');
      toast({
        title: 'Error',
        description: 'Failed to fetch report data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const calculateAverageTime = (chats: Array<{ [key: string]: number }>, field: string): string => {
    const validChats = chats.filter(c => c[field] && c[field] > 0);
    if (validChats.length === 0) return '0m';
    
    const avgSeconds = validChats.reduce((sum, c) => sum + (c[field] || 0), 0) / validChats.length;
    return formatTime(avgSeconds);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const calculateAverageSatisfaction = (chats: Array<{ satisfaction_rating?: number }>): number => {
    const ratedChats = chats.filter(c => c.satisfaction_rating && c.satisfaction_rating > 0);
    if (ratedChats.length === 0) return 0;
    
    return ratedChats.reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) / ratedChats.length;
  };

  const calculateAgentUtilization = (agents: Array<{ id: string }>, chats: Array<{ assigned_agent_id?: string }>): number => {
    const workingAgents = agents.filter(a => 
      chats.some(c => c.assigned_agent_id === a.id)
    );
    return agents.length > 0 ? (workingAgents.length / agents.length) * 100 : 0;
  };

  const calculateSLACompliance = (chats: Array<{ response_time?: number }>): number => {
    const chatsWithResponse = chats.filter(c => c.response_time);
    if (chatsWithResponse.length === 0) return 0;
    
    const slaTarget = 300; // 5 minutes in seconds
    const compliant = chatsWithResponse.filter(c => (c.response_time || 0) <= slaTarget);
    return (compliant.length / chatsWithResponse.length) * 100;
  };

  const generateCategoryBreakdown = (chats: Array<{ channel?: string }>): CategoryBreakdown[] => {
    const categoryMap = new Map<string, number>();
    chats.forEach(chat => {
      const category = chat.channel || 'Web';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const total = chats.length;
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
    
    return Array.from(categoryMap.entries()).map(([category, count], index) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length],
      trend: Math.random() * 20 - 10 // Mock trend data
    }));
  };

  const generateHourlyDistribution = (chats: Array<{ created_at?: string; response_time?: number; satisfaction_rating?: number }>): HourlyDistribution[] => {
    const hourlyMap = new Map<number, { count: number; totalResponse: number; totalSatisfaction: number }>();
    
    chats.forEach(chat => {
      if (chat.created_at) {
        const hour = new Date(chat.created_at).getHours();
        const existing = hourlyMap.get(hour) || { count: 0, totalResponse: 0, totalSatisfaction: 0 };
        hourlyMap.set(hour, {
          count: existing.count + 1,
          totalResponse: existing.totalResponse + (chat.response_time || 0),
          totalSatisfaction: existing.totalSatisfaction + (chat.satisfaction_rating || 0)
        });
      }
    });

    return Array.from({ length: 24 }, (_, hour) => {
      const data = hourlyMap.get(hour) || { count: 0, totalResponse: 0, totalSatisfaction: 0 };
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        chats: data.count,
        avgResponseTime: data.count > 0 ? data.totalResponse / data.count : 0,
        satisfaction: data.count > 0 ? data.totalSatisfaction / data.count : 0
      };
    });
  };

  const generateCSATData = (chats: Array<{ satisfaction_rating?: number }>): CSATData => {
    const ratedChats = chats.filter(c => c.satisfaction_rating && c.satisfaction_rating > 0);
    const overall = ratedChats.length > 0 
      ? ratedChats.reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) / ratedChats.length 
      : 0;

    const distribution = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      const count = ratedChats.filter(c => Math.round(c.satisfaction_rating || 0) === rating).length;
      return {
        rating,
        count,
        percentage: ratedChats.length > 0 ? Math.round((count / ratedChats.length) * 100) : 0
      };
    }).reverse();

    return {
      overall,
      distribution,
      trends: {
        thisWeek: overall,
        lastWeek: overall * 0.93, // Mock previous data
        monthlyAvg: overall * 0.96,
        growth: 6.7
      }
    };
  };

  const generateVolumeStats = (chats: Array<{ created_at?: string }>): VolumeStats => {
    const now = new Date();
    const thisWeek = chats.filter(c => c.created_at && new Date(c.created_at) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    const thisMonth = chats.filter(c => c.created_at && new Date(c.created_at) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
    
    const hourlyVolume = new Map<number, number>();
    chats.forEach(chat => {
      if (chat.created_at) {
        const hour = new Date(chat.created_at).getHours();
        hourlyVolume.set(hour, (hourlyVolume.get(hour) || 0) + 1);
      }
    });

    const peakHourData = Array.from(hourlyVolume.entries()).reduce((max, [hour, count]) => 
      count > max.count ? { hour, count } : max, { hour: 0, count: 0 });

    return {
      dailyAverage: Math.round(thisWeek.length / 7),
      peakHour: peakHourData.count,
      totalThisWeek: thisWeek.length,
      growthRate: 12.5, // Mock growth rate
      peakTime: `${peakHourData.hour.toString().padStart(2, '0')}:00`,
      totalThisMonth: thisMonth.length
    };
  };

  useEffect(() => {
    fetchReportData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchReportData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dateRange, customStartDate, customEndDate]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Excellent': 'default',
      'Good': 'secondary',
      'Average': 'outline',
      'Active': 'default',
      'Inactive': 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const exportReport = async (exportFormat: 'pdf' | 'csv' | 'json') => {
    try {
    const dateRangeText = dateRange === 'custom' && customStartDate && customEndDate 
      ? `${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`
      : dateRange === '1day' ? 'Last 24 Hours'
      : dateRange === '7days' ? 'Last 7 Days'
      : dateRange === '30days' ? 'Last 30 Days'
        : dateRange === '90days' ? 'Last 90 Days'
        : 'Last 7 Days';

      // Create comprehensive report data
    const reportData = {
        metadata: {
      dateRange: dateRangeText,
          reportType,
          generatedAt: new Date().toISOString(),
          generatedBy: 'Supervisor Dashboard'
        },
        performance: performanceData,
        agents: agentStats,
        categories: categoryBreakdown,
      hourlyDistribution,
        csat: csatData,
        volume: volumeStats
      };

      let content: string;
      let mimeType: string;
      let fileExtension: string;

      switch (exportFormat) {
        case 'csv':
          content = generateCSVReport(reportData);
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        case 'json':
          content = JSON.stringify(reportData, null, 2);
          mimeType = 'application/json';
          fileExtension = 'json';
          break;
        case 'pdf':
          // For PDF, we'd need a PDF generation library
          content = generateTextReport(reportData);
          mimeType = 'text/plain';
          fileExtension = 'txt';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `support-report-${dateRange}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: `${exportFormat.toUpperCase()} Export Complete`,
      description: `Report downloaded for ${dateRangeText}`,
    });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export report data',
        variant: 'destructive',
      });
    }
  };

  const generateCSVReport = (data: any): string => {
    const csv = [];
    
    // Performance metrics
    csv.push('Performance Metrics');
    csv.push('Total Chats,Resolved Chats,Avg Response Time,Avg Resolution Time,Customer Satisfaction,Resolution Rate');
    csv.push(`${data.performance.totalChats},${data.performance.resolvedChats},${data.performance.avgResponseTime},${data.performance.avgResolutionTime},${data.performance.customerSatisfaction.toFixed(1)},${data.performance.resolutionRate.toFixed(1)}%`);
    csv.push('');

    // Agent stats
    csv.push('Agent Performance');
    csv.push('Name,Department,Chats Handled,Avg Response,CSAT Score,Status');
    data.agents.forEach((agent: AgentStats) => {
      csv.push(`${agent.name},${agent.department},${agent.chatsHandled},${agent.avgResponse},${agent.csatScore.toFixed(1)},${agent.status}`);
    });

    return csv.join('\n');
  };

  const generateTextReport = (data: any): string => {
    return `
SUPPORT TEAM PERFORMANCE REPORT
Generated: ${new Date().toLocaleString()}
Date Range: ${data.metadata.dateRange}

=== PERFORMANCE OVERVIEW ===
Total Chats: ${data.performance.totalChats}
Resolved Chats: ${data.performance.resolvedChats}
Resolution Rate: ${data.performance.resolutionRate.toFixed(1)}%
Average Response Time: ${data.performance.avgResponseTime}
Average Resolution Time: ${data.performance.avgResolutionTime}
Customer Satisfaction: ${data.performance.customerSatisfaction.toFixed(1)}/5.0

=== AGENT PERFORMANCE ===
${data.agents.map((agent: AgentStats) => 
  `${agent.name} (${agent.department}): ${agent.chatsHandled} chats, ${agent.avgResponse} avg response, ${agent.csatScore.toFixed(1)} CSAT`
).join('\n')}

=== VOLUME STATISTICS ===
Daily Average: ${data.volume.dailyAverage} chats
Peak Hour: ${data.volume.peakHour} chats at ${data.volume.peakTime}
Total This Week: ${data.volume.totalThisWeek} chats
Growth Rate: ${data.volume.growthRate.toFixed(1)}%
    `.trim();
  };

  const handleCustomDate = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
      fetchReportData();
      toast({
        title: "Custom Date Range Applied",
        description: `Report updated for ${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`,
      });
    } else {
      toast({
        title: "Select Date Range",
        description: "Please select both start and end dates",
        variant: 'destructive',
      });
    }
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    toast({
      title: "Date Range Updated",
      description: `Report data updated for ${range === '1day' ? 'Last 24 Hours' : range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'Last 90 Days'}`,
    });
  };

  const handleRefresh = async () => {
    await fetchReportData();
    toast({
      title: "Report Refreshed",
      description: "Data has been updated with the latest information",
    });
  };

  const getMetricTrend = (current: number, previous: number) => {
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      icon: change >= 0 ? ArrowUpRight : ArrowDownRight,
      color: change >= 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Reports</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
                <p className="text-sm text-slate-600 mt-1">Comprehensive insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200" onClick={handleRefresh}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh report data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" onClick={() => exportReport('json')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        {/* Date Range Selector */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Report Configuration</h3>
                <p className="text-sm text-slate-600">Select date range and report type</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">Last 24 hours</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
          
          {dateRange === 'custom' && (
                  <div className="flex items-center gap-2">
              <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-white border-slate-200">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                          {customStartDate ? format(customStartDate, 'MMM dd') : 'Start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                          onSelect={setCustomStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
                    <span className="text-slate-400">to</span>
              <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-white border-slate-200">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                          {customEndDate ? format(customEndDate, 'MMM dd') : 'End date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                          onSelect={setCustomEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-48 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="agent-performance">Agent Performance</SelectItem>
                    <SelectItem value="customer-satisfaction">Customer Satisfaction</SelectItem>
                    <SelectItem value="response-times">Response Times</SelectItem>
                    <SelectItem value="chat-volume">Chat Volume</SelectItem>
                  </SelectContent>
                </Select>
        </div>
      </div>
          </CardContent>
        </Card>

        <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl p-2">
            <TabsList className="grid w-full grid-cols-5 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="agent-performance" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Agents
              </TabsTrigger>
              <TabsTrigger 
                value="customer-satisfaction" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Star className="w-4 h-4 mr-2" />
                CSAT
              </TabsTrigger>
              <TabsTrigger 
                value="response-times" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Clock className="w-4 h-4 mr-2" />
                Response
              </TabsTrigger>
              <TabsTrigger 
                value="chat-volume" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Volume
              </TabsTrigger>
        </TabsList>
          </div>

          {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-sm font-medium text-slate-600">Total Chats</p>
                      <p className="text-3xl font-bold text-slate-900">{performanceData.totalChats}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+12.5% vs last period</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                      <p className="text-3xl font-bold text-slate-900">{performanceData.avgResponseTime}</p>
                      <div className="flex items-center mt-2">
                        <TrendingDown className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">-8.2% faster</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                      <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-sm font-medium text-slate-600">Customer Satisfaction</p>
                      <p className="text-3xl font-bold text-slate-900">{csatData.overall.toFixed(1)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+0.3 improvement</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-sm font-medium text-slate-600">Resolution Rate</p>
                      <p className="text-3xl font-bold text-slate-900">{performanceData.resolutionRate.toFixed(1)}%</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+2.1% improvement</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <LineChart className="w-4 h-4 text-white" />
                    </div>
                    <span>Chat Volume Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 rounded-xl">
                    <div className="text-center">
                      <BarChart4 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Chart visualization would be rendered here</p>
                      <p className="text-xs text-slate-500 mt-1">Integration with charting library required</p>
                    </div>
                </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                      <PieChart className="w-4 h-4 text-white" />
                    </div>
                    <span>Chat Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {categoryBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm text-slate-700">{item.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 w-10 text-right">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Agent Performance Tab */}
          <TabsContent value="agent-performance" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>Agent Performance Overview</span>
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    {agentStats.length} agents
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {agentStats.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No performance data</h3>
                    <p className="text-slate-600">Agent performance data will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agentStats.map((agent, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                              <span className="text-white font-semibold">{agent.name?.[0]?.toUpperCase()}</span>
                            </div>
                  <div>
                              <h4 className="font-semibold text-slate-900">{agent.name}</h4>
                              <p className="text-sm text-slate-600">{agent.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-xs text-slate-600">Chats Handled</p>
                              <p className="text-lg font-bold text-slate-900">{agent.chatsHandled}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600">Avg Response</p>
                              <p className="text-lg font-bold text-slate-900">{agent.avgResponse}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600">CSAT Score</p>
                              <p className="text-lg font-bold text-yellow-600">{agent.csatScore.toFixed(1)}</p>
                            </div>
                            <Badge variant="outline" className="bg-white">
                              {agent.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Satisfaction Tab */}
          <TabsContent value="customer-satisfaction" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-yellow-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                      <Star className="w-4 h-4 text-white" />
          </div>
                    <span>Overall CSAT</span>
                  </CardTitle>
              </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-900 mb-2">{csatData.overall.toFixed(1)}</div>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < Math.round(csatData.overall) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600">Based on {performanceData.totalChats} responses</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                  <CardTitle className="text-lg font-semibold text-slate-900">Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {csatData.distribution.map((item, index) => (
                      <div key={item.rating} className="flex items-center space-x-3">
                        <span className="text-sm w-6">{item.rating}★</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">{item.count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="text-lg font-semibold text-slate-900">Trends</CardTitle>
              </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">This week</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-slate-900">{csatData.trends.thisWeek.toFixed(1)}</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Last week</span>
                      <span className="text-lg font-bold text-slate-600">{csatData.trends.lastWeek.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Monthly avg</span>
                      <span className="text-lg font-bold text-slate-600">{csatData.trends.monthlyAvg.toFixed(1)}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                  <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+{csatData.trends.growth.toFixed(1)}%</div>
                        <p className="text-xs text-slate-600">vs last month</p>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

          {/* Response Times Tab */}
          <TabsContent value="response-times" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <span>Response Time Metrics</span>
                  </CardTitle>
            </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-1">{performanceData.firstResponseTime}</div>
                      <p className="text-sm text-slate-600">First Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-1">{performanceData.avgResponseTime}</div>
                      <p className="text-sm text-slate-600">Average Response</p>
                      </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-1">{performanceData.avgResolutionTime}</div>
                      <p className="text-sm text-slate-600">Resolution Time</p>
                      </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-1">{performanceData.slaCompliance.toFixed(1)}%</div>
                      <p className="text-sm text-slate-600">SLA Compliance</p>
                      </div>
                      </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50/50 border-b border-slate-200/60">
                  <CardTitle className="text-lg font-semibold text-slate-900">Performance by Hour</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-orange-50/50 rounded-xl">
                    <div className="text-center">
                      <BarChart4 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Hourly response time chart</p>
                      <p className="text-xs text-slate-500 mt-1">Peak hours: 9-11 AM, 2-4 PM</p>
                    </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </TabsContent>

          {/* Chat Volume Tab */}
          <TabsContent value="chat-volume" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <span>Volume Statistics</span>
                  </CardTitle>
            </CardHeader>
                <CardContent className="p-6">
              <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-600">Daily Average</span>
                      <span className="text-lg font-bold text-slate-900">{volumeStats.dailyAverage}</span>
                      </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-600">Peak Hour</span>
                      <span className="text-lg font-bold text-slate-900">{volumeStats.peakHour}</span>
                      </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-600">Total This Week</span>
                      <span className="text-lg font-bold text-slate-900">{volumeStats.totalThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                      <span className="text-sm text-green-700">Growth Rate</span>
                      <span className="text-lg font-bold text-green-700">+{volumeStats.growthRate.toFixed(1)}%</span>
                    </div>
              </div>
            </CardContent>
          </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="text-lg font-semibold text-slate-900">Volume Trends</CardTitle>
            </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 rounded-xl">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Chat volume trend chart</p>
                      <p className="text-xs text-slate-500 mt-1">7-day rolling average</p>
                    </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Reports;
