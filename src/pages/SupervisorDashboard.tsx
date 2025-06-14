
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  UserCheck,
  Zap,
  Target,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { TeamMonitor } from '@/components/supervisor/TeamMonitor';
import { QueueManagement } from '@/components/supervisor/QueueManagement';
import { Reports } from '@/components/supervisor/Reports';
import { ChatSupervision } from '@/components/supervisor/ChatSupervision';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const teamStats = [
    {
      title: "Active Agents",
      value: "12",
      change: "+2",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Queue Length",
      value: "23",
      change: "-5",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Avg Response Time",
      value: "1.8m",
      change: "-12%",
      icon: Clock,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Resolution Rate",
      value: "87%",
      change: "+4%",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  const agentPerformance = [
    {
      name: "Sarah Johnson",
      status: "Online",
      chats: 8,
      avgResponse: "1.2m",
      satisfaction: "96%",
      statusColor: "bg-emerald-500",
      performance: "excellent"
    },
    {
      name: "Mike Chen",
      status: "Busy",
      chats: 12,
      avgResponse: "2.1m",
      satisfaction: "94%",
      statusColor: "bg-yellow-500",
      performance: "good"
    },
    {
      name: "Emily Rodriguez",
      status: "Online",
      chats: 6,
      avgResponse: "1.5m",
      satisfaction: "98%",
      statusColor: "bg-emerald-500",
      performance: "excellent"
    },
    {
      name: "David Kim",
      status: "Away",
      chats: 4,
      avgResponse: "3.2m",
      satisfaction: "91%",
      statusColor: "bg-slate-500",
      performance: "average"
    }
  ];

  const alerts = [
    {
      type: "High Queue",
      message: "Queue length exceeded threshold (20+)",
      time: "5 minutes ago",
      severity: "high",
      color: "border-red-500 bg-red-50",
      iconColor: "text-red-600"
    },
    {
      type: "Agent Offline",
      message: "John Smith went offline unexpectedly",
      time: "15 minutes ago",
      severity: "medium",
      color: "border-yellow-500 bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      type: "SLA Warning",
      message: "3 tickets approaching SLA deadline",
      time: "30 minutes ago",
      severity: "high",
      color: "border-red-500 bg-red-50",
      iconColor: "text-red-600"
    }
  ];

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      'excellent': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'good': 'bg-blue-100 text-blue-800 border-blue-200',
      'average': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return variants[performance as keyof typeof variants] || variants.average;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Supervisor Dashboard" 
        role="supervisor"
        userEmail="supervisor@trichat.com"
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Supervisor Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor team performance and optimize support operations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="-mb-px">
              <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
                <div className="flex space-x-0">
                  <TabsTrigger
                    value="overview"
                    onClick={() => setActiveTab('overview')}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                      border-b-2 border-transparent whitespace-nowrap
                      ${activeTab === 'overview' 
                        ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <Activity className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="chats"
                    onClick={() => setActiveTab('chats')}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                      border-b-2 border-transparent whitespace-nowrap
                      ${activeTab === 'chats' 
                        ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <Eye className="w-4 h-4" />
                    Chat Supervision
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    onClick={() => setActiveTab('team')}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                      border-b-2 border-transparent whitespace-nowrap
                      ${activeTab === 'team' 
                        ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <Users className="w-4 h-4" />
                    Team Monitor
                  </TabsTrigger>
                  <TabsTrigger
                    value="queue"
                    onClick={() => setActiveTab('queue')}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                      border-b-2 border-transparent whitespace-nowrap
                      ${activeTab === 'queue' 
                        ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Queue Management
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    onClick={() => setActiveTab('reports')}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                      border-b-2 border-transparent whitespace-nowrap
                      ${activeTab === 'reports' 
                        ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Reports
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Team Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamStats.map((stat, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <stat.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <Badge className={`${stat.bgColor} ${stat.textColor} border-0 text-xs px-2 py-1`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
                      <p className="text-xs text-gray-500">from last hour</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Team Performance */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        Agent Performance
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-gray-600">
                        Real-time team member status and metrics
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agentPerformance.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${agent.statusColor} flex-shrink-0`}></div>
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium text-xs flex-shrink-0">
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{agent.name}</p>
                              <p className="text-xs text-gray-600">{agent.status}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-medium text-gray-900">{agent.chats} chats</p>
                            <p className="text-xs text-gray-500">{agent.avgResponse} avg</p>
                          </div>
                          <Badge className={`${getPerformanceBadge(agent.performance)} border text-xs`}>
                            {agent.satisfaction}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                        System Alerts
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-gray-600">
                        Important notifications requiring attention
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-1">
                      {alerts.length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${alert.color} transition-all hover:shadow-sm`}>
                        <AlertTriangle className={`w-4 h-4 ${alert.iconColor} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 text-sm">{alert.type}</p>
                            <Badge variant="outline" className="text-xs">
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-700 mb-1">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-emerald-200 bg-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-800 text-xs font-medium tracking-wide uppercase">Today's Target</p>
                      <p className="text-xl font-semibold text-emerald-900 tracking-tight">95%</p>
                      <p className="text-emerald-700 text-xs">Resolution Rate</p>
                    </div>
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 text-xs font-medium tracking-wide uppercase">Peak Performance</p>
                      <p className="text-xl font-semibold text-blue-900 tracking-tight">98.2%</p>
                      <p className="text-blue-700 text-xs">This Week</p>
                    </div>
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-800 text-xs font-medium tracking-wide uppercase">Team Efficiency</p>
                      <p className="text-xl font-semibold text-purple-900 tracking-tight">89%</p>
                      <p className="text-purple-700 text-xs">Above Baseline</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chats">
            <ChatSupervision />
          </TabsContent>

          <TabsContent value="team">
            <TeamMonitor />
          </TabsContent>

          <TabsContent value="queue">
            <QueueManagement />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
