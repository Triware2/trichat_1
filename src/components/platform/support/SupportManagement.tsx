
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';

export const SupportManagement = () => {
  const tickets = [
    { id: '1001', client: 'Enterprise Corp', subject: 'API rate limit issue', priority: 'high', status: 'open', created: '2 hours ago', agent: 'Sarah Johnson' },
    { id: '1002', client: 'Tech Solutions', subject: 'Billing inquiry', priority: 'medium', status: 'pending', created: '4 hours ago', agent: 'Mike Wilson' },
    { id: '1003', client: 'Global Industries', subject: 'Feature request', priority: 'low', status: 'resolved', created: '1 day ago', agent: 'Emma Davis' },
    { id: '1004', client: 'Innovation Labs', subject: 'Login problems', priority: 'high', status: 'open', created: '6 hours ago', agent: 'John Smith' }
  ];

  const supportStats = [
    { title: 'Open Tickets', value: '43', change: '-8', icon: MessageSquare, color: 'red' },
    { title: 'Avg Response Time', value: '2.3h', change: '-0.5h', icon: Clock, color: 'blue' },
    { title: 'Resolution Rate', value: '94%', change: '+2%', icon: CheckCircle, color: 'green' },
    { title: 'Customer Satisfaction', value: '4.8/5', change: '+0.1', icon: TrendingUp, color: 'purple' }
  ];

  const agents = [
    { name: 'Sarah Johnson', tickets: 12, avgResponse: '1.8h', satisfaction: '4.9' },
    { name: 'Mike Wilson', tickets: 8, avgResponse: '2.1h', satisfaction: '4.7' },
    { name: 'Emma Davis', tickets: 15, avgResponse: '1.5h', satisfaction: '4.8' },
    { name: 'John Smith', tickets: 6, avgResponse: '2.5h', satisfaction: '4.6' }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Management</h1>
          <p className="text-gray-600 mt-1">Manage customer support tickets and team performance</p>
        </div>
        <Button className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 text-${stat.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">{stat.change} from last week</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold">#{ticket.id}</span>
                    <Badge className={
                      ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }>
                      {ticket.priority}
                    </Badge>
                    <Badge className={
                      ticket.status === 'open' ? 'bg-orange-100 text-orange-700' :
                      ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600">
                    {ticket.client} • {ticket.created} • Assigned to {ticket.agent}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agents.map((agent, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h3 className="font-semibold">{agent.name}</h3>
                <div className="space-y-1 mt-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Active Tickets:</span>
                    <span className="font-medium">{agent.tickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response:</span>
                    <span className="font-medium">{agent.avgResponse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction:</span>
                    <span className="font-medium">{agent.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
