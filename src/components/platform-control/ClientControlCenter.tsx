
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Settings,
  CreditCard,
  Database,
  Shield,
  Mail,
  Phone,
  Building
} from 'lucide-react';

export const ClientControlCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClient, setSelectedClient] = useState(null);

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
      satisfaction: 4.8,
      users: 145,
      storage: '2.4 GB',
      apiCalls: '1.2M',
      features: ['chat', 'analytics', 'integrations'],
      billingInfo: {
        paymentMethod: 'Credit Card',
        nextBilling: '2024-01-15',
        totalSpent: '$125,000'
      }
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
      satisfaction: 4.9,
      users: 25,
      storage: '512 MB',
      apiCalls: '250K',
      features: ['chat', 'basic-analytics'],
      billingInfo: {
        paymentMethod: 'Credit Card',
        nextBilling: '2024-01-10',
        totalSpent: '$4,990'
      }
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
      satisfaction: 4.2,
      users: 500,
      storage: '8.9 GB',
      apiCalls: '5.2M',
      features: ['chat', 'analytics', 'integrations', 'ai-bot', 'priority-support'],
      billingInfo: {
        paymentMethod: 'Invoice',
        nextBilling: '2024-01-20',
        totalSpent: '$300,000'
      }
    }
  ];

  const handleClientAction = (action, clientId, data = null) => {
    console.log(`Performing ${action} on client ${clientId}`, data);
    // Implement actual client management logic here
  };

  const ClientDetailView = ({ client }) => (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{client.users}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{client.storage}</div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{client.apiCalls}</div>
                <div className="text-sm text-gray-600">API Calls</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{client.satisfaction}</div>
                <div className="text-sm text-gray-600">CSAT Score</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input value={client.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input value={client.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <Select value={client.plan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Enterprise Pro">Enterprise Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select value={client.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {/* Sample users for this client */}
                  {[
                    { name: 'John Admin', email: 'john@techcorp.com', role: 'Admin', status: 'Active' },
                    { name: 'Sarah Manager', email: 'sarah@techcorp.com', role: 'Manager', status: 'Active' },
                    { name: 'Mike Agent', email: 'mike@techcorp.com', role: 'Agent', status: 'Inactive' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <Input value={client.billingInfo.paymentMethod} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                  <Input value={client.billingInfo.nextBilling} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                  <Input value={client.billingInfo.totalSpent} />
                </div>
                <Button>Update Billing Info</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan & Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">API Usage</span>
                    <span className="text-sm">{client.usage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: client.usage }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Enabled Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {client.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline">Upgrade Plan</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-600">Require 2FA for all users</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SSO Integration</div>
                    <div className="text-sm text-gray-600">Enable single sign-on</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Data Export</div>
                    <div className="text-sm text-gray-600">Allow data exports</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">API Access</div>
                    <div className="text-sm text-gray-600">Enable API access</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Suspend Account
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: '#T-1234', title: 'Login Issues', status: 'Open', priority: 'High' },
                    { id: '#T-1235', title: 'Feature Request', status: 'In Progress', priority: 'Medium' },
                    { id: '#T-1236', title: 'Billing Question', status: 'Resolved', priority: 'Low' }
                  ].map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{ticket.id}</div>
                        <div className="text-sm text-gray-600">{ticket.title}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ticket.status === 'Open' ? 'destructive' : ticket.status === 'In Progress' ? 'default' : 'secondary'}>
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline">{ticket.priority}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  Create New Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Access Account
                </Button>
                
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send Message</label>
                  <Textarea placeholder="Type your message..." className="mb-2" />
                  <Button>Send Message</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

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

      {/* Enhanced Client Management */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Advanced Client Management</CardTitle>
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

          {selectedClient ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Managing: {selectedClient.name}</h3>
                <Button variant="outline" onClick={() => setSelectedClient(null)}>
                  Back to List
                </Button>
              </div>
              <ClientDetailView client={selectedClient} />
            </div>
          ) : (
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
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedClient(client)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/60">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/60 hover:bg-red-50 hover:border-red-200">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
