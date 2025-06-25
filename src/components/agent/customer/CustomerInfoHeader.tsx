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
    <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50 rounded-t-2xl shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-blue-900 tracking-tight">Customer 360° View</h2>
        </div>
      </div>

      <CustomerSearch onCustomerFound={onCustomerFound} />
      <CustomerHeader customer={customer} customerInsights={customerInsights} />
    </div>
  );
};
