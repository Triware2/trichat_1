
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  History, 
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  ExternalLink,
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Laptop,
  Headphones,
  Activity,
  BarChart3,
  Target,
  ThumbsUp,
  ThumbsDown,
  Eye,
  UserCheck
} from 'lucide-react';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  location: string;
  customerSince: string;
  tier: string;
  previousChats: number;
  satisfaction: number;
  lastContact: string;
  totalOrders: number;
  totalSpent: string;
}

interface CustomerInfoProps {
  customer: CustomerData;
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState(customer);
  const { toast } = useToast();

  // Enhanced customer data with 360-degree insights
  const customerInsights = {
    healthScore: 85,
    riskLevel: 'Low',
    sentimentTrend: 'Positive',
    responseTime: '2.3 mins',
    resolutionRate: '94%',
    escalationRate: '3%',
    preferredChannel: 'Chat',
    timezone: 'EST (GMT-5)',
    lastLoginDate: '2024-01-12',
    accountStatus: 'Active',
    paymentStatus: 'Current',
    contractExpiry: '2024-12-31'
  };

  const interactionTimeline = [
    {
      date: '2024-01-12',
      type: 'chat',
      subject: 'Billing inquiry resolved',
      agent: 'Sarah Johnson',
      duration: '8 mins',
      sentiment: 'positive',
      resolution: 'Resolved',
      satisfaction: 5
    },
    {
      date: '2024-01-10',
      type: 'email',
      subject: 'Feature request submitted',
      agent: 'Mike Chen',
      duration: 'N/A',
      sentiment: 'neutral',
      resolution: 'In Progress',
      satisfaction: 4
    },
    {
      date: '2024-01-08',
      type: 'phone',
      subject: 'Technical support provided',
      agent: 'Emily Rodriguez',
      duration: '15 mins',
      sentiment: 'positive',
      resolution: 'Resolved',
      satisfaction: 5
    },
    {
      date: '2024-01-05',
      type: 'chat',
      subject: 'Account settings updated',
      agent: 'David Wilson',
      duration: '5 mins',
      sentiment: 'positive',
      resolution: 'Resolved',
      satisfaction: 4
    }
  ];

  const issueCategories = [
    { category: 'Billing', count: 3, trend: 'down', lastIssue: '5 days ago' },
    { category: 'Technical', count: 2, trend: 'stable', lastIssue: '8 days ago' },
    { category: 'Account', count: 1, trend: 'down', lastIssue: '12 days ago' },
    { category: 'Feature Request', count: 2, trend: 'up', lastIssue: '2 days ago' }
  ];

  const productUsage = [
    { product: 'Premium Support', usage: '98%', status: 'Active', lastUsed: '2024-01-12' },
    { product: 'Advanced Analytics', usage: '67%', status: 'Active', lastUsed: '2024-01-11' },
    { product: 'API Access', usage: '23%', status: 'Active', lastUsed: '2024-01-08' },
    { product: 'Mobile App', usage: '89%', status: 'Active', lastUsed: '2024-01-12' }
  ];

  const communicationPreferences = {
    preferredChannel: 'Live Chat',
    preferredTime: '9 AM - 5 PM EST',
    language: 'English',
    notifications: 'Email + SMS',
    frequency: 'Immediate for urgent, Daily digest for updates'
  };

  const orderHistory = [
    {
      id: "#12345",
      date: "2024-01-15",
      amount: "$89.99",
      status: "Delivered",
      items: "Premium Support Plan",
      satisfaction: 5
    },
    {
      id: "#12344",
      date: "2024-01-10",
      amount: "$29.99",
      status: "Delivered",
      items: "Monthly Subscription",
      satisfaction: 4
    },
    {
      id: "#12343",
      date: "2023-12-28",
      amount: "$159.99",
      status: "Delivered",
      items: "Annual Plan Upgrade",
      satisfaction: 5
    }
  ];

