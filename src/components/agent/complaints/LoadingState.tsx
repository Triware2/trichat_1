
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoadingState = () => {
  return (
    <Card className="w-80 h-fit border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700">Previous Complaints</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  );
};
