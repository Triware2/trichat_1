
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Shield,
  Zap,
  Eye,
  Database,
  Bell,
  CreditCard
} from 'lucide-react';

interface AuditIssue {
  id: string;
  category: string;
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
  title: string;
  description: string;
  component: string;
  status: 'identified' | 'in-progress' | 'fixed' | 'verified';
  impact: string;
  recommendation: string;
}

export const AuditReport = () => {
  const [auditIssues] = useState<AuditIssue[]>([
    {
      id: 'FUNC-001',
      category: 'Functional Workflow',
      severity: 'critical',
      title: 'Chat assignment workflow broken in edge cases',
      description: 'When multiple agents are available with same skill level, assignment algorithm fails',
      component: 'ChatAssignment',
      status: 'fixed',
      impact: 'High - affects customer support efficiency',
      recommendation: 'Implement round-robin fallback logic'
    },
    {
      id: 'UI-001',
      category: 'UI/UX',
      severity: 'major',
      title: 'Mobile navigation menu overlapping content',
      description: 'On tablets, the mobile menu button overlaps with dashboard content',
      component: 'AdminDashboard',
      status: 'fixed',
      impact: 'Medium - affects user experience on tablets',
      recommendation: 'Adjust z-index and positioning for mobile menu'
    },
    {
      id: 'PERF-001',
      category: 'Performance',
      severity: 'major',
      title: 'Large file components causing bundle bloat',
      description: 'Several components exceed 200+ lines, affecting load times',
      component: 'Multiple',
      status: 'identified',
      impact: 'Medium - slower initial page loads',
      recommendation: 'Refactor large components into smaller, focused modules'
    },
    {
      id: 'SEC-001',
      category: 'Security',
      severity: 'critical',
      title: 'Missing RLS policies on sensitive tables',
      description: 'Some database tables lack proper Row Level Security policies',
      component: 'Database',
      status: 'identified',
      impact: 'High - potential data exposure',
      recommendation: 'Implement comprehensive RLS policies'
    },
    {
      id: 'INT-001',
      category: 'Integration',
      severity: 'minor',
      title: 'API error handling inconsistent',
      description: 'Some API calls lack proper error boundaries and fallback states',
      component: 'API Layer',
      status: 'in-progress',
      impact: 'Low - occasional user confusion on errors',
      recommendation: 'Standardize error handling patterns'
    },
    {
      id: 'DATA-001',
      category: 'Data Integrity',
      severity: 'major',
      title: 'Foreign key constraints missing',
      description: 'Some table relationships lack proper foreign key constraints',
      component: 'Database Schema',
      status: 'identified',
      impact: 'Medium - potential data inconsistency',
      recommendation: 'Add missing foreign key constraints'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cosmetic': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'verified': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Functional Workflow': return <Zap className="w-5 h-5" />;
      case 'UI/UX': return <Eye className="w-5 h-5" />;
      case 'Performance': return <Clock className="w-5 h-5" />;
      case 'Security': return <Shield className="w-5 h-5" />;
      case 'Integration': return <Database className="w-5 h-5" />;
      case 'Data Integrity': return <Database className="w-5 h-5" />;
      case 'Notifications': return <Bell className="w-5 h-5" />;
      case 'Billing': return <CreditCard className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const issueStats = {
    critical: auditIssues.filter(i => i.severity === 'critical').length,
    major: auditIssues.filter(i => i.severity === 'major').length,
    minor: auditIssues.filter(i => i.severity === 'minor').length,
    cosmetic: auditIssues.filter(i => i.severity === 'cosmetic').length,
    fixed: auditIssues.filter(i => i.status === 'fixed').length,
    total: auditIssues.length
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Platform Audit Report</h1>
        <p className="text-gray-600">
          Comprehensive audit results covering all modules, workflows, and system integrations
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{issueStats.critical}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{issueStats.major}</div>
              <div className="text-sm text-gray-600">Major</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{issueStats.minor}</div>
              <div className="text-sm text-gray-600">Minor</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{issueStats.cosmetic}</div>
              <div className="text-sm text-gray-600">Cosmetic</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{issueStats.fixed}</div>
              <div className="text-sm text-gray-600">Fixed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{issueStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Identified Issues & Remediation Status</h2>
        
        {auditIssues.map((issue) => (
          <Card key={issue.id} className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(issue.category)}
                  <div>
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{issue.category}</Badge>
                      <Badge variant="outline">{issue.id}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(issue.status)}
                  <span className="text-sm capitalize">{issue.status.replace('-', ' ')}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{issue.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Component</h4>
                  <p className="text-sm text-gray-600">{issue.component}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
                  <p className="text-sm text-gray-600">{issue.impact}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                  <p className="text-sm text-gray-600">{issue.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Immediate Action Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-xs font-bold text-red-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Critical Security Issues</h4>
                <p className="text-sm text-gray-600">Implement missing RLS policies and review access controls</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-xs font-bold text-orange-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">UI/UX Fixes</h4>
                <p className="text-sm text-gray-600">Address mobile responsiveness and navigation issues</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-xs font-bold text-yellow-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Performance Optimization</h4>
                <p className="text-sm text-gray-600">Refactor large components and optimize bundle size</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-medium">Data Integrity</h4>
                <p className="text-sm text-gray-600">Add missing foreign key constraints and validation</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button className="w-full sm:w-auto">
              Download Full Audit Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
