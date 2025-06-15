
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Target,
  Download,
  Settings,
  BarChart3,
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react';

export const RevenueManagement = () => {
  const revenueMetrics = [
    { title: 'Total Revenue', value: '$2,847,392', change: '+18.7%', icon: DollarSign, color: 'from-emerald-400 to-emerald-600' },
    { title: 'Monthly Recurring', value: '$847,293', change: '+24.3%', icon: CreditCard, color: 'from-blue-400 to-blue-600' },
    { title: 'Average Revenue Per User', value: '$127.45', change: '+12.8%', icon: Users, color: 'from-purple-400 to-purple-600' },
    { title: 'Revenue Growth Rate', value: '24.7%', change: '+3.2%', icon: TrendingUp, color: 'from-green-400 to-green-600' }
  ];

  const pricingTiers = [
    { 
      name: 'Starter', 
      price: '$29/mo', 
      clients: 1247, 
      revenue: '$36,163', 
      conversion: '12.4%',
      trend: 'up'
    },
    { 
      name: 'Professional', 
      price: '$99/mo', 
      clients: 892, 
      revenue: '$88,308', 
      conversion: '8.7%',
      trend: 'up'
    },
    { 
      name: 'Enterprise', 
      price: '$299/mo', 
      clients: 456, 
      revenue: '$136,344', 
      conversion: '15.2%',
      trend: 'up'
    },
    { 
      name: 'Enterprise Pro', 
      price: '$599/mo', 
      clients: 178, 
      revenue: '$106,622', 
      conversion: '22.1%',
      trend: 'up'
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Revenue Command Center</h1>
          </div>
          <p className="text-gray-600 ml-12">Dynamic pricing control and revenue optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Revenue Report
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
            <Settings className="w-4 h-4 mr-2" />
            Pricing Settings
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">{metric.change} from last month</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Tiers Performance */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Pricing Tiers Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                    <p className="text-sm text-gray-600">{tier.price}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tier.clients}</div>
                    <div className="text-xs text-gray-500">Clients</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tier.revenue}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tier.conversion}</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="bg-white/60">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Insights */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Revenue Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900">Upsell Opportunity</h4>
                <Badge className="bg-green-100 text-green-700">High Impact</Badge>
              </div>
              <p className="text-sm text-green-700">127 Professional clients ready for Enterprise upgrade</p>
              <p className="text-xs text-green-600 mt-1">Potential revenue increase: +$47K/month</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900">Pricing Optimization</h4>
                <Badge className="bg-blue-100 text-blue-700">Medium Impact</Badge>
              </div>
              <p className="text-sm text-blue-700">Starter tier shows high price sensitivity</p>
              <p className="text-xs text-blue-600 mt-1">Consider $24/month price point for +15% conversion</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-900">Churn Risk Alert</h4>
                <Badge className="bg-yellow-100 text-yellow-700">Watch</Badge>
              </div>
              <p className="text-sm text-yellow-700">23 Enterprise clients showing usage decline</p>
              <p className="text-xs text-yellow-600 mt-1">Proactive outreach recommended within 7 days</p>
            </div>

            <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Generate Revenue Strategy
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Revenue Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <DollarSign className="w-8 h-8 mb-2 text-emerald-600" />
              <span className="font-semibold">Update Pricing</span>
              <span className="text-xs text-gray-500">Modify tier prices</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Users className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-semibold">Bulk Upgrades</span>
              <span className="text-xs text-gray-500">Mass tier changes</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Target className="w-8 h-8 mb-2 text-purple-600" />
              <span className="font-semibold">Promo Campaigns</span>
              <span className="text-xs text-gray-500">Create offers</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <BarChart3 className="w-8 h-8 mb-2 text-orange-600" />
              <span className="font-semibold">Revenue Forecast</span>
              <span className="text-xs text-gray-500">Predict growth</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
