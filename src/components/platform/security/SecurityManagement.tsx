
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Lock,
  Settings,
  Eye
} from 'lucide-react';

export const SecurityManagement = () => {
  const securityAlerts = [
    { id: 1, type: 'high', message: 'Multiple failed login attempts detected', time: '5 min ago' },
    { id: 2, type: 'medium', message: 'API key accessed from new location', time: '1 hour ago' },
    { id: 3, type: 'low', message: 'User password will expire in 7 days', time: '2 hours ago' }
  ];

  const accessLogs = [
    { user: 'admin@platform.com', action: 'Client data accessed', time: '10 min ago', status: 'success' },
    { user: 'manager@platform.com', action: 'Pricing updated', time: '30 min ago', status: 'success' },
    { user: 'unknown@example.com', action: 'Failed login attempt', time: '1 hour ago', status: 'failed' }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & Access Control</h1>
          <p className="text-gray-600 mt-1">Monitor and manage platform security</p>
        </div>
        <Button className="bg-blue-600">
          <Settings className="w-4 h-4 mr-2" />
          Security Settings
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-gray-600">Excellent security posture</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-600">Current active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-gray-600">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                  alert.type === 'high' ? 'text-red-600' :
                  alert.type === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <Badge className={
                  alert.type === 'high' ? 'bg-red-100 text-red-700' :
                  alert.type === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }>
                  {alert.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Access Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium">{log.user}</p>
                  <p className="text-xs text-gray-600">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.time}</p>
                </div>
                <Badge className={log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {log.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
