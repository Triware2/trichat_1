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
import { supabase } from '@/integrations/supabase/client';

export const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>({});
  const [agentStats, setAgentStats] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<any[]>([]);
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
    } else if (dateRange === '3months') {
      start = new Date();
      start.setMonth(end.getMonth() - 3);
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
      // Fetch chats in range
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('id, assigned_agent_id, status, priority, subject, created_at, closed_at, satisfaction_rating, response_time')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      if (chatsError) throw new Error('Failed to fetch chats');
      // Fetch agents
      const agentIds = [...new Set((chats || []).map((c: any) => c.assigned_agent_id).filter(Boolean))];
      const { data: agents } = agentIds.length > 0
        ? await supabase.from('profiles').select('id, full_name').in('id', agentIds)
        : { data: [] };
      // Metrics
      const totalChats = (chats || []).length;
      const resolvedChats = (chats || []).filter((c: any) => c.status === 'resolved').length;
      const avgResponseTime = (chats || []).length > 0 ?
        ((chats || []).reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / (chats || []).length / 60).toFixed(1) + 'm' : '0m';
      const avgResolutionTime = (chats || []).length > 0 ?
        ((chats || []).reduce((acc: number, c: any) => acc + ((c.closed_at && c.created_at) ? (new Date(c.closed_at).getTime() - new Date(c.created_at).getTime()) : 0), 0) / (chats || []).filter((c: any) => c.closed_at && c.created_at).length / 60000).toFixed(1) + 'm' : '0m';
      const customerSatisfaction = (chats || []).length > 0 ?
        Math.round((chats || []).reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / (chats || []).length) : 0;
      // Utilization: percent of agents with at least 1 chat
      const agentUtilization = agentIds.length > 0 ? Math.round((agentIds.length / agentIds.length) * 100) : 0;
      setPerformanceData({ totalChats, resolvedChats, avgResponseTime, avgResolutionTime, customerSatisfaction, agentUtilization });
      // Agent stats
      const agentStatsData = (agents || []).map((agent: any) => {
        const agentChats = (chats || []).filter((c: any) => c.assigned_agent_id === agent.id);
        return {
          name: agent.full_name,
          totalChats: agentChats.length,
          resolved: agentChats.filter((c: any) => c.status === 'resolved').length,
          avgResponse: agentChats.length > 0 ? (agentChats.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / agentChats.length / 60).toFixed(1) + 'm' : '0m',
          satisfaction: agentChats.length > 0 ? Math.round(agentChats.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / agentChats.length) : 0,
          status: agentChats.length > 0 && (agentChats.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / agentChats.length) >= 95 ? 'Excellent' : (agentChats.length > 0 && (agentChats.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / agentChats.length) >= 90 ? 'Good' : 'Average'),
        };
      });
      setAgentStats(agentStatsData);
      // Category breakdown (removed, since no category column)
      setCategoryBreakdown([]);
      // Hourly distribution
      const hours: { [key: string]: number } = {};
      (chats || []).forEach((c: any) => {
        const hour = c.created_at ? new Date(c.created_at).getHours() : null;
        if (hour !== null) hours[hour] = (hours[hour] || 0) + 1;
      });
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        chats: hours[i] || 0,
      }));
      setHourlyDistribution(hourlyData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line
  }, [dateRange, customStartDate, customEndDate]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Excellent': 'default',
      'Good': 'secondary',
      'Average': 'outline'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const exportReport = (exportFormat: string) => {
    const dateRangeText = dateRange === 'custom' && customStartDate && customEndDate 
      ? `${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`
      : dateRange === '1day' ? 'Last 24 Hours'
      : dateRange === '7days' ? 'Last 7 Days'
      : dateRange === '30days' ? 'Last 30 Days'
      : 'Last 3 Months';

    // Create report data object
    const reportData = {
      dateRange: dateRangeText,
      performanceData,
      agentStats,
      categoryBreakdown,
      hourlyDistribution,
      generatedAt: new Date().toISOString()
    };

    // Simulate file download
    const dataString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataString], { 
      type: exportFormat === 'pdf' ? 'application/pdf' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support-report-${dateRange}.${exportFormat === 'pdf' ? 'pdf' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: `${exportFormat.toUpperCase()} Export Complete`,
      description: `Report downloaded for ${dateRangeText}`,
    });
    
    console.log('Exported report:', exportFormat, reportData);
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

  if (loading) {
    return <div className="text-center text-gray-500 py-12">Loading report data...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ...existing report cards, each with bg-white rounded-2xl shadow-md p-6... */}
      </div>
    </div>
  );
};
