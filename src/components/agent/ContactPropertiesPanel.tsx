
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, Calendar, DollarSign, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

interface ContactProperties {
  orderId: string;
  orderStatus: string;
  orderDate: string;
  orderAmount: string;
  productName: string;
  issueType: string;
  priority: string;
  customerTier: string;
  lastPurchase: string;
  totalSpent: string;
  location: string;
  phone: string;
  email: string;
}

interface ContactPropertiesPanelProps {
  chatId: number;
  customerName: string;
}

export const ContactPropertiesPanel = ({ chatId, customerName }: ContactPropertiesPanelProps) => {
  const [properties, setProperties] = useState<ContactProperties | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate API call to fetch contact properties based on chat context
  useEffect(() => {
    const fetchContactProperties = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on chatId - this would come from your actual API
      const mockProperties: { [key: number]: ContactProperties } = {
        1: {
          orderId: "#12345",
          orderStatus: "Shipped",
          orderDate: "2024-01-10",
          orderAmount: "$89.99",
          productName: "Premium Support Plan",
          issueType: "Delivery Delay",
          priority: "High",
          customerTier: "Premium",
          lastPurchase: "2024-01-10",
          totalSpent: "$2,450.00",
          location: "New York, USA",
          phone: "+1 (555) 123-4567",
          email: "john.smith@email.com"
        },
        2: {
          orderId: "#12346",
          orderStatus: "Delivered",
          orderDate: "2024-01-08",
          orderAmount: "$29.99",
          productName: "Monthly Subscription",
          issueType: "General Inquiry",
          priority: "Low",
          customerTier: "Standard",
          lastPurchase: "2024-01-08",
          totalSpent: "$156.99",
          location: "Los Angeles, USA",
          phone: "+1 (555) 987-6543",
          email: "alice.johnson@email.com"
        },
        3: {
          orderId: "#12347",
          orderStatus: "Processing",
          orderDate: "2024-01-12",
          orderAmount: "$159.99",
          productName: "Annual Plan Upgrade",
          issueType: "Billing Question",
          priority: "Medium",
          customerTier: "Premium",
          lastPurchase: "2024-01-12",
          totalSpent: "$890.45",
          location: "Chicago, USA",
          phone: "+1 (555) 456-7890",
          email: "bob.williams@email.com"
        },
        4: {
          orderId: "#12348",
          orderStatus: "Cancelled",
          orderDate: "2024-01-11",
          orderAmount: "$199.99",
          productName: "Enterprise License",
          issueType: "Product Issue",
          priority: "High",
          customerTier: "Enterprise",
          lastPurchase: "2024-01-11",
          totalSpent: "$5,678.90",
          location: "Seattle, USA",
          phone: "+1 (555) 321-0987",
          email: "emily.brown@email.com"
        }
      };

      setProperties(mockProperties[chatId] || mockProperties[1]);
      setLoading(false);
    };

    fetchContactProperties();
  }, [chatId]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="w-80 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700">Contact Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!properties) {
    return null;
  }

  return (
    <Card className="w-80 h-fit border-slate-200 shadow-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          Contact Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {/* Order Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Package className="w-3 h-3" />
            ORDER DETAILS
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Order ID:</span>
              <span className="font-medium text-slate-900">{properties.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <Badge variant="outline" className={getStatusColor(properties.orderStatus)}>
                {properties.orderStatus}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount:</span>
              <span className="font-medium text-slate-900">{properties.orderAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Product:</span>
              <span className="font-medium text-slate-900 text-right">{properties.productName}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Issue Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <AlertCircle className="w-3 h-3" />
            ISSUE DETAILS
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Type:</span>
              <span className="font-medium text-slate-900">{properties.issueType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Priority:</span>
              <Badge variant="outline" className={getPriorityColor(properties.priority)}>
                {properties.priority}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Customer Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <DollarSign className="w-3 h-3" />
            CUSTOMER INFO
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Tier:</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                {properties.customerTier}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Spent:</span>
              <span className="font-medium text-slate-900">{properties.totalSpent}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Phone className="w-3 h-3" />
            CONTACT INFO
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 text-xs">{properties.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 text-xs">{properties.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 text-xs">{properties.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
