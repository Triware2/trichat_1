import { ChatInterface } from '@/components/agent/ChatInterface';
import { ContactPropertiesPanel } from '@/components/agent/ContactPropertiesPanel';
import { CustomerComplaintsPreview } from '@/components/agent/CustomerComplaintsPreview';
import { ChatMessage } from '@/components/admin/chatbot/types';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MessageSquare, UserCircle, User, AlertTriangle } from 'lucide-react';
import { ChatList } from '@/components/agent/ChatList';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CustomerComplaint } from '@/components/agent/complaints/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChatContentProps {
  chats: any[]; // A list of all chats for the list
  chat: { // The currently selected chat
    id: string;
    customer_id: string;
    customer: string;
    subject: string;
    // other chat properties can be added here
  } | null;
  onSendMessage: (message: string) => void;
  agentName: string;
  onChatSelect: (chatId: string) => void;
  onSubjectUpdated?: (chatId: string, newSubject: string) => void;
}

export const ChatContent = ({ 
  chats,
  chat,
  onSendMessage,
  agentName,
  onChatSelect,
  onSubjectUpdated
}: ChatContentProps) => {
  const navigate = useNavigate();
  const { open: sidebarOpen } = useSidebar();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectError, setSubjectError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerComplaints = async () => {
      if (!chat?.customer_id) {
        setLoadingComplaints(false);
        return;
      }
      setLoadingComplaints(true);

      try {
        const { data: complaintsData, error: complaintsError } = await supabase
          .from('chats')
          .select('*')
          .eq('customer_id', chat.customer_id)
          .eq('metadata->>issueType', 'Complaint') 
          .order('created_at', { ascending: false });

        if (complaintsError) throw complaintsError;

        if (complaintsData) {
          const formattedComplaints: CustomerComplaint[] = complaintsData.map((c: any) => ({
            id: c.id,
            date: new Date(c.created_at).toLocaleDateString(),
            subject: (c.metadata as any)?.subject || 'No Subject',
            category: (c.metadata as any)?.category || 'General',
            status: c.status as 'open' | 'resolved' | 'pending',
            priority: c.priority as 'high' | 'medium' | 'low',
            lastUpdate: new Date(c.updated_at).toLocaleDateString(),
          }));
          setComplaints(formattedComplaints);
        } else {
          setComplaints([]);
        }
      } catch (error) {
        console.error("Error fetching customer complaints:", error);
        setComplaints([]);
      } finally {
        setLoadingComplaints(false);
      }
    };

    fetchCustomerComplaints();
  }, [chat?.customer_id]);

  const handleViewCustomerProfile = () => {
    if (chat) {
      navigate(`/agent/customer-360?customerId=${chat.customer_id}`);
    }
  };

  const selectedChatId = chat ? chat.id : null;

  // Determine if this is the mock user
  const isMockUser = chat?.customer === 'Elena Rodriguez (Mock)' || chat?.customer === 'Elena Rodriguez';

  // Mock bot conversation history for the mock user
  const mockBotHistory: ChatMessage[] = [
    {
      id: 1001,
      sender: 'bot',
      message: "Hello! I'm here to help you with your questions. How can I assist you today?",
      time: '10:25 AM',
      type: 'text',
      confidence: 1.0
    },
    {
      id: 1002,
      sender: 'customer',
      message: "Hi, I need help with my order",
      time: '10:26 AM',
      type: 'text'
    },
    {
      id: 1003,
      sender: 'bot',
      message: "I can help you track your order. Could you please provide your order number?",
      time: '10:26 AM',
      type: 'text',
      confidence: 0.9,
      intent: 'order_tracking'
    },
    {
      id: 1004,
      sender: 'customer',
      message: "Actually, I want to talk to a human agent",
      time: '10:27 AM',
      type: 'text'
    },
    {
      id: 1005,
      sender: 'bot',
      message: "I'll connect you with one of our agents right away. Please wait a moment.",
      time: '10:27 AM',
      type: 'escalation',
      escalation_reason: 'manual'
    }
  ];

  // State for real bot conversation history
  const [realBotHistory, setRealBotHistory] = useState<ChatMessage[]>([]);
  useEffect(() => {
    const fetchBotHistory = async () => {
      if (!isMockUser && chat?.id) {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chat.id)
          .in('sender_type', ['bot', 'customer'])
          .order('created_at', { ascending: true });
        if (error) {
          setRealBotHistory([]);
          return;
        }
        if (data) {
          const mapped = data.map((msg) => ({
            id: typeof msg.id === 'number' ? msg.id : Number(msg.id) || Date.now(),
            sender: msg.sender_type === 'bot' ? 'bot' : 'customer',
            message: msg.content,
            time: msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            type: (msg.message_type as 'text' | 'file' | 'image' | 'escalation') || 'text',
            confidence: msg.metadata?.confidence,
            intent: msg.metadata?.intent,
            bot_response_id: msg.metadata?.bot_response_id,
            escalation_reason: msg.metadata?.escalation_reason,
          })) as ChatMessage[];
          setRealBotHistory(mapped);
        } else {
          setRealBotHistory([]);
        }
      } else {
        setRealBotHistory([]);
      }
    };
    fetchBotHistory();
  }, [chat?.id, isMockUser]);

  // Choose which history to show
  const botConversationHistory = isMockUser ? mockBotHistory : realBotHistory;

  const handleSubjectChange = async (newSubject: string) => {
    if (!chat?.id) return;
    setSubjectLoading(true);
    setSubjectError(null);
    const { error } = await supabase
      .from('chats')
      .update({ subject: newSubject })
      .eq('id', chat.id);
    setSubjectLoading(false);
    if (error) {
      setSubjectError(error.message || 'Failed to update subject');
      throw new Error(error.message || 'Failed to update subject');
    }
    // Update local chat object (shallow copy)
    if (chat) {
      chat.subject = newSubject;
    }
    if (typeof onSubjectUpdated === 'function') {
      onSubjectUpdated(chat.id, newSubject);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-100">
      {/* Left Panel: Conditionally rendered */}
      {!sidebarOpen && (
        <div className="w-64 flex-shrink-0 h-full flex flex-col bg-transparent p-2">
          <Card className="h-full flex flex-col shadow-md border-slate-200 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto min-h-0">
                <ChatList
                  chats={chats}
                  selectedChat={selectedChatId}
                  onChatSelect={onChatSelect}
                  onFilter={() => setFilterModalOpen(true)}
                  statusFilter={statusFilter}
                  priorityFilter={priorityFilter}
                />
              </div>
            </CardContent>
          </Card>
          {/* Filter Modal */}
          <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>Filter Conversations</DialogTitle>
              </DialogHeader>
              <div className="py-2 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button className="w-full bg-slate-100 text-slate-700 rounded px-4 py-2 text-sm font-medium hover:bg-slate-200" onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); }}>Reset Filters</button>
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white rounded px-4 py-2" onClick={() => setFilterModalOpen(false)}>Close</button>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Middle Panel: Flexible width, component handles scroll */}
      <div className="flex-1 h-full flex flex-col bg-white min-w-0">
        {chat ? (
          <ChatInterface
            customerName={chat.customer || 'Select a conversation'}
            customerStatus="Online"
            selectedChatId={selectedChatId}
            onSendMessage={onSendMessage}
            botConversationHistory={botConversationHistory}
            agentName={agentName}
            subject={chat.subject}
            onSubjectChange={handleSubjectChange}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white p-4">
            <div className="text-center text-slate-500">
              <MessageSquare className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="font-bold text-xl text-slate-700">No Chat Selected</h3>
              <p className="mt-2 max-w-sm mx-auto">
                Please select a conversation from the list to view it here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Fixed width, explicit scroll */}
      <div className="w-80 flex-shrink-0 h-full flex flex-col bg-slate-50">
        {chat ? (
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            <Card className="w-full max-w-full border-slate-200 shadow-md rounded-2xl overflow-x-auto px-0 dark:bg-slate-900">
              <ContactPropertiesPanel 
                chatId={selectedChatId}
                customerName={chat.customer}
              />
            </Card>
            <Card className="w-full max-w-full border-slate-200 shadow-md rounded-2xl overflow-x-auto px-0 dark:bg-slate-900">
              <CustomerComplaintsPreview 
                complaints={complaints}
                isLoading={loadingComplaints}
                onViewFullProfile={handleViewCustomerProfile}
              />
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-md border border-slate-200 p-4">
            <div className="text-center text-slate-500">
              <UserCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="font-semibold text-slate-700">Contact Details</h3>
              <p className="text-sm mt-1">
                Customer information will be displayed here once you select a conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
