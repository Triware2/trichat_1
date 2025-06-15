
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Clock,
  Globe,
  Database,
  Settings,
  Scan,
  FileText
} from 'lucide-react';

export const SecurityCenter = () => {
  const securityMetrics = [
    { title: 'Security Score', value: '98.7%', change: '+2.1%', icon: Shield, color: 'from-green-400 to-green-600', status: 'excellent' },
    { title: 'Threat Detection', value: '24/7', change: 'Active', icon: Eye, color: 'from-blue-400 to-blue-600', status: 'active' },
    { title: 'Failed Logins', value: '12', change: '-45%', icon: Lock, color: 'from-red-400 to-red-600', status: 'low' },
    { title: 'API Keys Active', value: '847', change: '+8%', icon: Key, color: 'from-purple-400 to-purple-600', status: 'normal' },
    { title: 'Access Violations', value: '0', change: '-100%', icon: AlertTriangle, color: 'from-orange-400 to-orange-600', status: 'none' },
    { title: 'Compliance Score', value: '99.2%', change: '+0.8%', icon: CheckCircle, color: 'from-emerald-400 to-emerald-600', status: 'excellent' }
  ];

  const accessLogs = [
    { user: 'admin@platform.com', action: 'System Configuration Access', ip: '192.168.1.100', time: '2 min ago', status: 'success' },
    { user: 'sarah.chen@techcorp.com', action: 'Client Data Export', ip: '10.0.1.45', time: '15 min ago', status: 'success' },
    { user: 'unknown', action: 'Failed Admin Login', ip: '203.0.113.45', time: '1 hour ago', status: 'blocked' },
    { user: 'marcus.j@innovate.io', action: 'API Key Generation', ip: '172.16.0.23', time: '2 hours ago', status: 'success' },
    { user: 'system', action: 'Automated Security Scan', ip: 'internal', time: '4 hours ago', status: 'completed' }
  ];

  const securityPolicies = [
    { name: 'Password Policy', status: 'active', compliance: 98, lastUpdated: '2024-06-01' },
    { name: 'API Rate Limiting', status: 'active', compliance: 100, lastUpdated: '2024-05-15' },
    { name: 'Two-Factor Authentication', status: 'active', compliance: 89, lastUpdated: '2024-06-10' },
    { name: 'Data Encryption', status: 'active', compliance: 100, lastUpdated: '2024-05-20' },
    { name: 'Access Control', status: 'active', compliance: 95, lastUpdated: '2024-06-05' },
    { name: 'Audit Logging', status: 'active', compliance: 100, lastUpdated: '2024-06-12' }
  ];

  const threatAlerts = [
    { 
      id: 1, 
      type: 'high', 
      title: 'Suspicious API Access Pattern',
      description: 'Unusual API calls from IP 198.51.100.42', 
      time: '5 min ago',
      action: 'IP temporarily blocked'
    },
    { 
      id: 2, 
      type: 'medium', 
      title: 'Multiple Failed Login Attempts',
      description: 'Account: admin@techcorp.com - 5 failed attempts', 
      time: '1 hour ago',
      action: 'Account temporarily locked'
    },
    { 
      id: 3, 
      type: 'low', 
      title: 'New Device Login',
      description: 'User logged in from unrecognized device', 
      time: '3 hours ago',
      action: 'Email notification sent'
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Security Control Center</h1>
          </div>
          <p className="text-gray-600 ml-12">Advanced security monitoring and access control</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Scan className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
            <FileText className="w-4 h-4 mr-2" />
            Audit Report
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityMetrics.map((metric, index) => {
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
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <Badge 
                    variant="outline"
                    className={`${
                      metric.status === 'excellent' ? 'bg-green-100 text-green-700 border-green-200' :
                      metric.status === 'active' || metric.status === 'normal' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      metric.status === 'low' || metric.status === 'none' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {metric.status}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${
                  metric.change.includes('+') && !metric.title.includes('Failed') && !metric.title.includes('API Keys') ? 'text-green-600' : 
                  metric.change.includes('-') ? 'text-green-600' :
                  metric.change === 'Active' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {metric.change} {metric.change !== 'Active' ? 'from last week' : 'monitoring'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Access Logs */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Real-time Access Logs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className={`p-1 rounded-full ${
                  log.status === 'success' ? 'bg-green-100' :
                  log.status === 'blocked' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   log.status === 'blocked' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                   <Clock className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{log.action}</h4>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>User: {log.user}</span>
                    <span>•</span>
                    <span>IP: {log.ip}</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs mt-2 ${
                      log.status === 'success' || log.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                      log.status === 'blocked' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Policies */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Lock className="w-5 h-5 text-green-600" />
              <span>Security Policies</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityPolicies.map((policy, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{policy.name}</h4>
                    <Badge 
                      variant="outline"
                      className="text-xs bg-green-100 text-green-700 border-green-200"
                    >
                      {policy.status}
                    </Badge>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{policy.compliance}%</span>
                </div>
                <Progress 
                  value={policy.compliance} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500">
                  Last updated: {policy.lastUpdated}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Threat Alerts */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Active Threat Alerts</span>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              {threatAlerts.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {threatAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`p-1 rounded-full ${
                alert.type === 'high' ? 'bg-red-100' :
                alert.type === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.type === 'high' ? 'text-red-600' :
                  alert.type === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{alert.title}</h4>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      alert.type === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                      alert.type === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    {alert.type} priority
                  </Badge>
                  <span className="text-xs text-gray-600">Action: {alert.action}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
