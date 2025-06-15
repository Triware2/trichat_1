
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTickets } from './useTickets';
import { useCRMIntegrations } from './useCRMIntegrations';
import { Ticket, TicketPriority, TicketCategory } from './types';
import { 
  AlertTriangle, 
  Upload, 
  X, 
  ExternalLink,
  Building2,
  Tag
} from 'lucide-react';

interface RaiseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  customerName: string;
  customerEmail?: string;
  chatContext?: string;
}

export const RaiseTicketModal = ({
  isOpen,
  onClose,
  chatId,
  customerName,
  customerEmail = '',
  chatContext = ''
}: RaiseTicketModalProps) => {
  const { toast } = useToast();
  const { createTicket, priorities, categories } = useTickets();
  const { integrations, getActiveIntegrations } = useCRMIntegrations();
  
  const [formData, setFormData] = useState({
    subject: '',
    description: chatContext,
    priority: '',
    category: '',
    crmIntegration: '',
    tags: [] as string[],
    customerEmail: customerEmail
  });
  
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeIntegrations = getActiveIntegrations();

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.description || !formData.priority || !formData.category || !formData.crmIntegration) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPriority = priorities.find(p => p.id === formData.priority);
      const selectedCategory = categories.find(c => c.id === formData.category);
      const selectedCRM = integrations.find(i => i.id === formData.crmIntegration);

      if (!selectedPriority || !selectedCategory || !selectedCRM) {
        throw new Error('Invalid selection');
      }

      const ticketData = {
        chatId,
        customerName,
        customerEmail: formData.customerEmail,
        subject: formData.subject,
        description: formData.description,
        priority: selectedPriority,
        category: selectedCategory,
        crmIntegration: selectedCRM,
        tags: formData.tags,
        attachments
      };

      const ticket = await createTicket(ticketData);

      toast({
        title: "Ticket Created Successfully",
        description: `Ticket #${ticket.ticketNumber} has been raised and sent to ${selectedCRM.name}.`,
      });

      // Reset form
      setFormData({
        subject: '',
        description: '',
        priority: '',
        category: '',
        crmIntegration: '',
        tags: [],
        customerEmail: ''
      });
      setAttachments([]);
      onClose();

    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Raise Support Ticket - {customerName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Escalate this complex issue to your connected CRM system for specialized handling.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-sm">Customer Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Customer Name</Label>
                <Input value={customerName} disabled className="bg-white" />
              </div>
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="customer@email.com"
                />
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of the issue"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the customer's concern and context from the chat..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="mt-1">
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
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="mt-1">
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
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                CRM Integration <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.crmIntegration} onValueChange={(value) => setFormData(prev => ({ ...prev, crmIntegration: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select CRM system" />
                </SelectTrigger>
                <SelectContent>
                  {activeIntegrations.map((integration) => (
                    <SelectItem key={integration.id} value={integration.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {integration.name}
                        <Badge variant="secondary" className="text-xs">
                          {integration.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeIntegrations.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No CRM integrations configured. Contact admin to set up integrations.</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleTagAdd}>
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* File Attachments */}
            <div>
              <Label className="text-sm font-medium">Attachments</Label>
              <div className="mt-1">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600 mt-1">Click to upload files or drag and drop</p>
                  </div>
                </Label>
              </div>
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                      <span>{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || activeIntegrations.length === 0}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? 'Creating Ticket...' : 'Raise Ticket'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
