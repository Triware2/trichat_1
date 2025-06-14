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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavigationHeader 
        title="Supervisor Dashboard" 
        role="supervisor"
        userEmail="supervisor@trichat.com"
      />
      
      <div className="w-full min-h-[calc(100vh-64px)] px-4 lg:px-8 py-6 lg:py-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-lexend font-semibold text-slate-900 tracking-tight">
                  Supervisor Control Hub
                </h1>
                <p className="text-base text-slate-600 mt-2 font-lexend font-normal leading-relaxed">
                  Monitor team performance and optimize support operations
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Button variant="outline" size="default" className="font-lexend font-medium h-9 px-5 text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button size="default" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-lexend font-medium h-9 px-5 text-sm shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm rounded-xl p-1 h-auto">
              <TabsTrigger 
                value="overview" 
                className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium text-sm py-2.5 px-3"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chats" 
                className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium text-sm py-2.5 px-3"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Chat Supervision</span>
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium text-sm py-2.5 px-3"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team Monitor</span>
              </TabsTrigger>
              <TabsTrigger 
                value="queue" 
                className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium text-sm py-2.5 px-3"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Queue Management</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium text-sm py-2.5 px-3"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Team Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <Badge className={`${stat.bgColor} ${stat.textColor} border-0 font-lexend font-medium text-xs px-2 py-1`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs font-lexend font-medium text-slate-600 mb-1 tracking-wide uppercase">{stat.title}</p>
                        <p className="text-xl font-lexend font-bold text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-xs font-lexend text-slate-500 mt-1">from last hour</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Team Performance */}
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-lg font-lexend font-semibold text-slate-900">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                          Agent Performance
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm font-lexend text-slate-600">
                          Real-time team member status and metrics
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="font-lexend font-medium">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {agentPerformance.map((agent, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full ${agent.statusColor} flex-shrink-0`}></div>
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-700 font-medium text-xs flex-shrink-0">
                                {agent.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900 text-sm truncate">{agent.name}</p>
                                <p className="text-xs text-slate-600">{agent.status}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-medium text-slate-900">{agent.chats} chats</p>
                              <p className="text-xs text-slate-500">{agent.avgResponse} avg</p>
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
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-lg font-lexend font-semibold text-slate-900">
                          <AlertTriangle className="w-5 h-5 text-blue-600" />
                          System Alerts
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm font-lexend text-slate-600">
                          Important notifications requiring attention
                        </CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200 font-lexend font-medium text-xs px-2 py-1">
                        {alerts.length} Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.map((alert, index) => (
                        <div key={index} className={`flex items-start gap-3 p-3 rounded-xl border-l-4 ${alert.color} transition-all hover:shadow-md`}>
                          <AlertTriangle className={`w-4 h-4 ${alert.iconColor} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-slate-900 text-sm">{alert.type}</p>
                              <Badge variant="outline" className="text-xs">
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-700 mb-2">{alert.message}</p>
                            <p className="text-xs text-slate-500">{alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-xs font-lexend font-medium tracking-wide uppercase">Today's Target</p>
                        <p className="text-2xl font-lexend font-bold tracking-tight">95%</p>
                        <p className="text-emerald-100 text-xs font-lexend">Resolution Rate</p>
                      </div>
                      <Target className="w-7 h-7 text-emerald-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs font-lexend font-medium tracking-wide uppercase">Peak Performance</p>
                        <p className="text-2xl font-lexend font-bold tracking-tight">98.2%</p>
                        <p className="text-blue-100 text-xs font-lexend">This Week</p>
                      </div>
                      <Zap className="w-7 h-7 text-blue-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs font-lexend font-medium tracking-wide uppercase">Team Efficiency</p>
                        <p className="text-2xl font-lexend font-bold tracking-tight">89%</p>
                        <p className="text-purple-100 text-xs font-lexend">Above Baseline</p>
                      </div>
                      <TrendingUp className="w-7 h-7 text-purple-100" />
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
    </div>
  );
};

export default SupervisorDashboard;
