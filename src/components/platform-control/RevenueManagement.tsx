
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Plus,
  Shield,
  BarChart3
} from 'lucide-react';

export const RevenueManagement = () => {
  const revenueMetrics = [
    { 
      title: 'Total Revenue', 
      value: '$2,847,392', 
      change: '+18.7%', 
      icon: DollarSign, 
      trend: 'up'
    },
    { 
      title: 'Monthly Recurring', 
      value: '$247,830', 
      change: '+12.4%', 
      icon: TrendingUp, 
      trend: 'up'
    },
    { 
      title: 'Active Subscriptions', 
      value: '2,634', 
      change: '+8.9%', 
      icon: CreditCard, 
      trend: 'up'
    },
    { 
      title: 'Paying Customers', 
      value: '1,284', 
      change: '+15.2%', 
      icon: Users, 
      trend: 'up'
    }
  ];

  const recentTransactions = [
    { 
      id: 1, 
      customer: 'TechCorp Industries',
      amount: '$2,450', 
      plan: 'Enterprise',
      status: 'completed',
      date: '2 hours ago'
    },
    { 
      id: 2, 
      customer: 'Innovation Labs',
      amount: '$890', 
      plan: 'Professional',
      status: 'completed',
      date: '1 day ago'
    },
    { 
      id: 3, 
      customer: 'Digital Solutions',
      amount: '$290', 
      plan: 'Standard',
      status: 'pending',
      date: '2 days ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Revenue Management</h1>
          <p className="text-gray-600">Financial oversight and subscription management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    {metric.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-green-100">
                    <DollarSign className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{transaction.customer}</h4>
                    <p className="text-sm text-gray-600">{transaction.plan} Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{transaction.amount}</div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Tools */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span>Revenue Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Revenue Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing Management
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Customer Value
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
