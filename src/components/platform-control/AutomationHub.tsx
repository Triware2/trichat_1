
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  Play, 
  Clock, 
  Zap, 
  Plus,
  Shield,
  Settings
} from 'lucide-react';

export const AutomationHub = () => {
  const automationMetrics = [
    { 
      title: 'Active Workflows', 
      value: '847', 
      change: '+127', 
      icon: Workflow, 
      trend: 'up'
    },
    { 
      title: 'Executions (24h)', 
      value: '12,847', 
      change: '+2,134', 
      icon: Play, 
      trend: 'up'
    },
    { 
      title: 'Scheduled Tasks', 
      value: '234', 
      change: '+23', 
      icon: Clock, 
      trend: 'up'
    },
    { 
      title: 'Success Rate', 
      value: '99.2%', 
      change: '+0.8%', 
      icon: Zap, 
      trend: 'up'
    }
  ];

  const workflows = [
    { 
      id: 1, 
      name: 'Customer Onboarding Flow',
      trigger: 'User Registration', 
      status: 'active',
      executions: '2,847',
      lastRun: '5 minutes ago'
    },
    { 
      id: 2, 
      name: 'Daily Report Generation',
      trigger: 'Scheduled', 
      status: 'active',
      executions: '365',
      lastRun: '2 hours ago'
    },
    { 
      id: 3, 
      name: 'Alert Escalation',
      trigger: 'System Alert', 
      status: 'paused',
      executions: '127',
      lastRun: '1 day ago'
    }
  ];

  const automationTasks = [
    { 
      id: 1, 
      task: 'Database Backup',
      type: 'System', 
      schedule: 'Daily at 2:00 AM',
      status: 'completed',
      nextRun: 'Tomorrow at 2:00 AM'
    },
    { 
      id: 2, 
      task: 'Performance Analytics',
      type: 'Analytics', 
      schedule: 'Every 6 hours',
      status: 'running',
      nextRun: 'In 3 hours'
    },
    { 
      id: 3, 
      task: 'Security Scan',
      type: 'Security', 
      schedule: 'Weekly on Monday',
      status: 'scheduled',
      nextRun: 'Monday at 9:00 AM'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Automation Hub</h1>
          <p className="text-gray-600">Workflow automation and scheduled task management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Automation Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {automationMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600">
                    +{metric.change} this month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Workflows */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Workflow className="w-5 h-5 text-gray-600" />
              <span>Active Workflows</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    workflow.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Play className={`w-3 h-3 ${
                      workflow.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{workflow.name}</h4>
                    <p className="text-sm text-gray-600">{workflow.trigger} • {workflow.executions} runs</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      workflow.status === 'active' ? 'text-green-700 border-green-300' :
                      'text-gray-700 border-gray-300'
                    }`}
                  >
                    {workflow.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{workflow.lastRun}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scheduled Tasks */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Clock className="w-5 h-5 text-gray-600" />
              <span>Scheduled Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {automationTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100' :
                    task.status === 'running' ? 'bg-blue-100' : 'bg-yellow-100'
                  }`}>
                    <Clock className={`w-3 h-3 ${
                      task.status === 'completed' ? 'text-green-600' :
                      task.status === 'running' ? 'text-blue-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{task.task}</h4>
                    <p className="text-sm text-gray-600">{task.type} • {task.schedule}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      task.status === 'completed' ? 'text-green-700 border-green-300' :
                      task.status === 'running' ? 'text-blue-700 border-blue-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {task.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{task.nextRun}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
