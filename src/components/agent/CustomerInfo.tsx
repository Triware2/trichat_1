
import { useState } from 'react';
import { CustomerInfoHeader } from './customer/CustomerInfoHeader';
import { CustomerTabsContent } from './customer/CustomerTabsContent';
import { CustomerDataProvider } from './customer/CustomerDataProvider';
import { CustomerData } from './customer/CustomerDataTypes';
import {
  getCustomerInsights,
  getInteractionTimeline,
  getIssueCategories,
  getProductUsage,
  getCommunicationPreferences,
  getOrderHistory,
  getInitialNotes
} from './customer/CustomerDataProvider';

interface CustomerInfoProps {
  customer: CustomerData;
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  const [currentCustomer, setCurrentCustomer] = useState(customer);

  // Get customer data from provider
  const customerInsights = getCustomerInsights();

  const handleCustomerFound = (foundCustomer: CustomerData) => {
    setCurrentCustomer(foundCustomer);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <CustomerInfoHeader
        customer={currentCustomer}
        customerInsights={customerInsights}
        onCustomerFound={handleCustomerFound}
      />

      <CustomerDataProvider customerName={currentCustomer.name}>
        <CustomerTabsContent />
      </CustomerDataProvider>
    </div>
  );
};
