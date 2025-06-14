
import { useState, useEffect } from 'react';
import { Disposition, DispositionField } from './types';

// Mock data - in real app this would come from API
const mockDispositions: Disposition[] = [
  {
    id: 'tech-support',
    name: 'Technical Support',
    category: 'Support',
    description: 'Technical issues resolved',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'billing-inquiry',
    name: 'Billing Inquiry',
    category: 'Billing',
    description: 'Billing related questions',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'product-info',
    name: 'Product Information',
    category: 'Sales',
    description: 'Product information provided',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'complaint',
    name: 'Customer Complaint',
    category: 'Support',
    description: 'Customer complaint resolved',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'refund-request',
    name: 'Refund Request',
    category: 'Billing',
    description: 'Refund request processed',
    isActive: true,
    createdAt: '2024-01-01'
  }
];

const mockDispositionFields: DispositionField[] = [
  {
    id: 'resolution-summary',
    name: 'resolutionSummary',
    type: 'textarea',
    label: 'Resolution Summary',
    required: true,
    placeholder: 'Describe how the issue was resolved...'
  },
  {
    id: 'customer-satisfaction',
    name: 'customerSatisfaction',
    type: 'select',
    label: 'Customer Satisfaction',
    required: true,
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
  },
  {
    id: 'follow-up-required',
    name: 'followUpRequired',
    type: 'select',
    label: 'Follow-up Required',
    required: true,
    options: ['Yes', 'No']
  },
  {
    id: 'escalation-level',
    name: 'escalationLevel',
    type: 'select',
    label: 'Escalation Level',
    required: false,
    options: ['Level 1', 'Level 2', 'Level 3', 'Management']
  },
  {
    id: 'time-spent',
    name: 'timeSpent',
    type: 'number',
    label: 'Time Spent (minutes)',
    required: true,
    placeholder: 'Enter time in minutes'
  }
];

export const useDispositions = () => {
  const [dispositions, setDispositions] = useState<Disposition[]>([]);
  const [dispositionFields, setDispositionFields] = useState<DispositionField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadDispositions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setDispositions(mockDispositions);
      setDispositionFields(mockDispositionFields);
      setLoading(false);
    };

    loadDispositions();
  }, []);

  const getActiveDispositions = () => {
    return dispositions.filter(d => d.isActive);
  };

  const getDispositionsByCategory = () => {
    const categories: Record<string, Disposition[]> = {};
    dispositions.forEach(disposition => {
      if (!categories[disposition.category]) {
        categories[disposition.category] = [];
      }
      categories[disposition.category].push(disposition);
    });
    return categories;
  };

  return {
    dispositions,
    dispositionFields,
    loading,
    getActiveDispositions,
    getDispositionsByCategory
  };
};
