
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

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

interface CustomerSearchProps {
  onCustomerFound: (customer: CustomerData) => void;
}

export const CustomerSearch = ({ onCustomerFound }: CustomerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const mockCustomerData = {
    'john.smith@email.com': {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      customerSince: '2023-01-15',
      tier: 'Premium',
      previousChats: 12,
      satisfaction: 4.8,
      lastContact: '2024-01-10',
      totalOrders: 8,
      totalSpent: '$2,450.00'
    },
    '+1 (555) 987-6543': {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 987-6543',
      location: 'California, USA',
      customerSince: '2023-03-20',
      tier: 'Pro',
      previousChats: 8,
      satisfaction: 4.9,
      lastContact: '2024-01-12',
      totalOrders: 5,
      totalSpent: '$1,200.00'
    },
    'bob.williams@email.com': {
      name: 'Bob Williams',
      email: 'bob.williams@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Texas, USA',
      customerSince: '2023-06-10',
      tier: 'Basic',
      previousChats: 3,
      satisfaction: 4.5,
      lastContact: '2024-01-08',
      totalOrders: 2,
      totalSpent: '$300.00'
    }
  };

  const handleSearchCustomer = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter an email or phone number to search.",
        variant: "destructive"
      });
      return;
    }

    const foundCustomer = mockCustomerData[searchQuery.trim() as keyof typeof mockCustomerData];
    
    if (foundCustomer) {
      onCustomerFound(foundCustomer);
      toast({
        title: "Customer found",
        description: `Customer information loaded for ${foundCustomer.name}.`,
      });
    } else {
      toast({
        title: "Customer not found",
        description: "No customer found with that email or phone number.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5 text-orange-500" />
          Search Customer
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-3">
          <Input
            placeholder="Enter email address or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomer()}
          />
          <Button 
            onClick={handleSearchCustomer}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Try: john.smith@email.com, +1 (555) 987-6543, or bob.williams@email.com
        </p>
      </CardContent>
    </Card>
  );
};
