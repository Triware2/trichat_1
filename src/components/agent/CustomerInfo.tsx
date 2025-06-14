
import { useState } from 'react';
import { CustomerInfoHeader } from './customer/CustomerInfoHeader';
import { CustomerTabsContent } from './customer/CustomerTabsContent';
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
  const [notes, setNotes] = useState(getInitialNotes());

  // Get customer data from provider
  const customerInsights = getCustomerInsights();
  const interactionTimeline = getInteractionTimeline();
  const issueCategories = getIssueCategories();
  const productUsage = getProductUsage();
  const communicationPreferences = getCommunicationPreferences();
  const orderHistory = getOrderHistory();

  const handleCustomerFound = (foundCustomer: CustomerData) => {
    setCurrentCustomer(foundCustomer);
  };

  const handleAddNote = (note: any) => {
    setNotes([note, ...notes]);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      <CustomerInfoHeader
        customer={currentCustomer}
        customerInsights={customerInsights}
        onCustomerFound={handleCustomerFound}
      />

      <CustomerTabsContent
        customer={currentCustomer}
        customerInsights={customerInsights}
        interactionTimeline={interactionTimeline}
        issueCategories={issueCategories}
        productUsage={productUsage}
        communicationPreferences={communicationPreferences}
        orderHistory={orderHistory}
        notes={notes}
        onAddNote={handleAddNote}
      />
    </div>
  );
};
