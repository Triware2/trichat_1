
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Globe, 
  MessageCircle, 
  Users, 
  Clock, 
  Shield,
  Bot,
  Target,
  Settings2,
  Check
} from 'lucide-react';

interface QuickSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickSetupModal = ({ open, onOpenChange }: QuickSetupModalProps) => {
  const [setupStep, setSetupStep] = useState('channels');
  const [setupData, setSetupData] = useState({
    channels: {
      website: { enabled: true, priority: 'high', maxChats: 50 },
      whatsapp: { enabled: false, priority: 'medium', maxChats: 30 },
      facebook: { enabled: false, priority: 'low', maxChats: 20 },
      email: { enabled: false, priority: 'medium', maxChats: 100 }
    },
    businessHours: {
      enabled: true,
      timezone: 'UTC',
      weekdays: { start: '09:00', end: '17:00' },
      weekends: { start: '10:00', end: '14:00', enabled: false }
    },
    routing: {
      strategy: 'least_busy',
      fallbackEnabled: true,
      skillBasedRouting: false,
      priorityRouting: true
    },
    automation: {
      autoResponse: true,
      responseDelay: 30,
      escalationEnabled: true,
      escalationTime: 300,
      botIntegration: false
    },
    agents: {
      maxConcurrentChats: 5,
      autoAssignment: true,
      workloadBalancing: true,
      skillRequirements: []
    }
  });

  const setupSteps = [
    { id: 'channels', title: 'Channel Setup', icon: Globe },
    { id: 'hours', title: 'Business Hours', icon: Clock },
    { id: 'routing', title: 'Chat Routing', icon: Target },
    { id: 'automation', title: 'Automation', icon: Bot },
    { id: 'agents', title: 'Agent Settings', icon: Users },
    { id: 'review', title: 'Review & Deploy', icon: Check }
  ];

