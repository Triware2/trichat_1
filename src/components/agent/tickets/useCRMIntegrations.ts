
import { useState, useEffect } from 'react';
import { CRMIntegration } from './types';

export const useCRMIntegrations = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);

  useEffect(() => {
    // Mock CRM integrations - in real app this would come from admin settings
    const mockIntegrations: CRMIntegration[] = [
      {
        id: 'salesforce-1',
        name: 'Salesforce Production',
        type: 'salesforce',
        isActive: true,
        apiEndpoint: 'https://api.salesforce.com',
        credentials: {
          token: 'sf_token_***'
        }
      },
      {
        id: 'hubspot-1',
        name: 'HubSpot Main',
        type: 'hubspot',
        isActive: true,
        apiEndpoint: 'https://api.hubapi.com',
        credentials: {
          apiKey: 'hs_key_***'
        }
      },
      {
        id: 'freshdesk-1',
        name: 'Freshdesk Support',
        type: 'freshdesk',
        isActive: true,
        apiEndpoint: 'https://company.freshdesk.com',
        credentials: {
          apiKey: 'fd_key_***',
          domain: 'company'
        }
      },
      {
        id: 'zendesk-1',
        name: 'Zendesk Help Desk',
        type: 'zendesk',
        isActive: false, // Inactive for demo
        apiEndpoint: 'https://company.zendesk.com',
        credentials: {
          token: 'zd_token_***'
        }
      }
    ];

    setIntegrations(mockIntegrations);
  }, []);

  const getActiveIntegrations = () => {
    return integrations.filter(integration => integration.isActive);
  };

  const getIntegrationByType = (type: CRMIntegration['type']) => {
    return integrations.filter(integration => integration.type === type);
  };

  const sendTicketToCRM = async (ticket: any, integration: CRMIntegration) => {
    // This would handle the actual API calls to different CRM systems
    console.log(`Sending ticket to ${integration.name}:`, ticket);
    
    // Mock API call based on CRM type
    switch (integration.type) {
      case 'salesforce':
        return await sendToSalesforce(ticket, integration);
      case 'hubspot':
        return await sendToHubSpot(ticket, integration);
      case 'freshdesk':
        return await sendToFreshdesk(ticket, integration);
      case 'zendesk':
        return await sendToZendesk(ticket, integration);
      default:
        throw new Error(`Unsupported CRM type: ${integration.type}`);
    }
  };

  // Mock CRM-specific functions
  const sendToSalesforce = async (ticket: any, integration: CRMIntegration) => {
    // Salesforce Case creation logic
    const caseData = {
      Subject: ticket.subject,
      Description: ticket.description,
      Priority: ticket.priority.name,
      Origin: 'Chat',
      ContactEmail: ticket.customerEmail
    };
    
    console.log('Salesforce Case Data:', caseData);
    return { externalId: `SF-${Date.now()}`, success: true };
  };

  const sendToHubSpot = async (ticket: any, integration: CRMIntegration) => {
    // HubSpot Ticket creation logic
    const ticketData = {
      properties: {
        subject: ticket.subject,
        content: ticket.description,
        hs_pipeline_stage: 'open',
        priority: ticket.priority.level
      }
    };
    
    console.log('HubSpot Ticket Data:', ticketData);
    return { externalId: `HS-${Date.now()}`, success: true };
  };

  const sendToFreshdesk = async (ticket: any, integration: CRMIntegration) => {
    // Freshdesk Ticket creation logic
    const ticketData = {
      subject: ticket.subject,
      description: ticket.description,
      email: ticket.customerEmail,
      priority: getPriorityMapping(ticket.priority.level, 'freshdesk'),
      status: 2 // Open
    };
    
    console.log('Freshdesk Ticket Data:', ticketData);
    return { externalId: `FD-${Date.now()}`, success: true };
  };

  const sendToZendesk = async (ticket: any, integration: CRMIntegration) => {
    // Zendesk Ticket creation logic
    const ticketData = {
      ticket: {
        subject: ticket.subject,
        comment: {
          body: ticket.description
        },
        priority: getPriorityMapping(ticket.priority.level, 'zendesk'),
        requester: {
          name: ticket.customerName,
          email: ticket.customerEmail
        }
      }
    };
    
    console.log('Zendesk Ticket Data:', ticketData);
    return { externalId: `ZD-${Date.now()}`, success: true };
  };

  const getPriorityMapping = (level: string, crmType: string) => {
    const mappings: Record<string, Record<string, any>> = {
      freshdesk: {
        low: 1,
        medium: 2,
        high: 3,
        critical: 4
      },
      zendesk: {
        low: 'low',
        medium: 'normal',
        high: 'high',
        critical: 'urgent'
      }
    };

    return mappings[crmType]?.[level] || 'normal';
  };

  return {
    integrations,
    getActiveIntegrations,
    getIntegrationByType,
    sendTicketToCRM
  };
};