  const [notes, setNotes] = useState([
    {
      date: "2024-01-12",
      agent: "Sarah Johnson",
      note: "Customer expressed interest in enterprise features. Provided demo access and follow-up scheduled.",
      type: "insight"
    },
    {
      date: "2024-01-10",
      agent: "Mike Chen",
      note: "Resolved login issue. Customer mentioned slow response time - escalated to dev team.",
      type: "technical"
    },
    {
      date: "2024-01-08",
      agent: "Emily Rodriguez",
      note: "Customer is very satisfied with recent updates. Potential advocate for case studies.",
      type: "feedback"
    }
  ]);

  const mockCustomerData = {
    'john.smith@email.com': {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      customerSince: '2023-01-15',
      tier: 'Premium',
      previousChats: 12,
      satisfaction: 4.8,
      lastContact: '2024-01-10',
      totalOrders: 8,
      totalSpent: '$2,450.00'
    },
    '+1 (555) 987-6543': {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 987-6543',
      location: 'California, USA',
      customerSince: '2023-03-20',
      tier: 'Pro',
      previousChats: 8,
      satisfaction: 4.9,
      lastContact: '2024-01-12',
      totalOrders: 5,
      totalSpent: '$1,200.00'
    },
    'bob.williams@email.com': {
      name: 'Bob Williams',
      email: 'bob.williams@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Texas, USA',
      customerSince: '2023-06-10',
      tier: 'Basic',
      previousChats: 3,
      satisfaction: 4.5,
      lastContact: '2024-01-08',
      totalOrders: 2,
      totalSpent: '$300.00'
    }
  };