  const handleSetupComplete = () => {
    console.log('Setup completed with data:', setupData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-blue-600" />
            Quick Setup Ecosystem
          </DialogTitle>
          <p className="text-gray-600">
            World's most comprehensive chat management setup - configure everything in minutes
          </p>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-6 py-6">
          {/* Setup Navigation */}
          <div className="space-y-2">
            {setupSteps.map((step) => {
              const Icon = step.icon;
              const isActive = setupStep === step.id;
              const isCompleted = setupSteps.findIndex(s => s.id === setupStep) > setupSteps.findIndex(s => s.id === step.id);
              
              return (
                <button
                  key={step.id}
                  onClick={() => setSetupStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600' 
                      : isCompleted
                      ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{step.title}</span>
                  {isCompleted && <Check className="w-4 h-4 ml-auto text-green-600" />}
                </button>
              );
            })}
          </div>

          {/* Setup Content */}
          <div className="col-span-3">
            <Tabs value={setupStep} onValueChange={setSetupStep}>
              {/* Channel Setup */}
              <TabsContent value="channels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(setupData.channels).map(([channel, config]) => (
                      <div key={channel} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={config.enabled}
                            onCheckedChange={(checked) => {
                              setSetupData(prev => ({
                                ...prev,
                                channels: {
                                  ...prev.channels,
                                  [channel]: { ...config, enabled: checked }
                                }
                              }));
                            }}
                          />
                          <div>
                            <h4 className="font-medium capitalize">{channel}</h4>
                            <p className="text-sm text-gray-600">
                              Max {config.maxChats} concurrent chats
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={config.priority === 'high' ? 'destructive' : 'outline'}>
                            {config.priority}
                          </Badge>
                          <Input 
                            type="number" 
                            value={config.maxChats}
                            onChange={(e) => {
                              setSetupData(prev => ({
                                ...prev,
                                channels: {
                                  ...prev.channels,
                                  [channel]: { ...config, maxChats: parseInt(e.target.value) }
                                }
                              }));
                            }}
                            className="w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Hours */}
              <TabsContent value="hours" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Business Hours</Label>
                      <Switch 
                        checked={setupData.businessHours.enabled}
                        onCheckedChange={(checked) => {
                          setSetupData(prev => ({
                            ...prev,
                            businessHours: { ...prev.businessHours, enabled: checked }
                          }));
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Timezone</Label>
                        <Select 
                          value={setupData.businessHours.timezone}
                          onValueChange={(value) => {
                            setSetupData(prev => ({
                              ...prev,
                              businessHours: { ...prev.businessHours, timezone: value }
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">EST</SelectItem>
                            <SelectItem value="PST">PST</SelectItem>
                            <SelectItem value="CST">CST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Weekdays</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input 
                            type="time" 
                            value={setupData.businessHours.weekdays.start}
                            onChange={(e) => {
                              setSetupData(prev => ({
                                ...prev,
                                businessHours: {
                                  ...prev.businessHours,
                                  weekdays: { ...prev.businessHours.weekdays, start: e.target.value }
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input 
                            type="time" 
                            value={setupData.businessHours.weekdays.end}
                            onChange={(e) => {
                              setSetupData(prev => ({
                                ...prev,
                                businessHours: {
                                  ...prev.businessHours,
                                  weekdays: { ...prev.businessHours.weekdays, end: e.target.value }
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Routing */}
              <TabsContent value="routing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chat Routing Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Routing Strategy</Label>
                      <Select 
                        value={setupData.routing.strategy}
                        onValueChange={(value) => {
                          setSetupData(prev => ({
                            ...prev,
                            routing: { ...prev.routing, strategy: value }
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round_robin">Round Robin</SelectItem>
                          <SelectItem value="least_busy">Least Busy</SelectItem>
                          <SelectItem value="skill_based">Skill Based</SelectItem>
                          <SelectItem value="random">Random</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Enable Fallback Routing</Label>
                        <Switch 
                          checked={setupData.routing.fallbackEnabled}
                          onCheckedChange={(checked) => {
                            setSetupData(prev => ({
                              ...prev,
                              routing: { ...prev.routing, fallbackEnabled: checked }
                            }));
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Priority-based Routing</Label>
                        <Switch 
                          checked={setupData.routing.priorityRouting}
                          onCheckedChange={(checked) => {
                            setSetupData(prev => ({
                              ...prev,
                              routing: { ...prev.routing, priorityRouting: checked }
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Automation */}
              <TabsContent value="automation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto Response</Label>
                      <Switch 
                        checked={setupData.automation.autoResponse}
                        onCheckedChange={(checked) => {
                          setSetupData(prev => ({
                            ...prev,
                            automation: { ...prev.automation, autoResponse: checked }
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <Label>Response Delay (seconds)</Label>
                      <Input 
                        type="number" 
                        value={setupData.automation.responseDelay}
                        onChange={(e) => {
                          setSetupData(prev => ({
                            ...prev,
                            automation: { ...prev.automation, responseDelay: parseInt(e.target.value) }
                          }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto Escalation</Label>
                      <Switch 
                        checked={setupData.automation.escalationEnabled}
                        onCheckedChange={(checked) => {
                          setSetupData(prev => ({
                            ...prev,
                            automation: { ...prev.automation, escalationEnabled: checked }
                          }));
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Agents */}
              <TabsContent value="agents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Max Concurrent Chats per Agent</Label>
                      <Input 
                        type="number" 
                        value={setupData.agents.maxConcurrentChats}
                        onChange={(e) => {
                          setSetupData(prev => ({
                            ...prev,
                            agents: { ...prev.agents, maxConcurrentChats: parseInt(e.target.value) }
                          }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto Assignment</Label>
                      <Switch 
                        checked={setupData.agents.autoAssignment}
                        onCheckedChange={(checked) => {
                          setSetupData(prev => ({
                            ...prev,
                            agents: { ...prev.agents, autoAssignment: checked }
                          }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Workload Balancing</Label>
                      <Switch 
                        checked={setupData.agents.workloadBalancing}
                        onCheckedChange={(checked) => {
                          setSetupData(prev => ({
                            ...prev,
                            agents: { ...prev.agents, workloadBalancing: checked }
                          }));
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Review */}
              <TabsContent value="review" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Setup Summary</h4>
                        <ul className="mt-2 space-y-1 text-sm text-green-700">
                          <li>✓ {Object.values(setupData.channels).filter(c => c.enabled).length} channels configured</li>
                          <li>✓ Business hours {setupData.businessHours.enabled ? 'enabled' : 'disabled'}</li>
                          <li>✓ {setupData.routing.strategy} routing strategy</li>
                          <li>✓ Automation {setupData.automation.autoResponse ? 'enabled' : 'disabled'}</li>
                          <li>✓ Agent settings configured</li>
                        </ul>
                      </div>
                      
                      <Button onClick={handleSetupComplete} className="w-full" size="lg">
                        Deploy Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline"
            onClick={() => {
              const currentIndex = setupSteps.findIndex(s => s.id === setupStep);
              if (currentIndex > 0) {
                setSetupStep(setupSteps[currentIndex - 1].id);
              }
            }}
            disabled={setupStep === 'channels'}
          >
            Previous
          </Button>
          
          <Button
            onClick={() => {
              const currentIndex = setupSteps.findIndex(s => s.id === setupStep);
              if (currentIndex < setupSteps.length - 1) {
                setSetupStep(setupSteps[currentIndex + 1].id);
              }
            }}
            disabled={setupStep === 'review'}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
