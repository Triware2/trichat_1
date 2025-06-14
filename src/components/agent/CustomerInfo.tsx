
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ExternalLink
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

  const notes = [
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
  ];

  const getTierBadge = (tier: string) => {
    const variants = {
      'Premium': 'default',
      'Pro': 'secondary',
      'Basic': 'outline'
    } as const;
    return <Badge variant={variants[tier as keyof typeof variants]}>{tier}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'Resolved' ? 'default' : status === 'Pending' ? 'destructive' : 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="px-4 pb-4 space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{customer.name}</h4>
                {getTierBadge(customer.tier)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Customer since {customer.customerSince}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t pt-4 space-y-3">
              <h5 className="font-medium text-gray-900">Customer Stats</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Previous Chats:</span>
                  <span className="font-medium">{customer.previousChats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Satisfaction:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{customer.satisfaction}/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-medium">{customer.totalSpent}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-gray-600">Last Contact:</span>
                  <span className="font-medium">{customer.lastContact}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-4 space-y-2">
              <h5 className="font-medium text-gray-900">Quick Actions</h5>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing Details
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Order History
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="px-4 pb-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Recent Orders</h5>
                <div className="space-y-2">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{order.id}</span>
                        <span className="text-gray-600">{order.amount}</span>
                      </div>
                      <p className="text-gray-600 mb-1">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{order.date}</span>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Chat History</h5>
                <div className="space-y-2">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{chat.subject}</span>
                        {getStatusBadge(chat.status)}
                      </div>
                      <p className="text-gray-600 mb-1">Agent: {chat.agent}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{chat.date}</span>
                        <span className="text-gray-500">{chat.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="px-4 pb-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">Agent Notes</h5>
                <Button size="sm" variant="outline">Add Note</Button>
              </div>
              
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{note.agent}</span>
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{note.note}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <textarea 
                  placeholder="Add a note about this customer..."
                  className="w-full p-2 border rounded-lg text-sm resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm">Save Note</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
