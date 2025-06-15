
export const SidebarStatusIndicator = () => {
  return (
    <div className="mt-8 pt-4 border-t border-slate-200/60 group-data-[collapsible=icon]:hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Online & Ready</span>
        </div>
        <p className="text-xs text-green-600 mt-1">All systems operational</p>
      </div>
    </div>
  );
};
