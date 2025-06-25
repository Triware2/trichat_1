import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

type AgentStatus = 'online' | 'break' | 'meeting' | 'offline';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}

const statusConfig: Record<AgentStatus, StatusConfig> = {
  online: {
    label: 'Available',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    dotColor: 'bg-green-500'
  },
  break: {
    label: 'Break',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    dotColor: 'bg-yellow-500'
  },
  meeting: {
    label: 'Meeting',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500'
  },
  offline: {
    label: 'Offline',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-500'
  }
};

export const AgentStatusSelector = () => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<AgentStatus>('online');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: AgentStatus) => {
    setCurrentStatus(status);
    setLoading(true);
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ status })
        .eq('id', user.id);
      // Optionally: trigger a real-time event or notification for supervisors here
    }
    setLoading(false);
  };

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
      {/* Label - hidden when collapsed */}
      <span className="text-sm font-medium text-gray-600 group-data-[collapsible=icon]:hidden">Status:</span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="h-9 px-3 gap-2 hover:bg-gray-50 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0"
            disabled={loading}
          >
            {/* Full badge for expanded state */}
            <Badge className={`${currentConfig.bgColor} ${currentConfig.color} hover:${currentConfig.bgColor} gap-1.5 px-2 py-1 group-data-[collapsible=icon]:hidden`}>
              <Circle className={`w-2 h-2 ${currentConfig.dotColor} rounded-full`} fill="currentColor" />
              {currentConfig.label}
            </Badge>
            
            {/* Just dot for collapsed state */}
            <Circle className={`w-3 h-3 ${currentConfig.dotColor} rounded-full group-data-[collapsible=icon]:block hidden`} fill="currentColor" />
            
            <ChevronDown className="w-4 h-4 text-gray-500 group-data-[collapsible=icon]:hidden" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 bg-white border shadow-lg">
          {Object.entries(statusConfig).map(([status, config]) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status as AgentStatus)}
              className="cursor-pointer hover:bg-gray-100 px-3 py-2"
            >
              <Badge className={`${config.bgColor} ${config.color} hover:${config.bgColor} gap-1.5 px-2 py-1 w-full justify-start`}>
                <Circle className={`w-2 h-2 ${config.dotColor} rounded-full`} fill="currentColor" />
                {config.label}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Note: For real-time supervisor sync, subscribe to the 'profiles' table in the supervisor dashboard using Supabase real-time.
