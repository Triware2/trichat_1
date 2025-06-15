
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTickets } from './useTickets';
import { RaiseTicketModal } from './RaiseTicketModal';
import { 
  Ticket, 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface TicketWidgetProps {
  chatId?: number;
  customerName?: string;
  customerEmail?: string;
  chatContext?: string;
}

export const TicketWidget = ({
  chatId,
  customerName = 'Current Customer',
  customerEmail = '',
  chatContext = ''
}: TicketWidgetProps) => {
  const [showRaiseTicket, setShowRaiseTicket] = useState(false);
  const { stats, tickets, getTicketsByChatId } = useTickets();

  const currentChatTickets = chatId ? getTicketsByChatId(chatId) : [];

  return (
    <>
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Ticket className="w-4 h-4 text-orange-600" />
            Ticket Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{stats.totalRaised}</div>
              <div className="text-xs text-blue-600">Total Raised</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-green-600">Resolved</div>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium">Resolution Rate</span>
            </div>
            <Badge variant={stats.resolutionRate >= 80 ? "default" : "secondary"}>
              {stats.resolutionRate}%
            </Badge>
          </div>

          {/* Current Chat Tickets */}
          {chatId && currentChatTickets.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Chat Tickets</div>
              {currentChatTickets.slice(0, 2).map((ticket) => (
                <div key={ticket.id} className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">#{ticket.ticketNumber}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        ticket.status === 'resolved' ? 'border-green-500 text-green-700' :
                        ticket.status === 'in_progress' ? 'border-blue-500 text-blue-700' :
                        'border-orange-500 text-orange-700'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-gray-600 mt-1">{ticket.subject}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => setShowRaiseTicket(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Raise New Ticket
            </Button>
            
            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="p-2 bg-red-50 rounded text-xs">
                <div className="font-bold text-red-600">{stats.pending}</div>
                <div className="text-red-600 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Pending
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs">
                <div className="font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-blue-600 flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  In Progress
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded text-xs">
                <div className="font-bold text-green-600">{stats.resolved}</div>
                <div className="text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Resolved
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RaiseTicketModal
        isOpen={showRaiseTicket}
        onClose={() => setShowRaiseTicket(false)}
        chatId={chatId || 0}
        customerName={customerName}
        customerEmail={customerEmail}
        chatContext={chatContext}
      />
    </>
  );
};