  const handleSearchCustomer = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter an email or phone number to search.",
        variant: "destructive"
      });
      return;
    }

    const foundCustomer = mockCustomerData[searchQuery.trim() as keyof typeof mockCustomerData];
    
    if (foundCustomer) {
      setCurrentCustomer(foundCustomer);
      toast({
        title: "Customer found",
        description: `Customer information loaded for ${foundCustomer.name}.`,
      });
    } else {
      toast({
        title: "Customer not found",
        description: "No customer found with that email or phone number.",
        variant: "destructive"
      });
    }
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      'Premium': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'Pro': 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
      'Basic': 'bg-slate-100 text-slate-700'
    };
    const className = variants[tier as keyof typeof variants] || variants.Basic;
    return <Badge className={`${className} border-0 font-medium`}>{tier}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    const className = statusColors[status as keyof typeof statusColors] || statusColors.Pending;
    return <Badge variant="outline" className={className}>{status}</Badge>;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-emerald-500" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default: return <Eye className="w-4 h-4 text-slate-500" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        date: new Date().toLocaleDateString(),
        agent: "Current Agent",
        note: newNote.trim(),
        type: "general"
      };
      setNotes([note, ...notes]);
      setNewNote('');
      toast({
        title: "Note added",
        description: "Customer note has been saved successfully.",
      });
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customer 360° View</h2>
            <p className="text-sm text-slate-600">Complete customer insights for better support</p>
          </div>
        </div>

        {/* Customer Search Section */}
        <Card className="border border-slate-200 shadow-sm mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-500" />
              Search Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-3">
              <Input
                placeholder="Enter email address or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomer()}
              />
              <Button 
                onClick={handleSearchCustomer}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Try: john.smith@email.com, +1 (555) 987-6543, or bob.williams@email.com
            </p>
          </CardContent>
        </Card>

        {/* Customer Header Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {currentCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{currentCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTierBadge(currentCustomer.tier)}
                    <Badge className="bg-slate-100 text-slate-700">ID: #CX{currentCustomer.email.slice(0,4).toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Customer since {currentCustomer.customerSince}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-slate-900">{currentCustomer.satisfaction}/5</span>
                </div>
                <p className="text-sm text-slate-600">Satisfaction</p>
              </div>
            </div>

            {/* Quick Health Indicators */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span className={`text-lg font-bold ${getHealthScoreColor(customerInsights.healthScore)}`}>
                    {customerInsights.healthScore}%
                  </span>
                </div>
                <p className="text-xs text-emerald-700">Health Score</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">{customerInsights.responseTime}</span>
                </div>
                <p className="text-xs text-blue-700">Avg Response</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-lg font-bold text-purple-600">{customerInsights.resolutionRate}</span>
                </div>
                <p className="text-xs text-purple-700">Resolution Rate</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-lg font-bold text-amber-600">{customerInsights.riskLevel}</span>
                </div>
                <p className="text-xs text-amber-700">Risk Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="interactions" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="issues" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Customer Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Communication Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-500" />
                      Communication Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Preferred Channel:</span>
                      <Badge className="bg-blue-100 text-blue-700">{communicationPreferences.preferredChannel}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Best Time:</span>
                      <span className="text-sm font-medium">{communicationPreferences.preferredTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Language:</span>
                      <span className="text-sm font-medium">{communicationPreferences.language}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Timezone:</span>
                      <span className="text-sm font-medium">{customerInsights.timezone}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      Product Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productUsage.map((product, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{product.product}</span>
                          <span className="text-sm text-slate-600">{product.usage}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: product.usage }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>{product.status}</span>
                          <span>Last used: {product.lastUsed}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Account Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-orange-500" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-emerald-700">{customerInsights.accountStatus}</p>
                      <p className="text-xs text-emerald-600">Account Status</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-blue-700">{customerInsights.paymentStatus}</p>
                      <p className="text-xs text-blue-600">Payment Status</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-purple-700">{customerInsights.contractExpiry}</p>
                      <p className="text-xs text-purple-600">Contract Expiry</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-amber-700">{customerInsights.lastLoginDate}</p>
                      <p className="text-xs text-amber-600">Last Login</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interactions" className="space-y-6 mt-0">
              {/* Interaction Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Recent Interactions Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interactionTimeline.map((interaction, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex-shrink-0">
                        {interaction.type === 'chat' && <MessageSquare className="w-6 h-6 text-blue-500" />}
                        {interaction.type === 'email' && <Mail className="w-6 h-6 text-green-500" />}
                        {interaction.type === 'phone' && <Phone className="w-6 h-6 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-slate-900">{interaction.subject}</h4>
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(interaction.sentiment)}
                            {getStatusBadge(interaction.resolution)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span>{interaction.date}</span>
                          <span>Agent: {interaction.agent}</span>
                          <span>Duration: {interaction.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{interaction.satisfaction}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues" className="space-y-6 mt-0">
              {/* Issue Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Issue Categories & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {issueCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-700">{category.count}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{category.category}</h4>
                          <p className="text-sm text-slate-600">Last issue: {category.lastIssue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {category.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {category.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                        {category.trend === 'stable' && <Activity className="w-4 h-4 text-blue-500" />}
                        <span className="text-sm text-slate-600 capitalize">{category.trend}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Orders with Satisfaction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-orange-500" />
                    Order History & Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{order.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{order.amount}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{order.satisfaction}/5</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{order.date}</span>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 mt-0">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{currentCustomer.email}</p>
                        <p className="text-xs text-slate-600">Primary Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{currentCustomer.phone}</p>
                        <p className="text-xs text-slate-600">Primary Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{currentCustomer.location}</p>
                        <p className="text-xs text-slate-600">Location</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{currentCustomer.previousChats}</p>
                      <p className="text-sm text-blue-700">Previous Chats</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">{currentCustomer.totalOrders}</p>
                      <p className="text-sm text-emerald-700">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{currentCustomer.totalSpent}</p>
                      <p className="text-sm text-purple-700">Total Spent</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{currentCustomer.lastContact}</p>
                      <p className="text-sm text-amber-700">Last Contact</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Order History
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                    <Headphones className="w-4 h-4 mr-2" />
                    Escalate to Manager
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6 mt-0">
              {/* Add Note */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea 
                    placeholder="Add a note about this customer interaction or insight..."
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none focus:border-orange-300 focus:ring-orange-200"
                    rows={4}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddNote} 
                    disabled={!newNote.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Save Note
                  </Button>
                </CardContent>
              </Card>

              {/* Notes History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notes.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">No notes yet. Add your first note above.</p>
                    </div>
                  ) : (
                    notes.map((note, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{note.agent}</span>
                            <Badge variant="outline" className="text-xs">{note.type}</Badge>
                          </div>
                          <span className="text-xs text-slate-500">{note.date}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{note.note}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
