
import { TabsContent } from '@/components/ui/tabs';
import { CannedResponses } from '@/components/agent/CannedResponses';
import { CustomerInfo } from '@/components/agent/CustomerInfo';

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
    <>
      <TabsContent value="responses" className="h-full overflow-y-auto">
        <CannedResponses onSelectResponse={() => {}} isSelectionMode={false} />
      </TabsContent>

      <TabsContent value="customer" className="h-full overflow-y-auto">
        <CustomerInfo customer={customer} />
      </TabsContent>
    </>
  );
};
