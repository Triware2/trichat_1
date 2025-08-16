
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { slaService } from '@/services/slaService';
import { useEffect } from 'react';
import { SLAMetrics } from './types';

export const SLAReporting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedSLA, setSelectedSLA] = useState('all');
  const [metrics, setMetrics] = useState<SLAMetrics[]>([]);

  useEffect(() => {
    const load = async () => {
      const periodMap: any = { week: 'week', month: 'month', quarter: 'quarter', year: 'month' };
      const data = await slaService.listMetrics(selectedSLA === 'all' ? '' : selectedSLA, periodMap[selectedPeriod] || 'month');
      setMetrics(data);
    };
    load();
  }, [selectedSLA, selectedPeriod]);

  const complianceData = metrics.map((m, idx) => ({
    name: `P${idx + 1}`,
    compliance: m.complianceRate,
    breaches: m.breachedCases,
    cases: m.totalCases,
  }));

  const responseTimeData = [
    { name: 'Mon', avgResponse: 18, target: 20 },
    { name: 'Tue', avgResponse: 22, target: 20 },
    { name: 'Wed', avgResponse: 16, target: 20 },
    { name: 'Thu', avgResponse: 19, target: 20 },
    { name: 'Fri', avgResponse: 25, target: 20 },
    { name: 'Sat', avgResponse: 15, target: 20 },
    { name: 'Sun', avgResponse: 14, target: 20 },
  ];

  const slaPerformance = metrics.slice(0, 3).map((m) => ({
    sla: m.slaId,
    totalCases: m.totalCases,
    breached: m.breachedCases,
    compliance: m.complianceRate,
    avgResponse: `${m.avgResponseTime}m`,
    avgResolution: `${m.avgResolutionTime}m`,
    trend: 'up'
  }));

  const breachAnalysis = [
    {
      category: 'Response Time Breach',
      count: 45,
      percentage: 57.7,
      rootCauses: ['Agent unavailable', 'High queue volume', 'System downtime']
    },
    {
      category: 'Resolution Time Breach',
      count: 28,
      percentage: 35.9,
      rootCauses: ['Complex technical issues', 'Customer delays', 'Escalation delays']
    },
    {
      category: 'Follow-up Breach',
      count: 5,
      percentage: 6.4,
      rootCauses: ['Agent oversight', 'System notification failure']
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">SLA Reporting & Analytics</h2>
          <p className="text-sm text-slate-600 mt-1">Comprehensive analysis of SLA performance and compliance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedSLA} onValueChange={setSelectedSLA}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select SLA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SLAs</SelectItem>
              <SelectItem value="enterprise">Enterprise VIP</SelectItem>
              <SelectItem value="business">Business Standard</SelectItem>
              <SelectItem value="basic">Basic Support</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
            const headers = ['Period','Total Cases','Breached','Compliance','Avg Resp (m)','Avg Res (m)'];
            const rows = metrics.map((m, i) => [
              `P${i+1}`,
              m.totalCases,
              m.breachedCases,
              m.complianceRate,
              m.avgResponseTime,
              m.avgResolutionTime
            ].join(','));
            const content = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sla-report-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 text-xs font-medium uppercase tracking-wide">Overall Compliance</p>
                <p className="text-2xl font-semibold text-green-900">95.8%</p>
                <p className="text-green-700 text-xs">+2.3% from last month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 text-xs font-medium uppercase tracking-wide">Avg Response Time</p>
                <p className="text-2xl font-semibold text-blue-900">19m</p>
                <p className="text-blue-700 text-xs">-3m from last month</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 text-xs font-medium uppercase tracking-wide">Total Breaches</p>
                <p className="text-2xl font-semibold text-orange-900">78</p>
                <p className="text-orange-700 text-xs">-12 from last month</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-800 text-xs font-medium uppercase tracking-wide">Cases Processed</p>
                <p className="text-2xl font-semibold text-purple-900">1,704</p>
                <p className="text-purple-700 text-xs">+156 from last month</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              SLA Compliance Trend
            </CardTitle>
            <CardDescription>Weekly compliance rates and breach counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Compliance %" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="breaches" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Breaches" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Analysis */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Clock className="w-5 h-5 text-green-600" />
              Response Time vs Target
            </CardTitle>
            <CardDescription>Daily average response times compared to targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgResponse" fill="#3b82f6" name="Avg Response (min)" />
                <Bar dataKey="target" fill="#10b981" name="Target (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SLA Performance Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            SLA Performance Summary
          </CardTitle>
          <CardDescription>Detailed performance metrics by SLA tier</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SLA Tier</TableHead>
                <TableHead>Total Cases</TableHead>
                <TableHead>Breached Cases</TableHead>
                <TableHead>Compliance Rate</TableHead>
                <TableHead>Avg Response</TableHead>
                <TableHead>Avg Resolution</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slaPerformance.map((sla, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{sla.sla}</TableCell>
                  <TableCell>{sla.totalCases.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${sla.breached > 20 ? 'text-red-600' : 'text-gray-900'}`}>
                      {sla.breached}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        sla.compliance >= 95 ? 'text-green-600' : 
                        sla.compliance >= 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {sla.compliance}%
                      </span>
                      <Badge className={
                        sla.compliance >= 95 ? 'bg-green-100 text-green-800' : 
                        sla.compliance >= 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }>
                        {sla.compliance >= 95 ? 'Excellent' : sla.compliance >= 90 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{sla.avgResponse}</TableCell>
                  <TableCell>{sla.avgResolution}</TableCell>
                  <TableCell>{getTrendIcon(sla.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Root Cause Analysis */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            SLA Breach Analysis
          </CardTitle>
          <CardDescription>Root cause analysis of SLA breaches for process improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {breachAnalysis.map((analysis, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{analysis.category}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{analysis.count} cases</Badge>
                    <Badge className="bg-orange-100 text-orange-800">{analysis.percentage}%</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Common root causes:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.rootCauses.map((cause, causeIndex) => (
                      <Badge key={causeIndex} variant="outline" className="text-xs">
                        {cause}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
