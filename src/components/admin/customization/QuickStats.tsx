
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Code, 
  Workflow, 
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Customization {
  id: string;
  name: string;
  type: 'theme' | 'component' | 'workflow' | 'integration';
  status: 'active' | 'inactive' | 'draft';
}

interface QuickStatsProps {
  customizations: Customization[];
  isLoading: boolean;
}

export const QuickStats = ({ customizations, isLoading }: QuickStatsProps) => {
  const stats = {
    total: customizations.length,
    active: customizations.filter(c => c.status === 'active').length,
    draft: customizations.filter(c => c.status === 'draft').length,
    themes: customizations.filter(c => c.type === 'theme').length,
    workflows: customizations.filter(c => c.type === 'workflow').length,
    components: customizations.filter(c => c.type === 'component').length
  };

  const quickStatsData = [
    {
      title: 'Total Customizations',
      value: stats.total,
      description: 'All customization projects',
      icon: Code,
      color: 'blue'
    },
    {
      title: 'Active Projects',
      value: stats.active,
      description: 'Currently deployed',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Draft Projects',
      value: stats.draft,
      description: 'In development',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Performance',
      value: '98.5%',
      description: 'System uptime',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const typeStats = [
    {
      title: 'Themes',
      value: stats.themes,
      icon: Palette,
      color: 'purple'
    },
    {
      title: 'Components',
      value: stats.components,
      icon: Code,
      color: 'blue'
    },
    {
      title: 'Workflows',
      value: stats.workflows,
      icon: Workflow,
      color: 'green'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStatsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customization Types</CardTitle>
          <CardDescription>Breakdown by customization category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {typeStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded bg-${stat.color}-100`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
