
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Settings,
  Plus,
  BarChart3,
  Users,
  Bell
} from 'lucide-react';
import { SLAConfiguration } from './SLAConfiguration';
import { SLAMonitoring } from './SLAMonitoring';
import { EscalationManagement } from './EscalationManagement';
import { SLAReporting } from './SLAReporting';
import { SLANotifications } from './SLANotifications';

export const SLAManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const slaStats = [
    {
      title: "Active SLAs",
      value: "8",
      change: "+2",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Compliance Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Active Breaches",
      value: "12",
      change: "-3",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Avg Response Time",
      value: "18m",
      change: "-5m",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const handleCreateSLA = () => {
    console.log('Create SLA clicked - switching to configuration tab');
    setActiveTab('configuration');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">SLA Management</h1>
        </div>
        <p className="text-sm text-slate-600">
          Define and monitor service level agreements for customer support
        </p>
      </div>

      {/* SLA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {slaStats.map((stat, index) => (
          <Card key={index} className="border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="border border-slate-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="h-auto bg-transparent p-0 space-x-0">
              <div className="flex">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="configuration" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Settings className="w-4 h-4" />
                  Configuration
                </TabsTrigger>
                <TabsTrigger 
                  value="monitoring" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Clock className="w-4 h-4" />
                  Monitoring
                </TabsTrigger>
                <TabsTrigger 
                  value="escalation" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Escalation
                </TabsTrigger>
                <TabsTrigger 
                  value="reporting" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <BarChart3 className="w-4 h-4" />
                  Reporting
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-base font-bold text-slate-900">Active SLA Rules</CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      Currently active service level agreements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* SLA rules content */}
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-500">SLA rules will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-base font-bold text-slate-900">Recent Breaches</CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      Latest SLA violations and escalations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Breaches content */}
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-500">Recent breaches will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="mt-0 p-6">
            <SLAConfiguration />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-0 p-6">
            <SLAMonitoring />
          </TabsContent>

          <TabsContent value="escalation" className="mt-0 p-6">
            <EscalationManagement />
          </TabsContent>

          <TabsContent value="reporting" className="mt-0 p-6">
            <SLAReporting />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 p-6">
            <SLANotifications />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
