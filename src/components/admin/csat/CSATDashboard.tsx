
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Star,
  Calendar,
  Download,
  BarChart3,
  Target,
  Activity,
  Award,
  Clock,
  MessageSquare,
  Building2
} from 'lucide-react';
import { csatService, AgentCSATPerformance, DepartmentCSATPerformance } from '@/services/csatService';
import { CSATMetrics } from '@/services/csatService';

interface CSATDashboardProps {
  csatMetrics: CSATMetrics | null;
  onRefresh: () => void;
}

export const CSATDashboard = ({ csatMetrics, onRefresh }: CSATDashboardProps) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [agentPerformance, setAgentPerformance] = useState<AgentCSATPerformance[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentCSATPerformance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPerformanceData();
  }, [timeRange]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const [agents, departments] = await Promise.all([
        csatService.getAgentPerformance(timeRange),
        csatService.getDepartmentPerformance(timeRange)
      ]);
      setAgentPerformance(agents);
      setDepartmentPerformance(departments);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // Export agent and department performance data
      const agentData = agentPerformance.map(agent => ({
        'Agent ID': agent.agent_id,
        'Agent Name': agent.agent_name,
        'Average Rating': agent.average_rating,
        'Total Responses': agent.total_responses,
        'Positive Responses': agent.sentiment_breakdown.positive,
        'Neutral Responses': agent.sentiment_breakdown.neutral,
        'Negative Responses': agent.sentiment_breakdown.negative,
        'Improvement Areas': agent.improvement_areas.join('; '),
        'Strengths': agent.strengths.join('; ')
      }));

      const departmentData = departmentPerformance.map(dept => ({
        'Department': dept.department,
        'Average Rating': dept.average_rating,
        'Total Responses': dept.total_responses,
        'Positive Responses': dept.sentiment_breakdown.positive,
        'Neutral Responses': dept.sentiment_breakdown.neutral,
        'Negative Responses': dept.sentiment_breakdown.negative,
        'Trend': dept.trend
      }));

      // Create CSV content
      const agentHeaders = Object.keys(agentData[0] || {});
      const deptHeaders = Object.keys(departmentData[0] || {});

      const csvContent = [
        '=== AGENT PERFORMANCE ===',
        agentHeaders.join(','),
        ...agentData.map(row => 
          agentHeaders.map(header => {
            const value = row[header];
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        ),
        '',
        '=== DEPARTMENT PERFORMANCE ===',
        deptHeaders.join(','),
        ...departmentData.map(row => 
          deptHeaders.map(header => {
            const value = row[header];
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `csat-performance-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Excellent</Badge>;
    if (rating >= 4.0) return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Good</Badge>;
    if (rating >= 3.0) return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Average</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-red-200">Poor</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* AWS-style neutral header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
              Performance Overview
            </h2>
            <p className="text-sm text-slate-600 mt-1">Monitor agent and department performance metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white border-slate-300 hover:border-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExport} variant="outline" size="sm" className="bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid - AWS-like cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                  {csatMetrics?.averageCSAT ? formatRating(csatMetrics.averageCSAT) : '0.0'}
                </p>
                <p className="text-sm font-medium text-slate-600 mb-2">Average CSAT</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">+0.2</span>
                  <span className="text-xs text-slate-400">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                  {csatMetrics?.averageNPS ? formatRating(csatMetrics.averageNPS) : '0.0'}
                </p>
                <p className="text-sm font-medium text-slate-600 mb-2">Average NPS</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">+0.5</span>
                  <span className="text-xs text-slate-400">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                  {csatMetrics?.averageCES ? formatRating(csatMetrics.averageCES) : '0.0'}
                </p>
                <p className="text-sm font-medium text-slate-600 mb-2">Average CES</p>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">-0.3</span>
                  <span className="text-xs text-slate-400">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                  {csatMetrics?.totalResponses || 0}
                </p>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Responses</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">+12%</span>
                  <span className="text-xs text-slate-400">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tables - AWS-like panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Top Agents
                </h3>
                <p className="text-sm text-slate-600">Best performing agents by CSAT score</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {agentPerformance.length} agents
              </Badge>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  </div>
                  <p className="text-sm text-slate-500">Loading agent data...</p>
                </div>
              </div>
            ) : agentPerformance.length > 0 ? (
              <div className="space-y-4">
                {agentPerformance.slice(0, 5).map((agent, index) => (
                  <div key={agent.agent_id} className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{agent.agent_name || `Agent ${agent.agent_id}`}</p>
                          <p className="text-sm text-slate-500">{agent.total_responses} responses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-lg font-bold ${getRatingColor(agent.average_rating)}`}>
                            {formatRating(agent.average_rating)}
                          </span>
                          {getRatingBadge(agent.average_rating)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">N/A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500 font-medium">No agent data available</p>
                <p className="text-sm text-slate-400 mt-1">Agent performance data will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Department Performance
                </h3>
                <p className="text-sm text-slate-600">CSAT scores by department</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {departmentPerformance.length} depts
              </Badge>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  </div>
                  <p className="text-sm text-slate-500">Loading department data...</p>
                </div>
              </div>
            ) : departmentPerformance.length > 0 ? (
              <div className="space-y-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={dept.department} className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{dept.department}</p>
                          <p className="text-sm text-slate-500">{dept.total_responses} responses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-lg font-bold ${getRatingColor(dept.average_rating)}`}>
                            {formatRating(dept.average_rating)}
                          </span>
                          {getRatingBadge(dept.average_rating)}
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(dept.trend)}
                          <span className={`text-xs font-medium ${getTrendColor(dept.trend)}`}>
                            {dept.trend === 'up' ? 'Improving' : dept.trend === 'down' ? 'Declining' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500 font-medium">No department data available</p>
                <p className="text-sm text-slate-400 mt-1">Department performance data will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-sm text-gray-500">Latest CSAT responses and updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New CSAT response received</p>
                  <p className="text-sm text-gray-500">Customer rated their experience 5/5 stars</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
