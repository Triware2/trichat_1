
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Cloud, 
  Plus, 
  Play, 
  Pause,
  Trash2,
  Settings,
  Copy,
  RefreshCw,
  Monitor,
  Database,
  Shield,
  Clock,
  Activity
} from 'lucide-react';

interface SandboxEnvironment {
  id: string;
  name: string;
  description: string;
  type: 'development' | 'testing' | 'staging' | 'demo';
  status: 'running' | 'stopped' | 'deploying' | 'error';
  version: string;
  createdDate: string;
  lastActivity: string;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  deployments: number;
  uptime: string;
}

export const SandboxEnvironment = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEnvironment, setNewEnvironment] = useState({
    name: '',
    description: '',
    type: 'development' as const
  });

  const [environments] = useState<SandboxEnvironment[]>([
    {
      id: '1',
      name: 'Development Sandbox',
      description: 'Primary development environment for testing new features',
      type: 'development',
      status: 'running',
      version: 'v2.3.1',
      createdDate: '2024-01-15',
      lastActivity: '5 minutes ago',
      resources: {
        cpu: 45,
        memory: 62,
        storage: 34
      },
      deployments: 127,
      uptime: '99.8%'
    },
    {
      id: '2',
      name: 'Feature Testing Lab',
      description: 'Isolated environment for testing experimental features',
      type: 'testing',
      status: 'running',
      version: 'v2.4.0-beta',
      createdDate: '2024-02-01',
      lastActivity: '2 hours ago',
      resources: {
        cpu: 23,
        memory: 41,
        storage: 18
      },
      deployments: 45,
      uptime: '98.9%'
    },
    {
      id: '3',
      name: 'Client Demo Environment',
      description: 'Clean environment for client demonstrations',
      type: 'demo',
      status: 'stopped',
      version: 'v2.3.0',
      createdDate: '2024-01-20',
      lastActivity: '1 day ago',
      resources: {
        cpu: 0,
        memory: 0,
        storage: 12
      },
      deployments: 8,
      uptime: '99.2%'
    },
    {
      id: '4',
      name: 'Pre-Production Staging',
      description: 'Final testing before production deployment',
      type: 'staging',
      status: 'deploying',
      version: 'v2.4.0-rc1',
      createdDate: '2024-02-10',
      lastActivity: 'deploying...',
      resources: {
        cpu: 78,
        memory: 85,
        storage: 56
      },
      deployments: 23,
      uptime: '99.9%'
    }
  ]);

  const handleCreateEnvironment = () => {
    if (!newEnvironment.name) {
      toast({
        title: "Missing Information",
        description: "Please provide an environment name.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Environment Creating",
      description: `${newEnvironment.name} is being created and will be ready shortly.`,
    });

    setIsCreateOpen(false);
    setNewEnvironment({
      name: '',
      description: '',
      type: 'development'
    });
  };

  const handleToggleEnvironment = (envId: string, currentStatus: string, envName: string) => {
    const newStatus = currentStatus === 'running' ? 'stopped' : 'running';
    toast({
      title: `Environment ${newStatus === 'running' ? 'Started' : 'Stopped'}`,
      description: `${envName} has been ${newStatus === 'running' ? 'started' : 'stopped'}.`,
    });
  };

  const handleDeleteEnvironment = (envId: string, envName: string) => {
    toast({
      title: "Environment Deleted",
      description: `${envName} has been removed.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'stopped': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'deploying': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'staging': return 'bg-purple-100 text-purple-800';
      case 'demo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Sandbox Environments</h2>
          <p className="text-gray-600">Manage isolated environments for development and testing</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Environment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create Sandbox Environment</DialogTitle>
              <DialogDescription>
                Set up a new isolated environment for development or testing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="env-name">Environment Name</Label>
                <Input
                  id="env-name"
                  value={newEnvironment.name}
                  onChange={(e) => setNewEnvironment({...newEnvironment, name: e.target.value})}
                  placeholder="e.g., Feature Branch Test"
                />
              </div>
              
              <div>
                <Label htmlFor="env-description">Description</Label>
                <Input
                  id="env-description"
                  value={newEnvironment.description}
                  onChange={(e) => setNewEnvironment({...newEnvironment, description: e.target.value})}
                  placeholder="Brief description of the environment purpose"
                />
              </div>

              <div>
                <Label htmlFor="env-type">Environment Type</Label>
                <Select value={newEnvironment.type} onValueChange={(value: any) => setNewEnvironment({...newEnvironment, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateEnvironment} className="w-full">
                Create Environment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Environment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Environments</p>
                <p className="text-2xl font-bold">{environments.length}</p>
              </div>
              <Cloud className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Running</p>
                <p className="text-2xl font-bold text-green-600">
                  {environments.filter(e => e.status === 'running').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deployments</p>
                <p className="text-2xl font-bold">
                  {environments.reduce((sum, e) => sum + e.deployments, 0)}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Uptime</p>
                <p className="text-2xl font-bold text-green-600">99.5%</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {environments.map((env) => (
          <Card key={env.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{env.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(env.status)}>
                    {env.status}
                  </Badge>
                  <Badge className={getTypeColor(env.type)}>
                    {env.type}
                  </Badge>
                </div>
              </div>
              <CardDescription>{env.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Environment Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Version</p>
                    <p className="font-medium">{env.version}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Uptime</p>
                    <p className="font-medium">{env.uptime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Deployments</p>
                    <p className="font-medium">{env.deployments}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Activity</p>
                    <p className="font-medium">{env.lastActivity}</p>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Resource Usage</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU</span>
                      <span>{env.resources.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full" 
                        style={{width: `${env.resources.cpu}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Memory</span>
                      <span>{env.resources.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-600 h-1 rounded-full" 
                        style={{width: `${env.resources.memory}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Storage</span>
                      <span>{env.resources.storage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-purple-600 h-1 rounded-full" 
                        style={{width: `${env.resources.storage}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleEnvironment(env.id, env.status, env.name)}
                    disabled={env.status === 'deploying'}
                  >
                    {env.status === 'running' ? (
                      <Pause className="w-4 h-4 mr-1" />
                    ) : (
                      <Play className="w-4 h-4 mr-1" />
                    )}
                    {env.status === 'running' ? 'Stop' : 'Start'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Monitor className="w-4 h-4 mr-1" />
                    Console
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteEnvironment(env.id, env.name)}
                    className="text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
