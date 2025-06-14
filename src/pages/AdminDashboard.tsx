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
  Plus,
  Lock
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ChatWidgetGenerator } from '@/components/admin/ChatWidgetGenerator';
import { AccessManagement } from '@/components/admin/access/AccessManagement';

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
        userEmail="admin@trichat.com"
      />
      
      <div className="w-full min-h-[calc(100vh-64px)] px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-heading-1 font-lexend font-medium text-slate-900 truncate">Admin Command Center</h1>
                <p className="text-body text-slate-600 mt-1 font-lexend">Manage users, monitor system performance, and configure settings</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Button variant="outline" size="sm" className="font-lexend font-medium">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Export Data
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-lexend font-medium">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Quick Setup
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 lg:space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-white border shadow-sm rounded-xl p-1 h-auto">
              <TabsTrigger 
                value="overview" 
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="access" 
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Access</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="widget" 
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Widget</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 lg:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <Badge className={`${stat.bgColor} ${stat.textColor} border-0 font-lexend font-medium`}>
                          <TrendingUp className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-caption font-lexend font-medium text-slate-600 mb-1">{stat.title}</p>
                        <p className="text-2xl lg:text-3xl font-lexend font-semibold text-slate-900">{stat.value}</p>
                        <p className="text-caption font-lexend text-slate-500 mt-1">
                          {stat.changeType === 'increase' ? '↗️' : '↘️'} from last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Recent Activity */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-3 lg:pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-heading-3 font-lexend font-medium">
                          <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="mt-1 text-caption font-lexend">
                          Latest system events and user actions
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="font-lexend font-medium">
                        <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 lg:space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <activity.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-caption font-lexend font-medium text-slate-900 mb-1">{activity.message}</p>
                            <p className="text-caption font-lexend text-slate-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="flex items-center gap-2 text-heading-3 font-lexend font-medium">
                      <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="mt-1 text-caption font-lexend">
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 lg:space-y-4">
                    {quickActions.map((action, index) => (
                      <div key={index} className="group p-3 lg:p-4 rounded-xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-lexend font-medium text-slate-900 group-hover:text-orange-700 transition-colors text-body">{action.title}</h4>
                            <p className="text-caption font-lexend text-slate-600">{action.description}</p>
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

            <TabsContent value="access">
              <AccessManagement />
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
    </div>
  );
};

export default AdminDashboard;
