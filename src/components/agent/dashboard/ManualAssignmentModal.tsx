
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Clock, AlertCircle } from 'lucide-react';

interface ChatData {
  id: number;
  customer: string;
  email: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'urgent';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedAgent: string | null;
  createdAt: string;
  category: string;
}

interface ManualAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: ChatData | null;
  onAssign: (chatId: number, agentName: string) => void;
}

// Mock available agents - in real app, this would come from API
const availableAgents = [
  { id: 1, name: 'Agent Smith', status: 'available', activeChats: 3, maxChats: 8 },
  { id: 2, name: 'Agent Davis', status: 'busy', activeChats: 7, maxChats: 8 },
  { id: 3, name: 'Agent Wilson', status: 'available', activeChats: 2, maxChats: 8 },
  { id: 4, name: 'Agent Johnson', status: 'away', activeChats: 0, maxChats: 8 },
  { id: 5, name: 'Agent Brown', status: 'available', activeChats: 5, maxChats: 8 },
];

export const ManualAssignmentModal = ({ isOpen, onClose, chat, onAssign }: ManualAssignmentModalProps) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const handleAssign = () => {
    if (selectedAgent && chat) {
      onAssign(chat.id, selectedAgent);
      setSelectedAgent('');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      away: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Critical: 'text-red-600',
      High: 'text-orange-600',
      Medium: 'text-yellow-600',
      Low: 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  if (!chat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Manual Chat Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chat Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Chat Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="font-medium">{chat.customer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-700">{chat.email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-sm text-gray-700">{chat.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <p className={`font-medium ${getPriorityColor(chat.priority)}`}>
                  {chat.priority}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-sm text-gray-700">{chat.category}</p>
              </div>
              {chat.assignedAgent && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Currently Assigned To</label>
                  <p className="font-medium text-blue-600">{chat.assignedAgent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Agent Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">
              Select Agent to Assign
            </label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an agent..." />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.name}>
                    <div className="flex items-center justify-between w-full min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium truncate">{agent.name}</span>
                        <Badge className={getStatusBadge(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                        <Clock className="w-3 h-3" />
                        {agent.activeChats}/{agent.maxChats}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Agent Workload Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Agent Availability
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {availableAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between">
                  <span className="font-medium">{agent.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusBadge(agent.status)}>
                      {agent.status}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {agent.activeChats}/{agent.maxChats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedAgent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {chat.assignedAgent ? 'Reassign Chat' : 'Assign Chat'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
