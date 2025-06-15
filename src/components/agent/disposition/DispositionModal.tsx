
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
import { useTickets } from '../tickets/useTickets';
import { useCRMIntegrations } from '../tickets/useCRMIntegrations';
import { ChatResolution, DispositionField } from './types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

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
  const { createTicket, priorities, categories } = useTickets();
  const { integrations, getActiveIntegrations } = useCRMIntegrations();
  const { toast } = useToast();
  
  const [selectedDisposition, setSelectedDisposition] = useState<string>('');
  const [fieldValues, setFieldValues] = useState<Record<string, string | number>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionType, setActionType] = useState<'resolve' | 'ticket'>('resolve');
  
  // Ticket form data
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    priority: '',
    category: '',
    crmIntegration: '',
    customerEmail: ''
  });

  const categorizedDispositions = getDispositionsByCategory();
  const activeIntegrations = getActiveIntegrations();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedDisposition) {
      newErrors.disposition = 'Please select a disposition';
    }

    if (actionType === 'resolve') {
      dispositionFields.forEach(field => {
        if (field.required && !fieldValues[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
      });
    } else if (actionType === 'ticket') {
      if (!ticketData.subject) newErrors.ticketSubject = 'Subject is required';
      if (!ticketData.description) newErrors.ticketDescription = 'Description is required';
      if (!ticketData.priority) newErrors.ticketPriority = 'Priority is required';
      if (!ticketData.category) newErrors.ticketCategory = 'Category is required';
      if (!ticketData.crmIntegration) newErrors.ticketCRM = 'CRM integration is required';
    }

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

  const handleTicketDataChange = (field: string, value: string) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    const errorKey = `ticket${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (actionType === 'resolve') {
      const resolution: ChatResolution = {
        chatId,
        dispositionId: selectedDisposition,
        fields: fieldValues,
        notes: additionalNotes,
        resolvedBy: 'Current Agent',
        resolvedAt: new Date().toISOString()
      };

      onResolve(resolution);
      
      toast({
        title: "Chat Resolved",
        description: `Chat with ${customerName} has been successfully resolved.`,
      });
    } else if (actionType === 'ticket') {
      try {
        const selectedPriority = priorities.find(p => p.id === ticketData.priority);
        const selectedCategory = categories.find(c => c.id === ticketData.category);
        const selectedCRM = integrations.find(i => i.id === ticketData.crmIntegration);

        const newTicketData = {
          chatId,
          customerName,
          customerEmail: ticketData.customerEmail,
          subject: ticketData.subject,
          description: ticketData.description,
          priority: selectedPriority!,
          category: selectedCategory!,
          crmIntegration: selectedCRM!,
          tags: [],
          attachments: []
        };

        const ticket = await createTicket(newTicketData);

        // Also resolve the chat with ticket disposition
        const resolution: ChatResolution = {
          chatId,
          dispositionId: selectedDisposition,
          fields: { ticketNumber: ticket.ticketNumber, ...fieldValues },
          notes: `Ticket raised: ${ticket.ticketNumber}. ${additionalNotes}`,
          resolvedBy: 'Current Agent',
          resolvedAt: new Date().toISOString()
        };

        onResolve(resolution);

        toast({
          title: "Ticket Raised & Chat Resolved",
          description: `Ticket #${ticket.ticketNumber} has been raised and sent to ${selectedCRM!.name}. Chat resolved.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to raise ticket. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    // Reset form
    setSelectedDisposition('');
    setFieldValues({});
    setAdditionalNotes('');
    setActionType('resolve');
    setTicketData({
      subject: '',
      description: '',
      priority: '',
      category: '',
      crmIntegration: '',
      customerEmail: ''
    });
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
            Please select a disposition and choose whether to resolve the chat or raise a ticket.
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

          {/* Action Type Selection */}
          {selectedDisposition && (
            <div className="space-y-3 border-t pt-4">
              <Label className="text-sm font-medium">Choose Action</Label>
              <RadioGroup
                value={actionType}
                onValueChange={(value: 'resolve' | 'ticket') => setActionType(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resolve" id="resolve" />
                  <Label htmlFor="resolve" className="flex items-center gap-2 cursor-pointer">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Resolve Chat
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ticket" id="ticket" />
                  <Label htmlFor="ticket" className="flex items-center gap-2 cursor-pointer">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Raise Ticket
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Dynamic Fields for Resolution */}
          {selectedDisposition && actionType === 'resolve' && (
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

          {/* Ticket Form */}
          {selectedDisposition && actionType === 'ticket' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium">Ticket Information</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Email</Label>
                  <Input
                    value={ticketData.customerEmail}
                    onChange={(e) => handleTicketDataChange('customerEmail', e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    CRM Integration <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={ticketData.crmIntegration}
                    onValueChange={(value) => handleTicketDataChange('crmIntegration', value)}
                  >
                    <SelectTrigger className={errors.ticketCRM ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeIntegrations.map((integration) => (
                        <SelectItem key={integration.id} value={integration.id}>
                          {integration.name} ({integration.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ticketCRM && <p className="text-sm text-red-500">{errors.ticketCRM}</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={ticketData.subject}
                  onChange={(e) => handleTicketDataChange('subject', e.target.value)}
                  placeholder="Brief description of the issue"
                  className={errors.ticketSubject ? 'border-red-500' : ''}
                />
                {errors.ticketSubject && <p className="text-sm text-red-500">{errors.ticketSubject}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={ticketData.description}
                  onChange={(e) => handleTicketDataChange('description', e.target.value)}
                  placeholder="Detailed description of the customer's concern..."
                  rows={3}
                  className={errors.ticketDescription ? 'border-red-500' : ''}
                />
                {errors.ticketDescription && <p className="text-sm text-red-500">{errors.ticketDescription}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={ticketData.priority}
                    onValueChange={(value) => handleTicketDataChange('priority', value)}
                  >
                    <SelectTrigger className={errors.ticketPriority ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${priority.color}`}></div>
                            {priority.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ticketPriority && <p className="text-sm text-red-500">{errors.ticketPriority}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={ticketData.category}
                    onValueChange={(value) => handleTicketDataChange('category', value)}
                  >
                    <SelectTrigger className={errors.ticketCategory ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ticketCategory && <p className="text-sm text-red-500">{errors.ticketCategory}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Add any additional notes..."
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
            className={actionType === 'ticket' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {actionType === 'ticket' ? 'Raise Ticket & Resolve' : 'Resolve Chat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
