
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl lg:text-3xl font-lexend font-semibold text-slate-900 tracking-tight">
            Admin Command Center
          </h1>
          <p className="text-base text-slate-600 mt-2 font-lexend font-normal leading-relaxed">
            Manage users, monitor system performance, and configure settings
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="outline" size="default" className="font-lexend font-medium h-9 px-5 text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="default" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-lexend font-medium h-9 px-5 text-sm shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Quick Setup
          </Button>
        </div>
      </div>
    </div>
  );
};
