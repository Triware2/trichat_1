
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">SLA Management</h1>
          <p className="text-gray-600 mt-1">
            Configure and monitor Service Level Agreements across your platform
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateSLA}>
          <Plus className="w-4 h-4 mr-2" />
          Create SLA
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slaStats.map((stat, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white border-b border-gray-200 -mx-6 px-6">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <div className="flex space-x-0 overflow-x-auto">
              <TabsTrigger
                value="overview"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'overview' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="configuration"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'configuration' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger
                value="monitoring"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'monitoring' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Clock className="w-4 h-4" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger
                value="escalation"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'escalation' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Users className="w-4 h-4" />
                Escalation
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'notifications' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="reporting"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'reporting' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                Reporting
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <div className="px-6">
          <TabsContent value="overview" className="mt-0">
            <SLAMonitoring />
          </TabsContent>

          <TabsContent value="configuration" className="mt-0">
            <SLAConfiguration />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-0">
            <SLAMonitoring />
          </TabsContent>

          <TabsContent value="escalation" className="mt-0">
            <EscalationManagement />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <SLANotifications />
          </TabsContent>

          <TabsContent value="reporting" className="mt-0">
            <SLAReporting />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
