
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Globe,
  Settings
} from 'lucide-react';

export const ClientControlCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { 
      id: 1, 
      name: 'TechCorp Solutions', 
      email: 'admin@techcorp.com', 
      plan: 'Enterprise', 
      status: 'active',
      revenue: '$12,500/mo',
      usage: '89%',
      lastActive: '2 hours ago',
      tickets: 3,
      satisfaction: 4.8
    },
    { 
      id: 2, 
      name: 'StartupXYZ', 
      email: 'founder@startupxyz.com', 
      plan: 'Professional', 
      status: 'active',
      revenue: '$499/mo',
      usage: '67%',
      lastActive: '1 day ago',
      tickets: 1,
      satisfaction: 4.9
    },
    { 
      id: 3, 
      name: 'Global Industries', 
      email: 'it@globalind.com', 
      plan: 'Enterprise Pro', 
      status: 'warning',
      revenue: '$25,000/mo',
      usage: '95%',
      lastActive: '30 minutes ago',
      tickets: 7,
      satisfaction: 4.2
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Client Command Center</h1>
          </div>
          <p className="text-gray-600 ml-12">Complete client lifecycle management and control</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Clients</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2,847</div>
            <p className="text-sm text-green-600 font-medium">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$847K</div>
            <p className="text-sm text-green-600 font-medium">+24.7% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Avg. Satisfaction</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">4.7/5</div>
            <p className="text-sm text-green-600 font-medium">+0.3 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Tickets</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">127</div>
            <p className="text-sm text-red-600 font-medium">-12.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Client Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Client Table */}
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                    <p className="text-gray-600 text-sm">{client.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={`${
                        client.status === 'active' ? 'bg-green-100 text-green-700' :
                        client.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {client.status}
                      </Badge>
                      <span className="text-sm text-gray-500">Plan: {client.plan}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-8 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{client.revenue}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{client.usage}</div>
                    <div className="text-xs text-gray-500">Usage</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{client.lastActive}</div>
                    <div className="text-xs text-gray-500">Last Active</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{client.tickets}</div>
                    <div className="text-xs text-gray-500">Open Tickets</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{client.satisfaction}</div>
                    <div className="text-xs text-gray-500">CSAT Score</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60 hover:bg-red-50 hover:border-red-200">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
