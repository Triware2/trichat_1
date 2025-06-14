
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  UserPlus, 
  Shield, 
  Globe,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ChatWidgetGenerator } from '@/components/admin/ChatWidgetGenerator';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Active Chats",
      value: "89",
      change: "+5%",
      changeType: "increase",
      icon: MessageSquare,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Response Time",
      value: "2.3m",
      change: "-15%",
      changeType: "decrease",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Satisfaction",
      value: "94%",
      change: "+3%",
      changeType: "increase",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  const recentActivities = [
    {
      type: "user_added",
      message: "New agent Sarah Johnson added to team",
      time: "2 minutes ago",
      icon: UserPlus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      type: "system_update",
      message: "Chat widget updated for client portal",
      time: "1 hour ago",
      icon: Settings,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      type: "alert",
      message: "High volume of chats detected",
      time: "2 hours ago",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      type: "performance",
      message: "Weekly performance report generated",
      time: "4 hours ago",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const quickActions = [
    {
      title: "Add New User",
      description: "Create new agent or supervisor account",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Generate Report",
      description: "Create comprehensive analytics report",
      icon: BarChart3,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Update Chat Widget",
      description: "Modify widget settings and appearance",
      icon: Globe,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "System Settings",
      description: "Configure system-wide preferences",
      icon: Settings,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <NavigationHeader 
        title="Admin Dashboard" 
        role="admin"
        userEmail="admin@supportpro.com"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Command Center</h1>
              <p className="text-slate-600">Manage users, monitor system performance, and configure settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Quick Setup
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm rounded-xl p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="widget" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Globe className="w-4 h-4" />
              Widget
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${stat.bgColor} ${stat.textColor} border-0`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stat.changeType === 'increase' ? '↗️' : '↘️'} from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Activity className="w-5 h-5 text-orange-600" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Latest system events and user actions
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className={`w-10 h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 mb-1">{activity.message}</p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="w-5 h-5 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div key={index} className="group p-4 rounded-xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 group-hover:text-orange-700 transition-colors">{action.title}</h4>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="widget">
            <ChatWidgetGenerator />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
