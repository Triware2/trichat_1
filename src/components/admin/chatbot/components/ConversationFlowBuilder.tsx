
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowDown, Edit, Trash2, Save } from 'lucide-react';

interface FlowStep {
  id: string;
  type: 'message' | 'question' | 'action' | 'condition';
  content: string;
  nextStep?: string;
}

interface ConversationFlow {
  id: string;
  name: string;
  trigger: string;
  steps: FlowStep[];
  isActive: boolean;
}

export const ConversationFlowBuilder = () => {
  const [flows, setFlows] = useState<ConversationFlow[]>([
    {
      id: '1',
      name: 'Order Status Flow',
      trigger: 'order_status',
      isActive: true,
      steps: [
        { id: '1', type: 'message', content: 'I can help you check your order status.', nextStep: '2' },
        { id: '2', type: 'question', content: 'Please provide your order number:', nextStep: '3' },
        { id: '3', type: 'action', content: 'Looking up order...', nextStep: '4' }
      ]
    }
  ]);

  const [newFlow, setNewFlow] = useState<Partial<ConversationFlow>>({
    name: '',
    trigger: '',
    steps: [],
    isActive: true
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFlow = () => {
    if (newFlow.name && newFlow.trigger) {
      const flow: ConversationFlow = {
        id: Date.now().toString(),
        name: newFlow.name,
        trigger: newFlow.trigger,
        steps: [],
        isActive: true
      };
      setFlows([...flows, flow]);
      setNewFlow({ name: '', trigger: '', steps: [], isActive: true });
      setIsCreating(false);
    }
  };

  const addStepToFlow = (flowId: string) => {
    const newStep: FlowStep = {
      id: Date.now().toString(),
      type: 'message',
      content: 'New step content'
    };

    setFlows(flows.map(flow => 
      flow.id === flowId 
        ? { ...flow, steps: [...flow.steps, newStep] }
        : flow
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Conversation Flows</h3>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Flow
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="flow-name">Flow Name</Label>
              <Input
                id="flow-name"
                value={newFlow.name}
                onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
                placeholder="Order Status Flow"
              />
            </div>
            <div>
              <Label htmlFor="flow-trigger">Trigger Intent</Label>
              <Input
                id="flow-trigger"
                value={newFlow.trigger}
                onChange={(e) => setNewFlow({ ...newFlow, trigger: e.target.value })}
                placeholder="order_status"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateFlow} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Create Flow
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {flows.map(flow => (
        <Card key={flow.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{flow.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={flow.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {flow.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => addStepToFlow(flow.id)}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add Step
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{step.type}</Badge>
                    </div>
                    <p className="text-sm">{step.content}</p>
                  </div>
                  {index < flow.steps.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
              {flow.steps.length === 0 && (
                <p className="text-center text-gray-500 py-4">No steps added yet. Click "Add Step" to start building your flow.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
