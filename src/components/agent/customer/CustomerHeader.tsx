
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Star, Heart, Zap, CheckCircle, Shield } from 'lucide-react';

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

interface CustomerInsights {
  healthScore: number;
  riskLevel: string;
  sentimentTrend: string;
  responseTime: string;
  resolutionRate: string;
  escalationRate: string;
  preferredChannel: string;
  timezone: string;
  lastLoginDate: string;
  accountStatus: string;
  paymentStatus: string;
  contractExpiry: string;
}

interface CustomerHeaderProps {
  customer: CustomerData;
  customerInsights: CustomerInsights;
}

export const CustomerHeader = ({ customer, customerInsights }: CustomerHeaderProps) => {
  const getTierBadge = (tier: string) => {
    const variants = {
      'Premium': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'Pro': 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
      'Basic': 'bg-slate-100 text-slate-700'
    };
    const className = variants[tier as keyof typeof variants] || variants.Basic;
    return <Badge className={`${className} border-0 font-medium`}>{tier}</Badge>;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getTierBadge(customer.tier)}
                <Badge className="bg-slate-100 text-slate-700">ID: #CX{customer.email.slice(0,4).toUpperCase()}</Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">Customer since {customer.customerSince}</p>
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
  );
};
