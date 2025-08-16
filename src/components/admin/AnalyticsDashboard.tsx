import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  BarChart3, TrendingUp, TrendingDown, Clock, Star, Users, MessageSquare, 
  Plus, Download, RefreshCw, Filter, Search, Eye, Settings, UserCheck,
  Activity, Target, Zap, Brain, Globe, Smartphone, Mail, Phone, Play, Trash2
} from 'lucide-react';
import { CustomAnalyticsBuilder } from './analytics/CustomAnalyticsBuilder';
import { useEffect, useState } from 'react';
import { analyticsService, AnalyticsData, CustomerAnalyticsData } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalyticsData[]>([]);
  const [customAnalytics, setCustomAnalytics] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustomAnalyticsOpen, setIsCustomAnalyticsOpen] = useState(false);
  const [customAnalyticsConfig, setCustomAnalyticsConfig] = useState({
    name: '',
    description: '',
    metrics: [] as string[],
    filters: {} as Record<string, any>
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [runningReports, setRunningReports] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 3;
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getAnalyticsData(timeRange);
      setAnalyticsData(data);
      
      // Fetch customer analytics
      const customerData = await analyticsService.getCustomerAnalytics();
      setCustomerAnalytics(customerData);

      // Fetch custom analytics
      const customData = await analyticsService.getCustomAnalytics();
      setCustomAnalytics(customData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleCreateCustomAnalytics = async () => {
    if (!customAnalyticsConfig.name || customAnalyticsConfig.metrics.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a name and select at least one metric",
        variant: "destructive"
      });
      return;
    }

    try {
      const newAnalytics = await analyticsService.createCustomAnalytics(customAnalyticsConfig);
      setCustomAnalytics(prev => [...prev, newAnalytics]);
      setCustomAnalyticsConfig({ name: '', description: '', metrics: [] });
      setIsCustomAnalyticsOpen(false);
      setCurrentPage(1); // Reset to first page when adding new report
      toast({
        title: "Success",
        description: "Custom analytics created successfully"
      });
    } catch (error) {
      console.error('Error creating custom analytics:', error);
      toast({
        title: "Error",
        description: "Failed to create custom analytics",
        variant: "destructive"
      });
    }
  };

  const handleRunCustomAnalytics = async (id: string) => {
    try {
      console.log('🚀 Starting to run custom analytics for ID:', id);
      setRunningReports(prev => new Set(prev).add(id));
      
      const results = await analyticsService.runCustomAnalytics(id);
      console.log('✅ Custom analytics results:', results);
      
      toast({
        title: "Success",
        description: "Custom analytics executed successfully",
      });
      
      // Refresh custom analytics list
      console.log('🔄 Refreshing custom analytics list...');
      const customData = await analyticsService.getCustomAnalytics();
      console.log('📊 Updated custom analytics data:', customData);
      setCustomAnalytics(customData);
      
      // Update selected report if it's the one being run
      if (selectedReport?.id === id) {
        const updatedReport = customData.find(r => r.id === id);
        setSelectedReport(updatedReport);
      }
    } catch (error) {
      console.error('❌ Error running custom analytics:', error);
      toast({
        title: "Error",
        description: "Failed to run custom analytics",
        variant: "destructive"
      });
    } finally {
      setRunningReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDeleteCustomAnalytics = async (id: string) => {
    try {
      await analyticsService.deleteCustomAnalytics(id);
      setCustomAnalytics(prev => prev.filter(report => report.id !== id));
      setCurrentPage(1); // Reset to first page when deleting report
      toast({
        title: "Success",
        description: "Custom analytics deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting custom analytics:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom analytics",
        variant: "destructive"
      });
    }
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;
    
    const csvData = [
      ['Metric', 'Value'],
      ['Total Conversations', analyticsData.totalConversations],
      ['Average Response Time (min)', analyticsData.avgResponseTime],
      ['Customer Satisfaction', analyticsData.customerSatisfaction],
      ['Active Agents', analyticsData.activeAgents],
      ['Resolution Rate (%)', analyticsData.resolutionRate],
      ['Average Wait Time (min)', analyticsData.avgWaitTime]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Analytics data exported successfully"
    });
  };

  const filteredCustomerAnalytics = customerAnalytics.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(customAnalytics.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = customAnalytics.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedReport(null); // Reset selected report when changing pages
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-8">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Conversations',
      value: analyticsData.totalConversations.toLocaleString(),
      change: '+12.5%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Avg Response Time',
      value: `${analyticsData.avgResponseTime} min`,
      change: '-8.2%',
      trend: 'down' as const,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Customer Satisfaction',
      value: `${analyticsData.customerSatisfaction}/5`,
      change: '+5.1%',
      trend: 'up' as const,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Active Agents',
      value: analyticsData.activeAgents.toString(),
      change: '+2.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
              </div>
              <p className="text-sm text-slate-600">
                Comprehensive analytics and insights for your customer support operations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportAnalytics}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={isCustomAnalyticsOpen} onOpenChange={setIsCustomAnalyticsOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Custom Analytics
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Create Custom Analytics</DialogTitle>
                    <DialogDescription>
                      Create a custom analytics report with specific metrics and filters.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={customAnalyticsConfig.name}
                        onChange={(e) => setCustomAnalyticsConfig(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter analytics name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={customAnalyticsConfig.description}
                        onChange={(e) => setCustomAnalyticsConfig(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Metrics</Label>
                      <div className="space-y-4 mt-2">
                        {/* Conversation Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">💬 Conversation Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'conversations', 'active_conversations', 'resolved_conversations', 
                              'escalated_conversations', 'abandoned_conversations', 'conversation_duration',
                              'conversation_volume', 'peak_conversation_hours', 'conversation_trends'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">⚡ Performance Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'response_time', 'avg_response_time', 'first_response_time', 
                              'resolution_time', 'avg_resolution_time', 'wait_time',
                              'queue_time', 'handling_time', 'processing_speed', 'efficiency_score'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Quality Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">⭐ Quality Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'satisfaction', 'customer_satisfaction', 'agent_satisfaction',
                              'resolution_rate', 'first_contact_resolution', 'accuracy_rate',
                              'quality_score', 'compliance_rate', 'error_rate', 'feedback_score'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Agent Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">👥 Agent Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'active_agents', 'agent_productivity', 'agent_performance',
                              'agent_workload', 'agent_availability', 'agent_utilization',
                              'agent_satisfaction', 'agent_turnover', 'agent_training_hours',
                              'agent_specialization', 'agent_skills', 'agent_ratings'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Customer Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">👤 Customer Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'customer_satisfaction', 'customer_lifetime_value', 'customer_retention',
                              'customer_churn', 'customer_engagement', 'customer_sentiment',
                              'customer_journey', 'customer_segments', 'customer_preferences',
                              'customer_feedback', 'customer_complaints', 'customer_advocacy'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Channel Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">📱 Channel Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'channel_performance', 'channel_volume', 'channel_satisfaction',
                              'channel_efficiency', 'channel_preferences', 'channel_trends',
                              'multi_channel_usage', 'channel_switching', 'channel_integration',
                              'channel_costs', 'channel_roi', 'channel_optimization'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Business Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">💰 Business Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'revenue_impact', 'cost_per_conversation', 'cost_per_resolution',
                              'roi_metrics', 'profitability', 'operational_costs',
                              'efficiency_gains', 'productivity_improvements', 'resource_utilization',
                              'capacity_planning', 'budget_allocation', 'financial_performance'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Operational Metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">⚙️ Operational Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'queue_length', 'queue_wait_time', 'queue_abandonment',
                              'system_uptime', 'response_availability', 'service_levels',
                              'operational_efficiency', 'process_optimization', 'workflow_analysis',
                              'automation_impact', 'escalation_rates', 'backlog_management'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Advanced Analytics */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">🔬 Advanced Analytics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'predictive_analytics', 'trend_analysis', 'seasonal_patterns',
                              'anomaly_detection', 'correlation_analysis', 'regression_analysis',
                              'clustering_analysis', 'sentiment_analysis', 'behavioral_patterns',
                              'forecasting_models', 'machine_learning_insights', 'ai_performance'
                            ].map(metric => (
                              <Button
                                key={metric}
                                variant={customAnalyticsConfig.metrics.includes(metric) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const metrics = customAnalyticsConfig.metrics.includes(metric)
                                    ? customAnalyticsConfig.metrics.filter(m => m !== metric)
                                    : [...customAnalyticsConfig.metrics, metric];
                                  setCustomAnalyticsConfig(prev => ({ ...prev, metrics }));
                                }}
                              >
                                {metric.replace(/_/g, ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected Metrics Summary */}
                      {customAnalyticsConfig.metrics.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-2">
                            Selected Metrics ({customAnalyticsConfig.metrics.length}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {customAnalyticsConfig.metrics.map(metric => (
                              <Badge key={metric} variant="secondary" className="text-xs">
                                {metric.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                    <Button variant="outline" onClick={() => setIsCustomAnalyticsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCustomAnalytics}>
                      Create Analytics
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => (
              <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.bgColor}`}>
                      <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    <Badge 
                      variant={kpi.trend === 'up' ? 'default' : kpi.trend === 'down' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {kpi.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</p>
                    <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Sections */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <Tabs defaultValue="overview" className="space-y-0">
              <div className="border-b border-slate-200">
                <TabsList className="h-auto bg-transparent p-0 space-x-0">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    <TabsTrigger value="overview" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                      <BarChart3 className="w-4 h-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                      <Activity className="w-4 h-4" />
                      Performance
                    </TabsTrigger>
                    <TabsTrigger value="channels" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                      <Globe className="w-4 h-4" />
                      Channels
                    </TabsTrigger>
                    <TabsTrigger value="satisfaction" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                      <Star className="w-4 h-4" />
                      Satisfaction
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                      <UserCheck className="w-4 h-4" />
                      Customer Analytics
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                      <Play className="w-4 h-4" />
                      Custom Analytics
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                      <CardTitle className="text-lg font-bold text-slate-900">Conversation Trends</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Monthly conversation volume and resolution rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="conversations" fill="#3B82F6" name="Total Conversations" />
                          <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                      <CardTitle className="text-lg font-bold text-slate-900">Response Time Trends</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Average response times across all channels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.dailyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="avgResponseTime" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-0 p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Agent Performance</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Performance metrics by agent
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {analyticsData.agentPerformance.slice(0, 5).map((agent, index) => (
                            <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {agent.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{agent.name}</p>
                                  <p className="text-sm text-slate-600">{agent.conversations} conversations</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-slate-900">{agent.avgResponseTime} min</p>
                                <p className="text-sm text-slate-600">{agent.satisfaction}/5 rating</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Real-time Metrics</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Current system status
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{analyticsData.realTimeMetrics.activeChats}</p>
                            <p className="text-sm text-green-700">Active Chats</p>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{analyticsData.realTimeMetrics.queuedChats}</p>
                            <p className="text-sm text-yellow-700">Queued Chats</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{analyticsData.realTimeMetrics.onlineAgents}</p>
                            <p className="text-sm text-blue-700">Online Agents</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{analyticsData.realTimeMetrics.avgQueueTime}</p>
                            <p className="text-sm text-purple-700">Avg Queue Time (min)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="channels" className="mt-0 p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Channel Distribution</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Conversations by channel
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={analyticsData.channelData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percentage }) => `${name} ${percentage}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {analyticsData.channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Channel Performance</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Performance metrics by channel
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {analyticsData.channelData.map((channel, index) => (
                            <div key={channel.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: channel.color }}
                                ></div>
                                <div>
                                  <p className="font-medium text-slate-900">{channel.name}</p>
                                  <p className="text-sm text-slate-600">{channel.value} conversations</p>
                                </div>
                              </div>
                              <Badge variant="secondary">{channel.percentage}%</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="satisfaction" className="mt-0 p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Satisfaction Trends</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Customer satisfaction over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={analyticsData.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Area type="monotone" dataKey="satisfaction" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Customer Segments</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Customer distribution by value
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {analyticsData.customerAnalytics.customerSegments.map((segment, index) => (
                            <div key={segment.segment} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-900">{segment.segment}</p>
                                <p className="text-sm text-slate-600">{segment.count} customers</p>
                              </div>
                              <Badge variant="secondary">{segment.percentage}%</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customers" className="mt-0 p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Customer Analytics</h3>
                      <p className="text-sm text-slate-600">Detailed customer insights and behavior analysis</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border border-slate-200 shadow-sm">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Customer Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{analyticsData.customerAnalytics.totalCustomers}</p>
                            <p className="text-sm text-blue-700">Total Customers</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{analyticsData.customerAnalytics.newCustomers}</p>
                            <p className="text-sm text-green-700">New Customers (30d)</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{analyticsData.customerAnalytics.returningCustomers}</p>
                            <p className="text-sm text-purple-700">Returning Customers</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm lg:col-span-2">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Top Customer Issues</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {analyticsData.customerAnalytics.topIssues.map((issue, index) => (
                            <div key={issue.issue} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-red-600">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{issue.issue}</p>
                                  <p className="text-sm text-slate-600">{issue.count} occurrences</p>
                                </div>
                              </div>
                              <Badge variant="secondary">{issue.percentage}%</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                      <CardTitle className="text-lg font-bold text-slate-900">Customer List</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Detailed customer analytics and behavior patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-3 px-4 font-medium text-slate-900">Customer</th>
                              <th className="text-left py-3 px-4 font-medium text-slate-900">Interactions</th>
                              <th className="text-left py-3 px-4 font-medium text-slate-900">Satisfaction</th>
                              <th className="text-left py-3 px-4 font-medium text-slate-900">Channel</th>
                              <th className="text-left py-3 px-4 font-medium text-slate-900">Last Interaction</th>
                              <th className="text-left py-3 px-4 font-medium text-slate-900">Churn Risk</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCustomerAnalytics.slice(0, 10).map((customer) => (
                              <tr key={customer.customerId} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-medium text-slate-900">{customer.customerName}</p>
                                    <p className="text-sm text-slate-600">{customer.email}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{customer.totalInteractions}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-medium">{customer.avgSatisfaction}/5</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {customer.preferredChannel === 'website' && <Globe className="w-4 h-4 text-blue-500" />}
                                    {customer.preferredChannel === 'mobile' && <Smartphone className="w-4 h-4 text-purple-500" />}
                                    {customer.preferredChannel === 'email' && <Mail className="w-4 h-4 text-green-500" />}
                                    {customer.preferredChannel === 'phone' && <Phone className="w-4 h-4 text-red-500" />}
                                    <span className="capitalize">{customer.preferredChannel}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-slate-600">
                                    {new Date(customer.lastInteraction).toLocaleDateString()}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge 
                                    variant={
                                      customer.churnRisk === 'high' ? 'destructive' : 
                                      customer.churnRisk === 'medium' ? 'secondary' : 'default'
                                    }
                                  >
                                    {customer.churnRisk}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-0 p-6">
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Custom Analytics Reports</h2>
                      <p className="text-sm text-slate-600 mt-1">Create, manage, and execute your custom analytics reports</p>
                    </div>
                    <Button 
                      onClick={() => setIsCustomAnalyticsOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Report
                    </Button>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Available Reports - Takes 2 columns */}
                    <div className="xl:col-span-2">
                      <Card className="border-0 shadow-sm bg-white">
                        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg font-semibold text-slate-900">Available Reports</CardTitle>
                              <CardDescription className="text-sm text-slate-600 mt-1">
                                Your custom analytics reports and their execution status
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              {customAnalytics.length} Reports
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {customAnalytics.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-8 h-8 text-blue-600" />
                              </div>
                              <h3 className="text-lg font-medium text-slate-900 mb-2">No Reports Yet</h3>
                              <p className="text-slate-600 mb-4">Create your first custom analytics report to get started</p>
                              <Button 
                                onClick={() => setIsCustomAnalyticsOpen(true)}
                                variant="outline"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Report
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {currentReports.map((report) => (
                                <div key={report.id} className="group relative bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                          <BarChart3 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-slate-900">{report.name}</h3>
                                          <p className="text-sm text-slate-600">{report.description || 'No description'}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {new Date(report.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Settings className="w-3 h-3" />
                                          {report.metrics?.length || 0} metrics
                                        </span>
                                        {report.last_run && (
                                          <span className="flex items-center gap-1">
                                            <Play className="w-3 h-3" />
                                            Last run: {new Date(report.last_run).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>

                                      {/* Results Display */}
                                      {report.results && Object.keys(report.results).length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                          <div className="mb-3">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-2">📊 Latest Results</h4>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(report.results).map(([key, value]) => (
                                              <div key={key} className="bg-white border border-blue-200 rounded-lg p-3 text-center shadow-sm">
                                                <div className="text-xl font-bold text-blue-600 mb-1">
                                                  {typeof value === 'number' ? 
                                                    (key.includes('rate') ? `${value.toFixed(1)}%` : value.toFixed(2)) : 
                                                    String(value)
                                                  }
                                                </div>
                                                <div className="text-xs text-slate-600 font-medium capitalize">
                                                  {key.replace(/_/g, ' ')}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          <div className="mt-3 text-xs text-slate-500">
                                            Last updated: {report.last_run ? new Date(report.last_run).toLocaleString() : 'Never'}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                      <Button
                                        onClick={() => handleRunCustomAnalytics(report.id)}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                        disabled={runningReports.has(report.id)}
                                      >
                                        {runningReports.has(report.id) ? (
                                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        ) : (
                                          <Play className="w-4 h-4 mr-1" />
                                        )}
                                        Run
                                      </Button>
                                      <Button
                                        onClick={() => handleDeleteCustomAnalytics(report.id)}
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Pagination Controls */}
                              {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                  <div className="text-sm text-slate-600">
                                    Showing {startIndex + 1}-{Math.min(endIndex, customAnalytics.length)} of {customAnalytics.length} reports
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handlePageChange(currentPage - 1)}
                                      disabled={currentPage === 1}
                                    >
                                      Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                          key={page}
                                          variant={currentPage === page ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => handlePageChange(page)}
                                          className="w-8 h-8 p-0"
                                        >
                                          {page}
                                        </Button>
                                      ))}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handlePageChange(currentPage + 1)}
                                      disabled={currentPage === totalPages}
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Actions & Stats - Takes 1 column */}
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Analytics Overview</h3>
                            <div className="space-y-3 mt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Total Reports</span>
                                <span className="font-semibold text-slate-900">{customAnalytics.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Active Reports</span>
                                <span className="font-semibold text-green-600">
                                  {customAnalytics.filter(r => r.status === 'active').length}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Last 24h Runs</span>
                                <span className="font-semibold text-blue-600">
                                  {customAnalytics.filter(r => {
                                    if (!r.last_run) return false;
                                    const lastRun = new Date(r.last_run);
                                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                                    return lastRun > yesterday;
                                  }).length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Actions */}
                      <Card className="border-0 shadow-sm bg-white">
                        <CardHeader className="border-b border-slate-100 p-6">
                          <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <Button 
                              onClick={() => setIsCustomAnalyticsOpen(true)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create New Report
                            </Button>
                            <Button 
                              onClick={fetchAnalytics}
                              variant="outline"
                              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Refresh Data
                            </Button>
                            <Button 
                              onClick={exportAnalytics}
                              variant="outline"
                              className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export Analytics
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Activity */}
                      <Card className="border-0 shadow-sm bg-white">
                        <CardHeader className="border-b border-slate-100 p-6">
                          <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            {customAnalytics
                              .filter(report => report.last_run)
                              .sort((a, b) => new Date(b.last_run).getTime() - new Date(a.last_run).getTime())
                              .slice(0, 3)
                              .map((report) => (
                                <div key={report.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{report.name}</p>
                                    <p className="text-xs text-slate-500">
                                      Executed {new Date(report.last_run).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            {customAnalytics.filter(r => r.last_run).length === 0 && (
                              <div className="text-center py-4">
                                <p className="text-sm text-slate-500">No recent activity</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
