
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileCode,
  CheckCircle,
  Zap,
  AlertTriangle,
  TrendingUp,
  Clock
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
      icon: FileCode,
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm animate-pulse">
            <CardContent className="p-8">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {quickStatsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className="ml-4">
                  <div className={`
                    p-3 rounded-lg
                    ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                    ${stat.color === 'green' ? 'bg-green-50 text-green-600' : ''}
                    ${stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' : ''}
                    ${stat.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
