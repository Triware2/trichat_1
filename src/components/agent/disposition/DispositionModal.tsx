
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useDispositions } from './useDispositions';
import { ChatResolution, DispositionField } from './types';

interface DispositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  customerName: string;
  onResolve: (resolution: ChatResolution) => void;
}

export const DispositionModal = ({ 
  isOpen, 
  onClose, 
  chatId, 
  customerName, 
  onResolve 
}: DispositionModalProps) => {
  const { dispositions, dispositionFields, loading, getDispositionsByCategory } = useDispositions();
  const { toast } = useToast();
  
  const [selectedDisposition, setSelectedDisposition] = useState<string>('');
  const [fieldValues, setFieldValues] = useState<Record<string, string | number>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categorizedDispositions = getDispositionsByCategory();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedDisposition) {
      newErrors.disposition = 'Please select a disposition';
    }

    dispositionFields.forEach(field => {
      if (field.required && !fieldValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const resolution: ChatResolution = {
      chatId,
      dispositionId: selectedDisposition,
      fields: fieldValues,
      notes: additionalNotes,
      resolvedBy: 'Current Agent', // This would come from auth context
      resolvedAt: new Date().toISOString()
    };

    onResolve(resolution);
    
    toast({
      title: "Chat Resolved",
      description: `Chat with ${customerName} has been successfully resolved.`,
    });

    // Reset form
    setSelectedDisposition('');
    setFieldValues({});
    setAdditionalNotes('');
    setErrors({});
    onClose();
  };

  const renderField = (field: DispositionField) => {
    const value = fieldValues[field.name] || '';
    const hasError = !!errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={hasError ? 'border-red-500' : ''}
            rows={3}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || 0)}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value as string}
            onValueChange={(val) => handleFieldChange(field.name, val)}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">Loading dispositions...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resolve Chat - {customerName}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Please select a disposition and fill in the required information to resolve this chat.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Disposition Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Select Disposition <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={selectedDisposition}
              onValueChange={setSelectedDisposition}
              className="space-y-3"
            >
              {Object.entries(categorizedDispositions).map(([category, categoryDispositions]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">
                    {category}
                  </h4>
                  {categoryDispositions.map((disposition) => (
                    <div key={disposition.id} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={disposition.id} id={disposition.id} className="mt-1" />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={disposition.id} className="text-sm font-medium cursor-pointer">
                          {disposition.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {disposition.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </RadioGroup>
            {errors.disposition && (
              <p className="text-sm text-red-500">{errors.disposition}</p>
            )}
          </div>

          {/* Dynamic Fields */}
          {selectedDisposition && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium">Required Information</h4>
              {dispositionFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-sm text-red-500">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Add any additional notes about this resolution..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedDisposition}
            className="bg-green-600 hover:bg-green-700"
          >
            Resolve Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
