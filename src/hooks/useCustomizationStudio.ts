
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Customization {
  id: string;
  name: string;
  description: string;
  type: 'theme' | 'component' | 'workflow' | 'integration';
  category: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export const useCustomizationStudio = () => {
  const { toast } = useToast();
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createCustomization = useCallback(async (data: Omit<Customization, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const newCustomization: Customization = {
        ...data,
        id: Date.now().toString(),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCustomizations(prev => [newCustomization, ...prev]);
      
      toast({
        title: "Customization Created",
        description: `${data.name} has been created successfully.`,
      });
      
      return newCustomization;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customization. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateCustomization = useCallback(async (id: string, updates: Partial<Customization>) => {
    setIsLoading(true);
    try {
      setCustomizations(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      );
      
      toast({
        title: "Customization Updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customization. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteCustomization = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      setCustomizations(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Customization Deleted",
        description: "Customization has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customization. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    customizations,
    isLoading,
    createCustomization,
    updateCustomization,
    deleteCustomization
  };
};
