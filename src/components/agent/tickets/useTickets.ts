
import { useState, useEffect } from 'react';
import { Ticket, TicketPriority, TicketCategory, TicketStats } from './types';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    totalRaised: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
    resolutionRate: 0
  });
  const [loading, setLoading] = useState(false);

  // Mock data for priorities
  const priorities: TicketPriority[] = [
    { id: 'low', name: 'Low', level: 'low', color: 'bg-green-500' },
    { id: 'medium', name: 'Medium', level: 'medium', color: 'bg-yellow-500' },
    { id: 'high', name: 'High', level: 'high', color: 'bg-orange-500' },
    { id: 'critical', name: 'Critical', level: 'critical', color: 'bg-red-500' }
  ];

  // Mock data for categories
  const categories: TicketCategory[] = [
    { id: 'technical', name: 'Technical Support', description: 'Technical issues and bugs' },
    { id: 'billing', name: 'Billing & Payment', description: 'Payment and billing related issues' },
    { id: 'account', name: 'Account Management', description: 'Account settings and access issues' },
    { id: 'product', name: 'Product Inquiry', description: 'Product features and functionality' },
    { id: 'other', name: 'Other', description: 'General inquiries and other issues' }
  ];

  const createTicket = async (ticketData: any): Promise<Ticket> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ticketNumber = `TRI-${Date.now().toString().slice(-6)}`;
      
      const newTicket: Ticket = {
        id: Date.now().toString(),
        ticketNumber,
        chatId: ticketData.chatId,
        customerName: ticketData.customerName,
        customerEmail: ticketData.customerEmail,
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority,
        category: ticketData.category,
        status: 'open',
        createdBy: 'Current Agent', // This would come from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        crmIntegration: ticketData.crmIntegration,
        externalTicketId: `EXT-${Date.now()}`, // Simulated external ID
        tags: ticketData.tags,
        attachments: [] // File upload would be handled separately
      };

      setTickets(prev => [newTicket, ...prev]);
      updateStats();
      
      console.log('Ticket created:', newTicket);
      console.log('Sending to CRM:', ticketData.crmIntegration.name);
      
      return newTicket;
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status, 
            updatedAt: new Date().toISOString(),
            resolvedAt: status === 'resolved' ? new Date().toISOString() : ticket.resolvedAt
          }
        : ticket
    ));
    updateStats();
  };

  const updateStats = () => {
    const totalRaised = tickets.length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const pending = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolutionRate = totalRaised > 0 ? (resolved / totalRaised) * 100 : 0;

    setStats({
      totalRaised,
      resolved,
      pending,
      inProgress,
      resolutionRate: Math.round(resolutionRate)
    });
  };

  const getTicketsByStatus = (status: Ticket['status']) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getTicketsByChatId = (chatId: number) => {
    return tickets.filter(ticket => ticket.chatId === chatId);
  };

  useEffect(() => {
    updateStats();
  }, [tickets]);

  return {
    tickets,
    stats,
    loading,
    priorities,
    categories,
    createTicket,
    updateTicketStatus,
    getTicketsByStatus,
    getTicketsByChatId
  };
};
