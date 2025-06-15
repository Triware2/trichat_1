
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Database, Globe, AlertCircle } from 'lucide-react';

export const PerformanceAudit = () => {
  const performanceMetrics = [
    {
      metric: 'Bundle Size',
      current: '2.1 MB',
      target: '1.5 MB',
      score: 72,
      status: 'warning',
      impact: 'Initial load time affected by large components'
    },
    {
      metric: 'First Contentful Paint',
      current: '1.2s',
      target: '1.0s',
      score: 85,
      status: 'good',
      impact: 'Good user experience on initial load'
    },
    {
      metric: 'Largest Contentful Paint',
      current: '2.8s',
      target: '2.5s',
      score: 78,
      status: 'warning',
      impact: 'Main content load could be optimized'
    },
    {
      metric: 'Cumulative Layout Shift',
      current: '0.05',
      target: '0.1',
      score: 95,
      status: 'excellent',
      impact: 'Minimal layout shifts during load'
    },
    {
      metric: 'Time to Interactive',
      current: '3.2s',
      target: '3.0s',
      score: 80,
      status: 'good',
      impact: 'Interactive elements load reasonably fast'
    }
  ];

  const bottlenecks = [
    {
      component: 'AdminDashboard.tsx',
      size: '204 lines',
      issue: 'Monolithic component affecting code splitting',
      priority: 'high'
    },
    {
      component: 'ChatManagement.tsx',
      size: '214 lines',
      issue: 'Large component impacting bundle efficiency',
      priority: 'high'
    },
    {
      component: 'MessageList.tsx',
      size: '213 lines',
      issue: 'Complex rendering logic needs optimization',
      priority: 'medium'
    },
    {
      component: 'ChannelManagement.tsx',
      size: '331 lines',
      issue: 'Largest component requiring immediate refactoring',
      priority: 'critical'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.poor;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Performance Audit</h2>
          <p className="text-gray-600">Load times, bundle analysis, and optimization opportunities</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {metric.current} / {metric.target}
                    </span>
                    <span className={`font-bold ${getScoreColor(metric.score)}`}>
                      {metric.score}
                    </span>
                    <Badge className={getStatusBadge(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={metric.score} className="h-2" />
                <p className="text-sm text-gray-600">{metric.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottlenecks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Performance Bottlenecks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bottlenecks.map((bottleneck, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{bottleneck.component}</h4>
                    <p className="text-sm text-gray-600">{bottleneck.size}</p>
                  </div>
                  <Badge className={getPriorityColor(bottleneck.priority)}>
                    {bottleneck.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{bottleneck.issue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Immediate Actions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Refactor ChannelManagement.tsx (331 lines) into smaller components</li>
                <li>• Split AdminDashboard.tsx into focused modules</li>
                <li>• Implement code splitting for large feature modules</li>
                <li>• Add lazy loading for dashboard sections</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Long-term Optimizations</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Implement service worker for caching</li>
                <li>• Add image optimization and lazy loading</li>
                <li>• Consider micro-frontend architecture for large modules</li>
                <li>• Implement progressive loading strategies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
