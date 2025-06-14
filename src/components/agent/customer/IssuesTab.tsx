
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShoppingCart, TrendingUp, TrendingDown, Activity, Star } from 'lucide-react';

interface IssueCategoryItem {
  category: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  lastIssue: string;
}

interface OrderHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: string;
  items: string;
  satisfaction: number;
}

interface IssuesTabProps {
  issueCategories: IssueCategoryItem[];
  orderHistory: OrderHistoryItem[];
}

export const IssuesTab = ({ issueCategories, orderHistory }: IssuesTabProps) => {
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};
