
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Mail, 
  Smartphone,
  Code,
  Check,
  Loader2
} from 'lucide-react';

interface QuickSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete?: () => void;
}

export const QuickSetupModal = ({ open, onOpenChange, onSetupComplete }: QuickSetupModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const channelOptions = [
    { id: 'website', name: 'Website Chat', icon: Globe, description: 'Embed chat widget on your website' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageCircle, description: 'Connect to WhatsApp Business API' },
    { id: 'facebook', name: 'Facebook Messenger', icon: Facebook, description: 'Integrate with Facebook Messenger' },
    { id: 'instagram', name: 'Instagram DM', icon: Instagram, description: 'Handle Instagram direct messages' },
    { id: 'email', name: 'Email Support', icon: Mail, description: 'Manage email support tickets' },
    { id: 'sms', name: 'SMS Support', icon: Smartphone, description: 'Text message support' },
    { id: 'api', name: 'API Integration', icon: Code, description: 'Custom API integration' }
  ];

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSetup = async () => {
    setLoading(true);
    // Simulate setup process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    onSetupComplete?.();
    onOpenChange(false);
    setStep(1);
    setSelectedChannels([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Setup - Chat Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Step 1: Select Communication Channels</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Choose which channels you want to enable for customer communication
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channelOptions.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = selectedChannels.includes(channel.id);
                  
                  return (
                    <Card 
                      key={channel.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-blue-100' : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{channel.name}</h4>
                              {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                            <p className="text-xs text-slate-600">{channel.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={selectedChannels.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Step 2: Configure Basic Settings</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Set up basic configuration for your selected channels
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Auto Response</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Enable auto response" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Routing Strategy</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select routing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="least_busy">Least Busy</SelectItem>
                      <SelectItem value="skill_based">Skill Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Concurrent Chats</Label>
                  <Input type="number" placeholder="10" />
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSetup}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      'Complete Setup'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
