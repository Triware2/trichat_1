
import { AgentStatusSelector } from './AgentStatusSelector';

export const SidebarStatusIndicator = () => {
  return (
    <div className="mt-8 pt-4 border-t border-slate-200/60 space-y-4">
      {/* Status Selector - Always visible */}
      <div className="px-2">
        <AgentStatusSelector />
      </div>
      
      {/* Compact status indicator for collapsed state */}
      <div className="group-data-[collapsible=icon]:block hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100/50">
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Full status indicator for expanded state */}
      <div className="group-data-[collapsible=icon]:hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Online & Ready</span>
          </div>
          <p className="text-xs text-green-600 mt-1">All systems operational</p>
        </div>
      </div>
    </div>
  );
};
