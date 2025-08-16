import { supabase } from '@/integrations/supabase/client';
import { WidgetConfig, IntegrationType } from '@/components/admin/widget/types';

export interface WidgetInstance {
  id: string;
  name: string;
  integrationType: IntegrationType;
  config: WidgetConfig;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  userId: string;
  shareUrl?: string;
  analytics?: {
    totalConversations: number;
    totalMessages: number;
    averageResponseTime: number;
    satisfactionScore: number;
  };
}

export interface WidgetCodeTemplate {
  integrationType: IntegrationType;
  template: string;
  variables: string[];
}

class WidgetService {
  // Save widget configuration
  async saveWidgetConfiguration(config: WidgetConfig & { integrationType: IntegrationType; updatedAt: string }): Promise<WidgetInstance> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const widgetData = {
        name: config.title || 'Untitled Widget',
        integration_type: config.integrationType,
        config: config,
        status: 'draft',
        user_id: user.id,
        updated_at: config.updatedAt
      };

      // If widget already exists, update it
      if (config.id) {
        const { data, error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', config.id)
          .select()
          .single();

        if (error) throw error;
        return this.mapToWidgetInstance(data);
      }

      // Create new widget
      const { data, error } = await supabase
        .from('widgets')
        .insert([widgetData])
        .select()
        .single();

      if (error) throw error;
      return this.mapToWidgetInstance(data);
    } catch (error) {
      console.error('Error saving widget configuration:', error);
      throw error;
    }
  }

  // Get widget configuration
  async getWidgetConfiguration(): Promise<WidgetConfig | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;
      return data.config;
    } catch (error) {
      console.error('Error getting widget configuration:', error);
      return null;
    }
  }

  // Generate widget code
  async generateWidgetCode(integrationType: IntegrationType, config: WidgetConfig): Promise<string> {
    const configData = {
      widgetId: config.id || 'default',
      title: config.title,
      subtitle: config.subtitle,
      primaryColor: config.primaryColor,
      position: config.position,
      welcomeMessage: config.welcomeMessage,
      placeholder: config.placeholder,
      showAvatar: config.showAvatar,
      autoOpen: config.autoOpen,
      department: config.department,
      buttonText: config.buttonText,
      buttonSelector: config.buttonSelector,
      allowFileUpload: config.allowFileUpload,
      showTypingIndicator: config.showTypingIndicator,
      enableRating: config.enableRating,
      maxFileSize: config.maxFileSize,
      allowedFileTypes: config.allowedFileTypes,
      language: config.language,
      timezone: config.timezone,
      workingHours: config.workingHours,
      autoResponders: config.autoResponders,
      branding: config.branding,
      appearance: config.appearance,
      behavior: config.behavior,
      customCSS: config.customCSS
    };

    const baseUrl = window.location.origin;
    const apiKey = 'YOUR_API_KEY_HERE'; // This should be replaced with actual API key

    switch (integrationType) {
      case 'widget':
        return `<!-- TriChat Floating Widget Integration -->
<script>
(function() {
  window.TriChatConfig = ${JSON.stringify(configData, null, 2)};
  
  // Load TriChat widget script
  var script = document.createElement('script');
  script.src = '${baseUrl}/widget.js';
  script.async = true;
  script.onload = function() {
    console.log('TriChat widget loaded successfully');
  };
  script.onerror = function() {
    console.error('Failed to load TriChat widget');
  };
  document.head.appendChild(script);
})();
</script>

<!-- Optional: Custom CSS -->
<style>
.trichat-widget {
  --primary-color: ${configData.primaryColor};
  --widget-position: ${configData.position};
  ${configData.customCSS || ''}
}
</style>`;

      case 'button':
        return `<!-- TriChat Button Integration -->
<script>
(function() {
  window.TriChatConfig = {
    ...${JSON.stringify(configData, null, 2)},
    mode: 'button',
    buttonSelector: '${configData.buttonSelector}'
  };
  
  // Load TriChat script
  var script = document.createElement('script');
  script.src = '${baseUrl}/widget.js';
  script.async = true;
  script.onload = function() {
    TriChat.initButtonMode('${configData.buttonSelector}');
  };
  document.head.appendChild(script);
})();
</script>

<!-- Add this to your existing help button or create a new one -->
<button id="help-button" class="trichat-trigger">
  ${configData.buttonText}
</button>

<!-- Optional: Custom CSS -->
<style>
.trichat-modal {
  --primary-color: ${configData.primaryColor};
}

.trichat-trigger {
  background-color: ${configData.primaryColor};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.trichat-trigger:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>`;

      case 'inline':
        return `<!-- TriChat Inline Widget Integration -->
<div id="trichat-inline-${configData.widgetId}" class="trichat-inline-widget"></div>

<script>
(function() {
  window.TriChatConfig = {
    ...${JSON.stringify(configData, null, 2)},
    mode: 'inline',
    containerId: 'trichat-inline-${configData.widgetId}'
  };
  
  var script = document.createElement('script');
  script.src = '${baseUrl}/inline-widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>

<!-- Optional: Custom CSS -->
<style>
.trichat-inline-widget {
  width: 100%;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  ${configData.customCSS || ''}
}
</style>`;

      case 'api':
        return `// TriChat REST API Integration
const TRICHAT_API_BASE = '${baseUrl}/api/v1';
const TRICHAT_API_KEY = '${apiKey}';

// Initialize chat session
async function initChatSession(customerData) {
  const response = await fetch(\`\${TRICHAT_API_BASE}/sessions\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TRICHAT_API_KEY}\`
    },
    body: JSON.stringify({
      widgetId: '${configData.widgetId}',
      customer: customerData,
      department: '${configData.department}',
      language: '${configData.language}',
      timezone: '${configData.timezone}'
    })
  });
  return response.json();
}

// Send message
async function sendMessage(sessionId, message, attachments = []) {
  const response = await fetch(\`\${TRICHAT_API_BASE}/sessions/\${sessionId}/messages\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TRICHAT_API_KEY}\`
    },
    body: JSON.stringify({
      message,
      attachments,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
}

// Get messages
async function getMessages(sessionId, limit = 50) {
  const response = await fetch(\`\${TRICHAT_API_BASE}/sessions/\${sessionId}/messages?limit=\${limit}\`, {
    headers: {
      'Authorization': \`Bearer \${TRICHAT_API_KEY}\`
    }
  });
  return response.json();
}

// Subscribe to real-time updates
function subscribeToUpdates(sessionId, onMessage, onStatusChange) {
  const eventSource = new EventSource(\`\${TRICHAT_API_BASE}/sessions/\${sessionId}/stream\`);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      onMessage(data.message);
    } else if (data.type === 'status') {
      onStatusChange(data.status);
    }
  };
  
  return eventSource;
}

// Example usage
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize session when page loads
  const session = await initChatSession({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Subscribe to real-time updates
  const eventSource = subscribeToUpdates(
    session.id,
    (message) => console.log('New message:', message),
    (status) => console.log('Status changed:', status)
  );
});`;

      case 'webhook':
        return `// TriChat Webhook Configuration
const WEBHOOK_URL = '${configData.webhookUrl || 'https://your-domain.com/webhook/trichat'}';
const WEBHOOK_SECRET = 'your-webhook-secret-here';

// Webhook endpoint to receive TriChat events
app.post('/webhook/trichat', (req, res) => {
  const signature = req.headers['x-trichat-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(signature, payload, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = payload.event;
  
  switch (event.type) {
    case 'message.received':
      handleMessageReceived(event.data);
      break;
    case 'session.started':
      handleSessionStarted(event.data);
      break;
    case 'session.ended':
      handleSessionEnded(event.data);
      break;
    case 'customer.typing':
      handleCustomerTyping(event.data);
      break;
    case 'agent.assigned':
      handleAgentAssigned(event.data);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
  
  res.status(200).json({ received: true });
});

function verifyWebhookSignature(signature, payload, secret) {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expectedSignature;
}

function handleMessageReceived(data) {
  console.log('New message received:', data);
  // Implement your message handling logic
  // Example: Send notification, update database, trigger workflow
}

function handleSessionStarted(data) {
  console.log('Chat session started:', data);
  // Implement your session start logic
  // Example: Create ticket, assign agent, send welcome email
}

function handleSessionEnded(data) {
  console.log('Chat session ended:', data);
  // Implement your session end logic
  // Example: Close ticket, send survey, update analytics
}

function handleCustomerTyping(data) {
  console.log('Customer is typing:', data);
  // Implement your typing indicator logic
  // Example: Update UI, notify agents
}

function handleAgentAssigned(data) {
  console.log('Agent assigned:', data);
  // Implement your agent assignment logic
  // Example: Send notification, update status
}`;

      case 'react-component':
        return `// TriChat React Component Integration
import React, { useState, useEffect } from 'react';
import { TriChatWidget } from '@trichat/react';

interface TriChatProps {
  customer?: {
    name?: string;
    email?: string;
    id?: string;
  };
  onMessage?: (message: any) => void;
  onSessionStart?: (session: any) => void;
  onSessionEnd?: (session: any) => void;
}

export const TriChatComponent: React.FC<TriChatProps> = ({
  customer,
  onMessage,
  onSessionStart,
  onSessionEnd
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const config = ${JSON.stringify(configData, null, 2)};

  return (
    <TriChatWidget
      config={config}
      customer={customer}
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      onMessage={onMessage}
      onSessionStart={(session) => {
        setSessionId(session.id);
        onSessionStart?.(session);
      }}
      onSessionEnd={onSessionEnd}
    />
  );
};

// Usage in your app
function App() {
  const handleMessage = (message) => {
    console.log('New message:', message);
  };

  const handleSessionStart = (session) => {
    console.log('Session started:', session);
  };

  return (
    <div>
      <h1>My App</h1>
      <TriChatComponent
        customer={{
          name: 'John Doe',
          email: 'john@example.com'
        }}
        onMessage={handleMessage}
        onSessionStart={handleSessionStart}
      />
    </div>
  );
}`;

      default:
        return `// Integration code for ${integrationType} will be generated here
// This integration type requires manual setup or platform-specific instructions

// Configuration:
${JSON.stringify(configData, null, 2)}

// For platform integrations like WordPress, Shopify, etc.,
// please refer to the Setup Instructions tab for detailed installation steps.`;
    }
  }

  // Generate share URL
  async generateShareUrl(widgetId: string): Promise<string> {
    const baseUrl = window.location.origin;
    return `${baseUrl}/widget/${widgetId}`;
  }

  // Get all widgets for user
  async getUserWidgets(): Promise<WidgetInstance[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(this.mapToWidgetInstance);
    } catch (error) {
      console.error('Error getting user widgets:', error);
      return [];
    }
  }

  // Delete widget
  async deleteWidget(widgetId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', widgetId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting widget:', error);
      throw error;
    }
  }

  // Update widget status
  async updateWidgetStatus(widgetId: string, status: 'active' | 'inactive' | 'draft'): Promise<void> {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', widgetId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating widget status:', error);
      throw error;
    }
  }

  // Get widget analytics
  async getWidgetAnalytics(widgetId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('get_widget_analytics', { widget_id: widgetId });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting widget analytics:', error);
      return null;
    }
  }

  // Private methods
  private mapToWidgetInstance(data: any): WidgetInstance {
    return {
      id: data.id,
      name: data.name,
      integrationType: data.integration_type,
      config: data.config,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      shareUrl: data.share_url,
      analytics: data.analytics
    };
  }

  private getCodeTemplates(): WidgetCodeTemplate[] {
    return [
      {
        integrationType: 'widget',
        template: `
// TriChat Floating Widget
(function() {
  window.TriChatConfig = {
    widgetId: '{{widgetId}}',
    title: '{{title}}',
    subtitle: '{{subtitle}}',
    primaryColor: '{{primaryColor}}',
    position: '{{position}}',
    welcomeMessage: '{{welcomeMessage}}',
    placeholder: '{{placeholder}}',
    showAvatar: {{showAvatar}},
    autoOpen: {{autoOpen}},
    department: '{{department}}',
    allowFileUpload: {{allowFileUpload}},
    showTypingIndicator: {{showTypingIndicator}},
    enableRating: {{enableRating}},
    maxFileSize: {{maxFileSize}},
    allowedFileTypes: {{allowedFileTypes}},
    language: '{{language}}',
    timezone: '{{timezone}}',
    workingHours: {{workingHours}},
    autoResponders: {{autoResponders}},
    branding: {{branding}}
  };
  
  var script = document.createElement('script');
  script.src = '{{baseUrl}}/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
        `,
        variables: ['widgetId', 'title', 'subtitle', 'primaryColor', 'position', 'welcomeMessage', 'placeholder', 'showAvatar', 'autoOpen', 'department', 'allowFileUpload', 'showTypingIndicator', 'enableRating', 'maxFileSize', 'allowedFileTypes', 'language', 'timezone', 'workingHours', 'autoResponders', 'branding', 'baseUrl']
      },
      {
        integrationType: 'button',
        template: `
// TriChat Button Trigger
(function() {
  window.TriChatConfig = {
    widgetId: '{{widgetId}}',
    buttonText: '{{buttonText}}',
    buttonSelector: '{{buttonSelector}}',
    title: '{{title}}',
    subtitle: '{{subtitle}}',
    primaryColor: '{{primaryColor}}',
    welcomeMessage: '{{welcomeMessage}}',
    placeholder: '{{placeholder}}',
    showAvatar: {{showAvatar}},
    department: '{{department}}',
    allowFileUpload: {{allowFileUpload}},
    showTypingIndicator: {{showTypingIndicator}},
    enableRating: {{enableRating}},
    maxFileSize: {{maxFileSize}},
    allowedFileTypes: {{allowedFileTypes}},
    language: '{{language}}',
    timezone: '{{timezone}}',
    workingHours: {{workingHours}},
    autoResponders: {{autoResponders}},
    branding: {{branding}}
  };
  
  var script = document.createElement('script');
  script.src = '{{baseUrl}}/button-widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
        `,
        variables: ['widgetId', 'buttonText', 'buttonSelector', 'title', 'subtitle', 'primaryColor', 'welcomeMessage', 'placeholder', 'showAvatar', 'department', 'allowFileUpload', 'showTypingIndicator', 'enableRating', 'maxFileSize', 'allowedFileTypes', 'language', 'timezone', 'workingHours', 'autoResponders', 'branding', 'baseUrl']
      },
      {
        integrationType: 'inline',
        template: `
// TriChat Inline Widget
<div id="trichat-inline-{{widgetId}}" class="trichat-inline-widget"></div>
<script>
window.TriChatConfig = {
  widgetId: '{{widgetId}}',
  containerId: 'trichat-inline-{{widgetId}}',
  title: '{{title}}',
  subtitle: '{{subtitle}}',
  primaryColor: '{{primaryColor}}',
  welcomeMessage: '{{welcomeMessage}}',
  placeholder: '{{placeholder}}',
  showAvatar: {{showAvatar}},
  department: '{{department}}',
  allowFileUpload: {{allowFileUpload}},
  showTypingIndicator: {{showTypingIndicator}},
  enableRating: {{enableRating}},
  maxFileSize: {{maxFileSize}},
  allowedFileTypes: {{allowedFileTypes}},
  language: '{{language}}',
  timezone: '{{timezone}}',
  workingHours: {{workingHours}},
  autoResponders: {{autoResponders}},
  branding: {{branding}}
};

var script = document.createElement('script');
script.src = '{{baseUrl}}/inline-widget.js';
script.async = true;
document.head.appendChild(script);
</script>
        `,
        variables: ['widgetId', 'title', 'subtitle', 'primaryColor', 'welcomeMessage', 'placeholder', 'showAvatar', 'department', 'allowFileUpload', 'showTypingIndicator', 'enableRating', 'maxFileSize', 'allowedFileTypes', 'language', 'timezone', 'workingHours', 'autoResponders', 'branding', 'baseUrl']
      },
      {
        integrationType: 'api',
        template: `
// TriChat REST API Integration
const TRICHAT_API_BASE = '{{baseUrl}}/api/v1';
const TRICHAT_API_KEY = '{{apiKey}}';

// Initialize chat session
async function initChatSession(customerData) {
  const response = await fetch(\`\${TRICHAT_API_BASE}/sessions\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TRICHAT_API_BASE}\`
    },
    body: JSON.stringify({
      widgetId: '{{widgetId}}',
      customer: customerData,
      department: '{{department}}',
      language: '{{language}}',
      timezone: '{{timezone}}'
    })
  });
  return response.json();
}

// Send message
async function sendMessage(sessionId, message, attachments = []) {
  const response = await fetch(\`\${TRICHAT_API_BASE}/sessions/\${sessionId}/messages\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${TRICHAT_API_BASE}\`
    },
    body: JSON.stringify({
      message,
      attachments,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
}

// Get messages
async function getMessages(sessionId, limit = 50) {
  const response = await fetch(\`\${TRICHAT_API_BASE}/sessions/\${sessionId}/messages?limit=\${limit}\`, {
    headers: {
      'Authorization': \`Bearer \${TRICHAT_API_BASE}\`
    }
  });
  return response.json();
}

// Subscribe to real-time updates
function subscribeToUpdates(sessionId, onMessage, onStatusChange) {
  const eventSource = new EventSource(\`\${TRICHAT_API_BASE}/sessions/\${sessionId}/stream\`);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      onMessage(data.message);
    } else if (data.type === 'status') {
      onStatusChange(data.status);
    }
  };
  
  return eventSource;
}
        `,
        variables: ['baseUrl', 'apiKey', 'widgetId', 'department', 'language', 'timezone']
      },
      {
        integrationType: 'webhook',
        template: `
// TriChat Webhook Configuration
const WEBHOOK_URL = '{{webhookUrl}}';
const WEBHOOK_SECRET = '{{webhookSecret}}';

// Webhook endpoint to receive TriChat events
app.post('/webhook/trichat', (req, res) => {
  const signature = req.headers['x-trichat-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(signature, payload, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = payload.event;
  
  switch (event.type) {
    case 'message.received':
      handleMessageReceived(event.data);
      break;
    case 'session.started':
      handleSessionStarted(event.data);
      break;
    case 'session.ended':
      handleSessionEnded(event.data);
      break;
    case 'customer.typing':
      handleCustomerTyping(event.data);
      break;
    case 'agent.assigned':
      handleAgentAssigned(event.data);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
  
  res.status(200).json({ received: true });
});

function verifyWebhookSignature(signature, payload, secret) {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expectedSignature;
}

function handleMessageReceived(data) {
  console.log('New message received:', data);
  // Implement your message handling logic
}

function handleSessionStarted(data) {
  console.log('Chat session started:', data);
  // Implement your session start logic
}

function handleSessionEnded(data) {
  console.log('Chat session ended:', data);
  // Implement your session end logic
}

function handleCustomerTyping(data) {
  console.log('Customer is typing:', data);
  // Implement your typing indicator logic
}

function handleAgentAssigned(data) {
  console.log('Agent assigned:', data);
  // Implement your agent assignment logic
}
        `,
        variables: ['webhookUrl', 'webhookSecret']
      }
    ];
  }

  private processTemplate(template: string, config: WidgetConfig): string {
    let processedTemplate = template;
    
    // Replace all variables in the template
    const variables = {
      widgetId: config.id || 'default',
      title: config.title,
      subtitle: config.subtitle,
      primaryColor: config.primaryColor,
      position: config.position,
      welcomeMessage: config.welcomeMessage,
      placeholder: config.placeholder,
      showAvatar: config.showAvatar,
      autoOpen: config.autoOpen,
      department: config.department,
      buttonText: config.buttonText,
      buttonSelector: config.buttonSelector,
      allowFileUpload: config.allowFileUpload,
      showTypingIndicator: config.showTypingIndicator,
      enableRating: config.enableRating,
      maxFileSize: config.maxFileSize,
      allowedFileTypes: JSON.stringify(config.allowedFileTypes),
      language: config.language,
      timezone: config.timezone,
      workingHours: JSON.stringify(config.workingHours),
      autoResponders: JSON.stringify(config.autoResponders),
      branding: JSON.stringify(config.branding),
      baseUrl: window.location.origin,
      apiKey: 'your-api-key-here',
      webhookUrl: config.webhookUrl || 'https://your-domain.com/webhook/trichat',
      webhookSecret: 'your-webhook-secret-here'
    };

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return processedTemplate.trim();
  }
}

export const widgetService = new WidgetService(); 