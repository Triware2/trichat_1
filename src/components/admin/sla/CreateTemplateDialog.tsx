
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Mail, Smartphone, Bell } from 'lucide-react';

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateCreated: (template: any) => void;
}

export const CreateTemplateDialog = ({ open, onOpenChange, onTemplateCreated }: CreateTemplateDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    recipients: '',
    template: '',
    channels: [] as string[],
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.recipients || !formData.template) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.channels.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one notification channel.",
        variant: "destructive"
      });
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      recipients: formData.recipients,
      channels: formData.channels,
      isActive: formData.isActive,
      template: formData.template
    };

    onTemplateCreated(newTemplate);
    onOpenChange(false);
    setFormData({
      name: '',
      type: '',
      recipients: '',
      template: '',
      channels: [],
      isActive: true
    });
    
    toast({
      title: "Template Created",
      description: `${formData.name} has been successfully created.`,
    });
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, channels: [...formData.channels, channel] });
    } else {
      setFormData({ ...formData, channels: formData.channels.filter(c => c !== channel) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Notification Template</DialogTitle>
          <DialogDescription>
            Create a new notification template for SLA events and alerts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="SLA Breach Alert - Agent"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breach-alert">Breach Alert</SelectItem>
                  <SelectItem value="sla-warning">SLA Warning</SelectItem>
                  <SelectItem value="escalation">Escalation</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="resolution">Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients *</Label>
            <Select value={formData.recipients} onValueChange={(value) => setFormData({ ...formData, recipients: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notification Channels *</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={formData.channels.includes('email')}
                  onCheckedChange={(checked) => handleChannelChange('email', checked as boolean)}
                />
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={formData.channels.includes('sms')}
                  onCheckedChange={(checked) => handleChannelChange('sms', checked as boolean)}
                />
                <Label htmlFor="sms" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  SMS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-app"
                  checked={formData.channels.includes('in-app')}
                  onCheckedChange={(checked) => handleChannelChange('in-app', checked as boolean)}
                />
                <Label htmlFor="in-app" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  In-App
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-content">Message Template *</Label>
            <Textarea
              id="template-content"
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              placeholder="Case #{case_id} has breached its SLA target. Please take immediate action."
              rows={4}
              required
            />
            <p className="text-xs text-gray-500">
              Use variables like {`#{case_id}, #{customer_name}, #{agent_name}, #{sla_time}`} in your template.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
            />
            <Label htmlFor="is-active">Active template</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
