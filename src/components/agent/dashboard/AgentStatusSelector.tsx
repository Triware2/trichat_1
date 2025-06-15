
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Circle } from 'lucide-react';

type AgentStatus = 'live' | 'break' | 'meeting' | 'away' | 'offline';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}

const statusConfig: Record<AgentStatus, StatusConfig> = {
  live: {
    label: 'Available',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    dotColor: 'bg-green-500'
  },
  break: {
    label: 'On Break',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    dotColor: 'bg-yellow-500'
  },
  meeting: {
    label: 'In Meeting',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500'
  },
  away: {
    label: 'Away',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    dotColor: 'bg-orange-500'
  },
  offline: {
    label: 'Offline',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-500'
  }
};

export const AgentStatusSelector = () => {
  const [currentStatus, setCurrentStatus] = useState<AgentStatus>('live');

  const handleStatusChange = (status: AgentStatus) => {
    setCurrentStatus(status);
    console.log(`Agent status changed to: ${status}`);
    // In a real app, this would make an API call to update the agent's status
  };

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">Status:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="h-9 px-3 gap-2 hover:bg-gray-50"
          >
            <Badge className={`${currentConfig.bgColor} ${currentConfig.color} hover:${currentConfig.bgColor} gap-1.5 px-2 py-1`}>
              <Circle className={`w-2 h-2 ${currentConfig.dotColor} rounded-full`} fill="currentColor" />
              {currentConfig.label}
            </Badge>
            <ChevronDown className="w-4 h-4 text-gray-500" />
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
