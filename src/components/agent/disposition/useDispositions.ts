
import { useState, useEffect } from 'react';
import { Disposition, DispositionField } from './types';
import { customizationService } from '@/services/customizationService';

// Fallback dispositions if none configured in studio
const fallbackDispositions: Disposition[] = [
  { id: 'tech-support', name: 'Technical Support', category: 'Support', description: 'Technical issues resolved', isActive: true, createdAt: '2024-01-01' },
  { id: 'billing-inquiry', name: 'Billing Inquiry', category: 'Billing', description: 'Billing related questions', isActive: true, createdAt: '2024-01-01' },
  { id: 'product-info', name: 'Product Information', category: 'Sales', description: 'Product information provided', isActive: true, createdAt: '2024-01-01' },
  { id: 'complaint', name: 'Customer Complaint', category: 'Support', description: 'Customer complaint resolved', isActive: true, createdAt: '2024-01-01' },
  { id: 'refund-request', name: 'Refund Request', category: 'Billing', description: 'Refund request processed', isActive: true, createdAt: '2024-01-01' },
];

// Fallback fields used if customization service has no records
const fallbackFields: DispositionField[] = [
  { id: 'resolution-summary', name: 'resolutionSummary', type: 'textarea', label: 'Resolution Summary', required: true, placeholder: 'Describe how the issue was resolved...' },
  { id: 'customer-satisfaction', name: 'customerSatisfaction', type: 'select', label: 'Customer Satisfaction', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
  { id: 'follow-up-required', name: 'followUpRequired', type: 'select', label: 'Follow-up Required', required: true, options: ['Yes', 'No'] },
  { id: 'time-spent', name: 'timeSpent', type: 'number', label: 'Time Spent (minutes)', required: true, placeholder: 'Enter time in minutes' },
];

export const useDispositions = () => {
  const [dispositions, setDispositions] = useState<Disposition[]>([]);
  const [dispositionFields, setDispositionFields] = useState<DispositionField[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadDispositions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      const studioDispos = await customizationService.listDispositions();
      if (studioDispos && studioDispos.length > 0) {
        const mapped: Disposition[] = studioDispos.map((d: any) => ({
          id: d.key,
          name: d.name,
          category: d.category,
          description: d.description,
          isActive: d.is_active,
          createdAt: d.created_at
        }));
        setDispositions(mapped);
      } else {
        setDispositions(fallbackDispositions);
      }
      // Pull custom fields for 'chats' object to power the resolution form
      const custom = await customizationService.listFieldsForObject('chats');
      if (custom && custom.length > 0) {
        const mapped: DispositionField[] = custom.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: f.type,
          label: f.label,
          required: !!f.required,
          placeholder: f.placeholder || '',
          options: f.options || []
        }));
        setDispositionFields(mapped);
      } else {
        setDispositionFields(fallbackFields);
      }
      setLoading(false);
    };

    loadDispositions();
  }, []);

  // When a specific disposition is selected by UI, load its specific field set (if any)
  const loadPerDispositionFields = async (dispositionKey: string) => {
    setSelectedKey(dispositionKey);
    const per = await customizationService.listDispositionFields(dispositionKey);
    if (per && per.length > 0) {
      const mapped: DispositionField[] = per.map((f: any) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        label: f.label,
        required: !!f.required,
        placeholder: f.placeholder || '',
        options: f.options || []
      }));
      setDispositionFields(mapped);
    }
  };

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
    getDispositionsByCategory,
    loadPerDispositionFields
  };
};
