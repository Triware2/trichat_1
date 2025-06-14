
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
  UserCheck
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const teamStats = [
    {
      title: "Active Agents",
      value: "12",
      change: "+2",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Queue Length",
      value: "23",
      change: "-5",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      title: "Avg Response Time",
      value: "1.8m",
      change: "-12%",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Resolution Rate",
      value: "87%",
      change: "+4%",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  const agentPerformance = [
    {
      name: "Sarah Johnson",
      status: "Online",
      chats: 8,
      avgResponse: "1.2m",
      satisfaction: "96%",
      statusColor: "bg-green-500"
    },
    {
      name: "Mike Chen",
      status: "Busy",
      chats: 12,
      avgResponse: "2.1m",
      satisfaction: "94%",
      statusColor: "bg-yellow-500"
    },
    {
      name: "Emily Rodriguez",
      status: "Online",
      chats: 6,
      avgResponse: "1.5m",
      satisfaction: "98%",
      statusColor: "bg-green-500"
    },
    {
      name: "David Kim",
      status: "Away",
      chats: 4,
      avgResponse: "3.2m",
      satisfaction: "91%",
      statusColor: "bg-gray-500"
    }
  ];

  const alerts = [
    {
      type: "High Queue",
      message: "Queue length exceeded threshold (20+)",
      time: "5 minutes ago",
      severity: "high"
    },
    {
      type: "Agent Offline",
      message: "John Smith went offline unexpectedly",
      time: "15 minutes ago",
      severity: "medium"
    },
    {
      type: "SLA Warning",
      message: "3 tickets approaching SLA deadline",
      time: "30 minutes ago",
      severity: "high"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Supervisor Dashboard" 
        role="supervisor"
        userEmail="supervisor@supportpro.com"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Monitor
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Queue Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.change.startsWith('+') || stat.change.includes('%') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} from last hour
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Agent Performance
                  </CardTitle>
                  <CardDescription>
                    Real-time team member status and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agentPerformance.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${agent.statusColor}`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-sm text-gray-500">{agent.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{agent.chats} chats</p>
                          <p className="text-xs text-gray-500">{agent.avgResponse} avg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    System Alerts
                  </CardTitle>
                  <CardDescription>
                    Important notifications requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-red-900">{alert.type}</p>
                          <p className="text-sm text-red-700">{alert.message}</p>
                          <p className="text-xs text-red-600 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Monitoring</CardTitle>
                <CardDescription>Detailed view of agent activities and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed team monitoring interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <CardTitle>Queue Management</CardTitle>
                <CardDescription>Manage customer support queue and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Queue management interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Performance Reports</CardTitle>
                <CardDescription>Generate and view team performance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reporting interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
