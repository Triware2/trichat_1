
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Search } from 'lucide-react';
import { CustomerHeader } from './CustomerHeader';
import { CustomerSearch } from './CustomerSearch';

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

interface CustomerInfoHeaderProps {
  customer: CustomerData;
  customerInsights: CustomerInsights;
  onCustomerFound: (customer: CustomerData) => void;
}

export const CustomerInfoHeader = ({ customer, customerInsights, onCustomerFound }: CustomerInfoHeaderProps) => {
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const handleQuickSearch = () => {
    if (quickSearchQuery.trim()) {
      console.log('Quick search in customer data:', quickSearchQuery);
      // Quick search functionality would be implemented here
    }
  };

  return (
    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer 360° View</h2>
          <p className="text-sm text-slate-600">Complete customer insights for better support</p>
        </div>
        
        {/* Quick Search in Customer Data */}
        <div className="ml-auto flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search in customer data..."
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              className="pl-10 w-64 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
              onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
            />
          </div>
          <Button 
            onClick={handleQuickSearch}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CustomerSearch onCustomerFound={onCustomerFound} />
      <CustomerHeader customer={customer} customerInsights={customerInsights} />
    </div>
  );
};
