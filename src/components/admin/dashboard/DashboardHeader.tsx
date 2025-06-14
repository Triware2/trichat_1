
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-heading-1 font-lexend font-medium text-slate-900 truncate">Admin Command Center</h1>
          <p className="text-body text-slate-600 mt-1 font-lexend">Manage users, monitor system performance, and configure settings</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button variant="outline" size="sm" className="font-lexend font-medium">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-lexend font-medium">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Quick Setup
          </Button>
        </div>
      </div>
    </div>
  );
};
