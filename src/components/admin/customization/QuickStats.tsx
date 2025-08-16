
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {quickStatsData.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-50 text-blue-600 border-blue-200',
          green: 'bg-green-50 text-green-600 border-green-200',
          orange: 'bg-orange-50 text-orange-600 border-orange-200',
          purple: 'bg-purple-50 text-purple-600 border-purple-200',
          red: 'bg-red-50 text-red-600 border-red-200',
          indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
        };

        return (
          <Card 
            key={index} 
            className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses] || colorClasses.blue}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : stat.value}</p>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
