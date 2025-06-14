
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  UserPlus, 
  BarChart3, 
  Globe,
  Settings
} from 'lucide-react';

interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const QuickActions = () => {
  const quickActions: QuickActionItem[] = [
    {
      title: "Add New User",
      description: "Create new agent or supervisor account",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Generate Report",
      description: "Create comprehensive analytics report",
      icon: BarChart3,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Update Chat Widget",
      description: "Modify widget settings and appearance",
      icon: Globe,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "System Settings",
      description: "Configure system-wide preferences",
      icon: Settings,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="flex items-center gap-2 text-heading-3 font-lexend font-medium">
          <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
          Quick Actions
        </CardTitle>
        <CardDescription className="mt-1 text-caption font-lexend">
          Common administrative tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 lg:space-y-4">
        {quickActions.map((action, index) => (
          <div key={index} className="group p-3 lg:p-4 rounded-xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <action.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-lexend font-medium text-slate-900 group-hover:text-orange-700 transition-colors text-body">{action.title}</h4>
                <p className="text-caption font-lexend text-slate-600">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
