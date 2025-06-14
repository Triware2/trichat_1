
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, TrendingUp } from 'lucide-react';

export const PerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border border-emerald-200 bg-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-800 text-xs font-medium tracking-wide uppercase">Today's Target</p>
              <p className="text-xl font-semibold text-emerald-900 tracking-tight">95%</p>
              <p className="text-emerald-700 text-xs">Resolution Rate</p>
            </div>
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 text-xs font-medium tracking-wide uppercase">Peak Performance</p>
              <p className="text-xl font-semibold text-blue-900 tracking-tight">98.2%</p>
              <p className="text-blue-700 text-xs">This Week</p>
            </div>
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-800 text-xs font-medium tracking-wide uppercase">Team Efficiency</p>
              <p className="text-xl font-semibold text-purple-900 tracking-tight">89%</p>
              <p className="text-purple-700 text-xs">Above Baseline</p>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
