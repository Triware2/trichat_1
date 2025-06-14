
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

export const SupervisorHeader = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Supervisor Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor team performance and optimize support operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};
