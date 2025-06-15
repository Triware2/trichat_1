
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Zap, 
  Activity, 
  Settings,
  Play,
  Pause,
  Plus,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';

export const AutomationHub = () => {
  const automationMetrics = [
    { title: 'Active Workflows', value: '247', change: '+18.7%', icon: Bot, color: 'from-blue-400 to-blue-600' },
    { title: 'Tasks Automated', value: '12.4K', change: '+31.2%', icon: Zap, color: 'from-purple-400 to-purple-600' },
    { title: 'Time Saved', value: '847hrs', change: '+28.9%', icon: Clock, color: 'from-green-400 to-green-600' },
    { title: 'Success Rate', value: '99.7%', change: '+0.3%', icon: CheckCircle, color: 'from-emerald-400 to-emerald-600' },
    { title: 'Cost Reduction', value: '$34.2K', change: '+22.1%', icon: TrendingUp, color: 'from-orange-400 to-orange-600' },
    { title: 'Efficiency Gain', value: '67%', change: '+12.4%', icon: Target, color: 'from-indigo-400 to-indigo-600' }
  ];

  const workflows = [
    {
      id: 1,
      name: 'Client Onboarding Automation',
      description: 'Automates new client setup, API key generation, and welcome emails',
      trigger: 'New client registration',
      status: 'active',
      executions: '1,247',
      successRate: '98.9%',
      lastRun: '5 min ago',
      category: 'Client Management'
    },
    {
      id: 2,
      name: 'Usage Alert System',
      description: 'Monitors client usage and sends alerts when approaching limits',
      trigger: 'Usage threshold reached',
      status: 'active',
      executions: '834',
      successRate: '99.8%',
      lastRun: '12 min ago',
      category: 'Monitoring'
    },
    {
      id: 3,
      name: 'Payment Failure Recovery',
      description: 'Handles failed payments with retry logic and notifications',
      trigger: 'Payment failure event',
      status: 'active',
      executions: '156',
      successRate: '94.2%',
      lastRun: '2 hours ago',
      category: 'Billing'
    },
    {
      id: 4,
      name: 'System Health Monitoring',
      description: 'Automatically scales resources based on system load',
      trigger: 'System metrics threshold',
      status: 'active',
      executions: '2,891',
      successRate: '99.9%',
      lastRun: '1 min ago',
      category: 'Infrastructure'
    },
    {
      id: 5,
      name: 'Security Incident Response',
      description: 'Automates response to security threats and anomalies',
      trigger: 'Security alert',
      status: 'paused',
      executions: '23',
      successRate: '100%',
      lastRun: '1 day ago',
      category: 'Security'
    }
  ];

  const automationTemplates = [
    {
      name: 'Customer Support Escalation',
      description: 'Automatically escalate tickets based on priority and response time',
      category: 'Support',
      complexity: 'Medium'
    },
    {
      name: 'Revenue Optimization',
      description: 'Adjusts pricing tiers based on usage patterns and market conditions',
      category: 'Revenue',
      complexity: 'High'
    },
    {
      name: 'Data Backup Orchestration',
      description: 'Manages automated backups with verification and rotation',
      category: 'Infrastructure',
      complexity: 'Low'
    },
    {
      name: 'User Engagement Campaign',
      description: 'Triggers personalized marketing campaigns based on user behavior',
      category: 'Marketing',
      complexity: 'Medium'
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Automation Command Hub</h1>
          </div>
          <p className="text-gray-600 ml-12">Intelligent workflow automation and process optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            Automation Settings
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automationMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <p className="text-sm font-medium text-green-600">{metric.change} from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Workflows */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Active Workflows</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {workflows.filter(w => w.status === 'active').length} Running
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{workflow.name}</h4>
                      <Badge className={workflow.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{workflow.description}</p>
                    <div className="flex items-center space-x-1 mb-2">
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                        {workflow.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                  <div>Executions: {workflow.executions}</div>
                  <div>Success Rate: {workflow.successRate}</div>
                  <div>Trigger: {workflow.trigger}</div>
                  <div>Last Run: {workflow.lastRun}</div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="bg-white/60">
                    {workflow.status === 'active' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    {workflow.status === 'active' ? 'Pause' : 'Resume'}
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Activity className="w-3 h-3 mr-1" />
                    Logs
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Automation Templates */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>Automation Templates</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {automationTemplates.map((template, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        template.complexity === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                        template.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      }`}
                    >
                      {template.complexity}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                  <Plus className="w-3 h-3 mr-1" />
                  Use Template
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Automation Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Zap className="w-8 h-8 mb-2 text-purple-600" />
              <span className="font-semibold">Workflow Builder</span>
              <span className="text-xs text-gray-500">Drag & drop interface</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Clock className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-semibold">Schedule Manager</span>
              <span className="text-xs text-gray-500">Time-based triggers</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Users className="w-8 h-8 mb-2 text-green-600" />
              <span className="font-semibold">Team Collaboration</span>
              <span className="text-xs text-gray-500">Shared workflows</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Target className="w-8 h-8 mb-2 text-orange-600" />
              <span className="font-semibold">Performance Monitor</span>
              <span className="text-xs text-gray-500">Track efficiency</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
