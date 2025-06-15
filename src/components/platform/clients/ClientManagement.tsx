
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  revenue: string;
  usage: number;
  joinDate: string;
  lastActive: string;
  tickets: number;
}

export const ClientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@enterprise.com',
      company: 'Enterprise Corp',
      plan: 'Enterprise',
      status: 'active',
      revenue: '$45,230',
      usage: 85,
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      tickets: 3
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@techsol.com',
      company: 'Tech Solutions',
      plan: 'Professional',
      status: 'active',
      revenue: '$32,100',
      usage: 72,
      joinDate: '2024-02-20',
      lastActive: '1 day ago',
      tickets: 1
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@global.com',
      company: 'Global Industries',
      plan: 'Business',
      status: 'suspended',
      revenue: '$28,950',
      usage: 45,
      joinDate: '2024-03-10',
      lastActive: '1 week ago',
      tickets: 5
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Professional': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Business': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEditClient = (clientId: string) => {
    toast({
      title: "Edit Client",
      description: `Opening edit form for client ${clientId}`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    toast({
      title: "Delete Client",
      description: `Client ${clientId} has been deleted`,
      variant: "destructive"
    });
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPlan = planFilter === 'all' || client.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all platform clients</p>
        </div>
        <Button className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <div className="grid gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                      <Badge className={getPlanColor(client.plan)}>
                        {client.plan}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>{client.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{client.revenue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>{client.usage}% usage</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>Joined: {client.joinDate}</span>
                      <span>Last active: {client.lastActive}</span>
                      <span>Tickets: {client.tickets}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditClient(client.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditClient(client.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteClient(client.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
