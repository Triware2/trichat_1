import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  FileText
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
  const [activeTab, setActiveTab] = useState('profile');
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();

  const orderHistory = [
    {
      id: "#12345",
      date: "2024-01-15",
      amount: "$89.99",
      status: "Delivered",
      items: "Premium Support Plan"
    },
    {
      id: "#12344",
      date: "2024-01-10",
      amount: "$29.99",
      status: "Delivered",
      items: "Monthly Subscription"
    },
    {
      id: "#12343",
      date: "2023-12-28",
      amount: "$159.99",
      status: "Delivered",
      items: "Annual Plan Upgrade"
    }
  ];

  const chatHistory = [
    {
      date: "2024-01-10",
      subject: "Billing inquiry",
      status: "Resolved",
      agent: "Sarah Johnson",
      duration: "12 minutes"
    },
    {
      date: "2024-01-05",
      subject: "Feature request",
      status: "Resolved",
      agent: "Mike Chen",
      duration: "8 minutes"
    },
    {
      date: "2023-12-15",
      subject: "Technical support",
      status: "Resolved",
      agent: "Emily Rodriguez",
      duration: "25 minutes"
    }
  ];

  const [notes, setNotes] = useState([
    {
      date: "2024-01-10",
      agent: "Sarah Johnson",
      note: "Customer interested in enterprise features. Provided demo link."
    },
    {
      date: "2024-01-05",
      agent: "Mike Chen",
      note: "Resolved login issue. Updated security settings as requested."
    }
  ]);

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
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    const className = statusColors[status as keyof typeof statusColors] || statusColors.Pending;
    return <Badge variant="outline" className={className}>{status}</Badge>;
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        date: new Date().toLocaleDateString(),
        agent: "Current Agent",
        note: newNote.trim()
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
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customer Information</h2>
            <p className="text-sm text-slate-600">Complete customer profile and history</p>
          </div>
        </div>

        {/* Customer Header Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTierBadge(customer.tier)}
                    <span className="text-sm text-slate-600">Customer since {customer.customerSince}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-slate-900">{customer.satisfaction}/5</span>
                </div>
                <p className="text-sm text-slate-600">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
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
                        <p className="text-sm font-medium text-slate-900">{customer.email}</p>
                        <p className="text-xs text-slate-600">Email Address</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.phone}</p>
                        <p className="text-xs text-slate-600">Phone Number</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.location}</p>
                        <p className="text-xs text-slate-600">Location</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{customer.previousChats}</p>
                      <p className="text-sm text-blue-700">Previous Chats</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">{customer.totalOrders}</p>
                      <p className="text-sm text-emerald-700">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{customer.totalSpent}</p>
                      <p className="text-sm text-purple-700">Total Spent</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{customer.lastContact}</p>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-0">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{order.id}</span>
                        <span className="font-bold text-slate-900">{order.amount}</span>
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

              {/* Chat History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{chat.subject}</span>
                        {getStatusBadge(chat.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">Agent: {chat.agent}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{chat.date}</span>
                        <span className="text-xs text-slate-500">{chat.duration}</span>
                      </div>
                    </div>
                  ))}
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
                    placeholder="Add a note about this customer..."
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
                          <span className="text-sm font-semibold text-slate-900">{note.agent}</span>
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
