
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  BarChart3, 
  Globe,
  Settings,
  ChevronRight
} from 'lucide-react';

interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  buttonText: string;
}

export const QuickActions = () => {
  const quickActions: QuickActionItem[] = [
    {
      title: "Add new user",
      description: "Create agent or supervisor account",
      icon: UserPlus,
      buttonText: "Create user"
    },
    {
      title: "View analytics",
      description: "Generate comprehensive report",
      icon: BarChart3,
      buttonText: "Open analytics"
    },
    {
      title: "Configure widget",
      description: "Update chat widget settings",
      icon: Globe,
      buttonText: "Configure"
    },
    {
      title: "System settings",
      description: "Manage system preferences",
      icon: Settings,
      buttonText: "Open settings"
    }
  ];

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick actions
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Common administrative tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {quickActions.map((action, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <action.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
