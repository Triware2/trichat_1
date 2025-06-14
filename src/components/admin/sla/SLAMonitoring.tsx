
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Eye,
  RefreshCw,
  Filter
} from 'lucide-react';

export const SLAMonitoring = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedSLA, setSelectedSLA] = useState('all');

  const realTimeData = [
    {
      id: '1',
      caseId: 'CASE-2024-001',
      customer: 'Acme Corp',
      priority: 'critical',
      sla: 'Enterprise VIP',
      status: 'in-progress',
      timeRemaining: '12m',
      progress: 75,
      agent: 'Sarah Johnson',
      milestone: 'First Response'
    },
    {
      id: '2',
      caseId: 'CASE-2024-002',
      customer: 'TechStart Inc',
      priority: 'high',
      sla: 'Business Standard',
      status: 'breach-warning',
      timeRemaining: '3m',
      progress: 95,
      agent: 'Mike Chen',
      milestone: 'Resolution'
    },
    {
      id: '3',
      caseId: 'CASE-2024-003',
      customer: 'Global Solutions',
      priority: 'medium',
      sla: 'Enterprise VIP',
      status: 'on-track',
      timeRemaining: '1h 24m',
      progress: 35,
      agent: 'Emily Rodriguez',
      milestone: 'Follow-up'
    },
    {
      id: '4',
      caseId: 'CASE-2024-004',
      customer: 'StartupXYZ',
      priority: 'low',
      sla: 'Basic Support',
      status: 'breached',
      timeRemaining: 'Overdue 2h',
      progress: 100,
      agent: 'David Kim',
      milestone: 'First Response'
    }
  ];

  const breaches = [
    {
      id: '1',
      caseId: 'CASE-2024-005',
      customer: 'Enterprise Co',
      sla: 'Enterprise VIP',
      breachType: 'response',
      severity: 'major',
      overdue: '45m',
      rootCause: 'Agent unavailable',
      actions: 'Escalated to supervisor'
    },
    {
      id: '2',
      caseId: 'CASE-2024-006',
      customer: 'Business Ltd',
      sla: 'Business Standard',
      breachType: 'resolution',
      severity: 'minor',
      overdue: '15m',
      rootCause: 'Complex technical issue',
      actions: 'Expert consulted'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'breach-warning': return 'bg-yellow-100 text-yellow-800';
      case 'breached': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'major': return 'bg-orange-100 text-orange-800';
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Real-Time SLA Monitoring</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitor SLA compliance and track cases in real-time
          </p>
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
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 text-xs font-medium uppercase tracking-wide">Cases On Track</p>
                <p className="text-2xl font-semibold text-blue-900">24</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 text-xs font-medium uppercase tracking-wide">At Risk</p>
                <p className="text-2xl font-semibold text-yellow-900">8</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 text-xs font-medium uppercase tracking-wide">Breached</p>
                <p className="text-2xl font-semibold text-red-900">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-800 text-xs font-medium uppercase tracking-wide">Compliance Rate</p>
                <p className="text-2xl font-semibold text-emerald-900">94.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases Monitoring */}
      <Card className="border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="w-4 h-4 text-blue-600" />
                Active Cases
              </CardTitle>
              <CardDescription>Real-time monitoring of cases and their SLA progress</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {realTimeData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.caseId}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.sla}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={item.progress} 
                        className={`w-16 h-2 ${
                          item.progress >= 90 ? 'bg-red-100' : 
                          item.progress >= 70 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}
                      />
                      <span className="text-xs text-gray-600">{item.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm ${
                    item.timeRemaining.includes('Overdue') ? 'text-red-600 font-medium' :
                    item.timeRemaining.endsWith('m') && parseInt(item.timeRemaining) < 15 ? 'text-yellow-600' :
                    'text-gray-900'
                  }`}>
                    {item.timeRemaining}
                  </TableCell>
                  <TableCell className="text-sm">{item.agent}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SLA Breaches */}
      <Card className="border border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-700">
            <AlertTriangle className="w-4 h-4" />
            Active SLA Breaches
          </CardTitle>
          <CardDescription>Cases that have exceeded their SLA targets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Breach Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Overdue By</TableHead>
                <TableHead>Root Cause</TableHead>
                <TableHead>Actions Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breaches.map((breach) => (
                <TableRow key={breach.id}>
                  <TableCell className="font-medium">{breach.caseId}</TableCell>
                  <TableCell>{breach.customer}</TableCell>
                  <TableCell className="text-sm">{breach.sla}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{breach.breachType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(breach.severity)}>
                      {breach.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-red-600 font-medium">{breach.overdue}</TableCell>
                  <TableCell className="text-sm">{breach.rootCause}</TableCell>
                  <TableCell className="text-sm">{breach.actions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
