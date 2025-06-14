
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ExternalLink, CreditCard, ShoppingCart, Headphones } from 'lucide-react';

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

interface ProfileTabProps {
  customer: CustomerData;
}

export const ProfileTab = ({ customer }: ProfileTabProps) => {
  return (
    <div className="space-y-6">
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
                <p className="text-xs text-slate-600">Primary Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Phone className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">{customer.phone}</p>
                <p className="text-xs text-slate-600">Primary Phone</p>
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

      {/* Customer Statistics */}
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
          <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
            <Headphones className="w-4 h-4 mr-2" />
            Escalate to Manager
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
