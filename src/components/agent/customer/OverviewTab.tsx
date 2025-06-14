
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Target, UserCheck, CheckCircle, CreditCard, Calendar, Clock } from 'lucide-react';

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

interface CommunicationPreferences {
  preferredChannel: string;
  preferredTime: string;
  language: string;
  notifications: string;
  frequency: string;
}

interface ProductUsageItem {
  product: string;
  usage: string;
  status: string;
  lastUsed: string;
}

interface OverviewTabProps {
  customerInsights: CustomerInsights;
  communicationPreferences: CommunicationPreferences;
  productUsage: ProductUsageItem[];
}

export const OverviewTab = ({ customerInsights, communicationPreferences, productUsage }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Customer Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communication Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Communication Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Preferred Channel:</span>
              <Badge className="bg-blue-100 text-blue-700">{communicationPreferences.preferredChannel}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Best Time:</span>
              <span className="text-sm font-medium">{communicationPreferences.preferredTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Language:</span>
              <span className="text-sm font-medium">{communicationPreferences.language}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Timezone:</span>
              <span className="text-sm font-medium">{customerInsights.timezone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Product Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Product Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productUsage.map((product, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{product.product}</span>
                  <span className="text-sm text-slate-600">{product.usage}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: product.usage }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{product.status}</span>
                  <span>Last used: {product.lastUsed}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Account Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-500" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-emerald-700">{customerInsights.accountStatus}</p>
              <p className="text-xs text-emerald-600">Account Status</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">{customerInsights.paymentStatus}</p>
              <p className="text-xs text-blue-600">Payment Status</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">{customerInsights.contractExpiry}</p>
              <p className="text-xs text-purple-600">Contract Expiry</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-amber-700">{customerInsights.lastLoginDate}</p>
              <p className="text-xs text-amber-600">Last Login</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
