
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  TrendingUp,
  Package,
  Settings,
  Percent,
  CreditCard
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  clients: number;
  revenue: string;
  status: 'active' | 'inactive';
}

export const PricingManagement = () => {
  const { toast } = useToast();
  const [pricingTiers] = useState<PricingTier[]>([
    {
      id: '1',
      name: 'Starter',
      price: 29,
      billing: 'monthly',
      features: ['Up to 1,000 API calls', 'Basic support', 'Standard features'],
      clients: 487,
      revenue: '$14,123',
      status: 'active'
    },
    {
      id: '2',
      name: 'Professional',
      price: 99,
      billing: 'monthly',
      features: ['Up to 10,000 API calls', 'Priority support', 'Advanced features', 'Analytics'],
      clients: 234,
      revenue: '$23,166',
      status: 'active'
    },
    {
      id: '3',
      name: 'Enterprise',
      price: 299,
      billing: 'monthly',
      features: ['Unlimited API calls', '24/7 support', 'Custom features', 'White-label'],
      clients: 67,
      revenue: '$20,033',
      status: 'active'
    }
  ]);

  const handleEditTier = (tierId: string) => {
    toast({
      title: "Edit Pricing Tier",
      description: `Opening edit form for tier ${tierId}`,
    });
  };

  const handleDeleteTier = (tierId: string) => {
    toast({
      title: "Delete Pricing Tier",
      description: `Pricing tier ${tierId} has been deleted`,
      variant: "destructive"
    });
  };

  const totalRevenue = pricingTiers.reduce((sum, tier) => {
    return sum + parseFloat(tier.revenue.replace('$', '').replace(',', ''));
  }, 0);

  const totalClients = pricingTiers.reduce((sum, tier) => sum + tier.clients, 0);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing & Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage pricing tiers, billing, and revenue optimization</p>
        </div>
        <Button className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create New Tier
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients.toLocaleString()}</div>
            <p className="text-xs text-blue-600">+8.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(totalRevenue / totalClients)}</div>
            <p className="text-xs text-purple-600">Per client per month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tiers</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pricingTiers.filter(t => t.status === 'active').length}</div>
            <p className="text-xs text-orange-600">Pricing options</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => (
          <Card key={tier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-3xl font-bold text-blue-600">${tier.price}</span>
                    <span className="text-gray-500">/{tier.billing}</span>
                  </div>
                </div>
                <Badge className={tier.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {tier.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                <ul className="space-y-1">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Clients</span>
                  <span className="font-semibold">{tier.clients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold text-green-600">{tier.revenue}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditTier(tier.id)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteTier(tier.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Tools & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Percent className="w-6 h-6 mb-2 text-green-600" />
              <span>Create Discount</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="w-6 h-6 mb-2 text-blue-600" />
              <span>Payment Gateway</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="w-6 h-6 mb-2 text-purple-600" />
              <span>Billing Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
