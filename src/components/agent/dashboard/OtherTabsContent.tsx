
import { CustomerTabsContent } from '../customer/CustomerTabsContent';
import { CustomerDataProvider } from '../customer/CustomerDataProvider';

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

interface OtherTabsContentProps {
  customer: CustomerData;
}

export const OtherTabsContent = ({ customer }: OtherTabsContentProps) => {
  return (
    <div className="h-full overflow-hidden">
      <CustomerDataProvider customerName={customer.name}>
        <CustomerTabsContent />
      </CustomerDataProvider>
    </div>
  );
};
