
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScriptStats } from './code-editor/ScriptStats';
import { CreateScriptDialog } from './code-editor/CreateScriptDialog';
import { ScriptsList } from './code-editor/ScriptsList';
import { CustomScript, NewScript } from './code-editor/types';

export const CodeEditor = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [customScripts] = useState<CustomScript[]>([
    {
      id: '1',
      name: 'Customer Data Validator',
      description: 'Validates customer data on form submission',
      language: 'javascript',
      trigger: 'event',
      code: `function validateCustomer(data) {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  if (!data.phone || data.phone.length < 10) {
    throw new Error('Invalid phone number');
  }
  
  return { valid: true, data };
}`,
      status: 'active',
      lastRun: '2 hours ago',
      executions: 234,
      environment: 'production'
    },
    {
      id: '2',
      name: 'Daily Report Generator',
      description: 'Generates daily performance reports',
      language: 'python',
      trigger: 'scheduled',
      code: `import json
from datetime import datetime

def generate_daily_report():
    report = {
        'date': datetime.now().isoformat(),
        'total_tickets': get_ticket_count(),
        'resolved_tickets': get_resolved_count(),
        'satisfaction_score': calculate_csat()
    }
    
    return json.dumps(report, indent=2)`,
      status: 'active',
      lastRun: '1 day ago',
      executions: 45,
      environment: 'production'
    },
    {
      id: '3',
      name: 'Webhook Data Processor',
      description: 'Processes incoming webhook data from external systems',
      language: 'typescript',
      trigger: 'webhook',
      code: `interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
}

export async function processWebhook(payload: WebhookPayload) {
  console.log('Processing webhook:', payload.event);
  
  switch (payload.event) {
    case 'customer.created':
      await handleNewCustomer(payload.data);
      break;
    case 'ticket.updated':
      await handleTicketUpdate(payload.data);
      break;
    default:
      console.warn('Unknown event type:', payload.event);
  }
}`,
      status: 'testing',
      lastRun: '30 minutes ago',
      executions: 12,
      environment: 'sandbox'
    }
  ]);

  const handleCreateScript = (newScript: NewScript) => {
    toast({
      title: "Script Created",
      description: `${newScript.name} has been created successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Code Editor & Script Management</h2>
          <p className="text-gray-600">Create and manage custom scripts for advanced automation</p>
        </div>
        <div className="flex gap-2">
          <CreateScriptDialog 
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onCreateScript={handleCreateScript}
          />
        </div>
      </div>

      <ScriptStats scripts={customScripts} />
      <ScriptsList scripts={customScripts} />
    </div>
  );
};
