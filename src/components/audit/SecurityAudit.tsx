
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Lock, Key, Database } from 'lucide-react';

export const SecurityAudit = () => {
  const securityChecks = [
    {
      category: 'Authentication',
      status: 'pass',
      description: 'Supabase Auth properly configured with secure token handling',
      recommendation: 'Continue monitoring session management'
    },
    {
      category: 'Authorization',
      status: 'warning',
      description: 'Some tables missing Row Level Security policies',
      recommendation: 'Implement RLS on all user-accessible tables'
    },
    {
      category: 'Data Encryption',
      status: 'pass',
      description: 'Data encrypted at rest and in transit via Supabase',
      recommendation: 'Regular security updates and monitoring'
    },
    {
      category: 'API Security',
      status: 'warning',
      description: 'Some endpoints lack rate limiting',
      recommendation: 'Implement rate limiting for public endpoints'
    },
    {
      category: 'Input Validation',
      status: 'fail',
      description: 'Inconsistent client-side and server-side validation',
      recommendation: 'Standardize validation schemas across all forms'
    },
    {
      category: 'Session Management',
      status: 'pass',
      description: 'Proper session timeout and refresh token handling',
      recommendation: 'Continue current implementation'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Security Audit</h2>
          <p className="text-gray-600">Comprehensive security assessment and compliance review</p>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <strong>Priority Actions Required:</strong> Address input validation and implement missing RLS policies
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {securityChecks.map((check, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <CardTitle className="text-lg">{check.category}</CardTitle>
                </div>
                <Badge className={getStatusColor(check.status)}>
                  {check.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">{check.description}</p>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Recommendation:</strong> {check.recommendation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium">GDPR Ready</h3>
              <p className="text-sm text-gray-600">Data handling compliant</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-medium">SOC 2 Progress</h3>
              <p className="text-sm text-gray-600">Security controls in review</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">ISO 27001</h3>
              <p className="text-sm text-gray-600">Information security standards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
