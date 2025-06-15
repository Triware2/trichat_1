
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Settings,
  CreditCard,
  Percent,
  Users,
  Calendar,
  Target,
  Award,
  Zap
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
  conversion: number;
  churn: number;
}

export const RevenueManagement = () => {
  const [pricingTiers] = useState<PricingTier[]>([
    {
      id: '1',
      name: 'Starter Pro',
      price: 49,
      billing: 'monthly',
      features: ['5,000 API calls', 'Priority support', 'Advanced analytics', '5 team members'],
      clients: 1247,
      revenue: '$61,303',
      status: 'active',
      conversion: 18.5,
      churn: 3.2
    },
    {
      id: '2',
      name: 'Business Elite',
      price: 149,
      billing: 'monthly',
      features: ['25,000 API calls', '24/7 support', 'Custom integrations', '25 team members'],
      clients: 834,
      revenue: '$124,266',
      status: 'active',
      conversion: 24.8,
      churn: 2.1
    },
    {
      id: '3',
      name: 'Enterprise Pro',
      price: 449,
      billing: 'monthly',
      features: ['Unlimited API calls', 'Dedicated support', 'White-label', 'Unlimited team'],
      clients: 267,
      revenue: '$119,883',
      status: 'active',
      conversion: 31.7,
      churn: 1.4
    }
  ];

  const revenueMetrics = [
    { title: 'Monthly Recurring Revenue', value: '$847,392', change: '+23.8%', icon: DollarSign, color: 'from-emerald-400 to-emerald-600' },
    { title: 'Annual Contract Value', value: '$10.1M', change: '+31.2%', icon: Target, color: 'from-blue-400 to-blue-600' },
    { title: 'Average Revenue Per User', value: '$127', change: '+15.7%', icon: Users, color: 'from-purple-400 to-purple-600' },
    { title: 'Customer Lifetime Value', value: '$3,420', change: '+18.9%', icon: Award, color: 'from-orange-400 to-orange-600' },
    { title: 'Conversion Rate', value: '24.8%', change: '+5.2%', icon: TrendingUp, color: 'from-green-400 to-green-600' },
    { title: 'Churn Rate', value: '2.1%', change: '-1.3%', icon: Percent, color: 'from-red-400 to-red-600' }
  ];

  const totalRevenue = pricingTiers.reduce((sum, tier) => {
    return sum + parseFloat(tier.revenue.replace('$', '').replace(',', ''));
  }, 0);

  const totalClients = pricingTiers.reduce((sum, tier) => sum + tier.clients, 0);

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Revenue Engine</h1>
          </div>
          <p className="text-gray-600 ml-12">Dynamic pricing control and revenue optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            Billing Settings
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Pricing Tier
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {revenueMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <p className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' : 
                  metric.title === 'Churn Rate' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalClients.toLocaleString()}</div>
            <p className="text-xs text-blue-600">+8.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Average Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${Math.round(totalRevenue / totalClients)}</div>
            <p className="text-xs text-purple-600">Per client per month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Growth Rate</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">+23.8%</div>
            <p className="text-xs text-orange-600">Monthly growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Tiers Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => (
          <Card key={tier.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">{tier.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-3xl font-bold text-emerald-600">${tier.price}</span>
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
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Clients</span>
                  <span className="font-semibold text-gray-900">{tier.clients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold text-emerald-600">{tier.revenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-blue-600">{tier.conversion}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Churn Rate</span>
                  <span className="font-semibold text-red-600">{tier.churn}%</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1 bg-white/60">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Tier
                </Button>
                <Button size="sm" variant="outline" className="bg-white/60">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Tools */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Revenue Optimization Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Percent className="w-8 h-8 mb-2 text-green-600" />
              <span className="font-semibold">Dynamic Discounts</span>
              <span className="text-xs text-gray-500">Create smart offers</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <CreditCard className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-semibold">Payment Gateway</span>
              <span className="text-xs text-gray-500">Manage transactions</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Calendar className="w-8 h-8 mb-2 text-purple-600" />
              <span className="font-semibold">Billing Cycles</span>
              <span className="text-xs text-gray-500">Customize billing</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Target className="w-8 h-8 mb-2 text-orange-600" />
              <span className="font-semibold">Revenue Goals</span>
              <span className="text-xs text-gray-500">Track targets</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
