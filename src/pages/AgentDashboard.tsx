import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { NavigationHeader } from '@/components/NavigationHeader';
import { AgentSidebar } from '@/components/agent/dashboard/AgentSidebar';
import { DashboardContent } from '@/components/agent/dashboard/DashboardContent';
import { ChatContent } from '@/components/agent/dashboard/ChatContent';
import { AllChatsContent } from '@/components/agent/dashboard/AllChatsContent';
import { ContactsContent } from '@/components/agent/dashboard/ContactsContent';
import { CustomerInfo } from '@/components/agent/CustomerInfo';
import { OtherTabsContent } from '@/components/agent/dashboard/OtherTabsContent';
import { FeatureGuard } from '@/components/FeatureGuard';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { CustomerData } from '@/components/agent/customer/CustomerDataTypes';
import { AgentProfile } from '@/pages/AgentProfile';
import { Customer360 } from '@/components/agent/dashboard/Customer360';

  const getTabFromPath = (pathname: string) => {
  if (pathname.startsWith('/agent/active-chat/')) return 'chat';
    const pathMap: { [key: string]: string } = {
      '/agent': 'dashboard',
      '/agent/active-chat': 'chat',
      '/agent/all-chats': 'all-chats',
      '/agent/contacts': 'contacts',
      '/agent/customer-360': 'customer-insights',
    '/agent/settings': 'settings',
    '/agent/profile': 'profile',
    };
    return pathMap[pathname] || 'dashboard';
  };

const mapChatData = (chat: any) => ({
  id: chat.id,
  customer: chat.customers?.name || 'Unknown Customer',
  lastMessage: chat.lastMessage || chat.subject || 'No subject',
  time: chat.time || new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  status: chat.status,
  unread: chat.unread || 0,
  priority: chat.priority,
  ...chat
});

const AgentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { activeTab, selectedChatId } = useMemo(() => {
    const path = location.pathname;
    const tab = getTabFromPath(path);
    let id: string | null = null;
    if (tab === 'chat' && path.includes('/agent/active-chat/')) {
        const parts = path.split('/');
        const chatId = parts[parts.length - 1];
        if (chatId && chatId !== 'active-chat') {
            id = chatId;
        }
    }
    return { activeTab: tab, selectedChatId: id };
  }, [location.pathname]);

  const [agentChats, setAgentChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [todayPerformance, setTodayPerformance] = useState<any>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [subjectRefreshKey, setSubjectRefreshKey] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const customerIdFromUrl = searchParams.get('customerId');
    if (customerIdFromUrl) {
      setSelectedCustomerId(customerIdFromUrl);
    }
  }, [location.search]);

  const fetchCustomersForChats = useCallback(async (chats: any[]) => {
    if (chats.length === 0) return [];
    
    const customerIds = [...new Set(chats.map(c => c.customer_id).filter(Boolean))];
    
    if (customerIds.length === 0) {
      return chats.map(chat => ({ ...chat, customers: null }));
    }

    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .in('id', customerIds);

    if (customersError) {
      console.error("Error fetching customers for chats:", customersError);
      return chats.map(chat => ({ ...chat, customers: null }));
    }
    
    const customersById = new Map(customersData.map(c => [c.id, c]));

    return chats.map(chat => ({
      ...chat,
      customers: customersById.get(chat.customer_id) || null
    }));
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAllChatData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: assignedChatsData, error: assignedChatsError } = await supabase
          .from('chats')
          .select('*')
          .eq('assigned_agent_id', user.id)
          .neq('status', 'resolved')
          .neq('status', 'closed');

        if (assignedChatsError) throw new Error(`Could not load assigned conversations. Reason: ${assignedChatsError.message}`);
        
        const chatsWithCustomers = await fetchCustomersForChats(assignedChatsData || []);
        setAgentChats(chatsWithCustomers.map(mapChatData));
        
        if (selectedChatId) {
          if (activeChat?.id !== selectedChatId) {
            const { data: activeChatData, error: activeChatError } = await supabase
              .from('chats')
              .select('*')
              .eq('id', selectedChatId)
              .single();

            if (activeChatError) throw new Error(`Could not load conversation ${selectedChatId}.`);
            
            if (activeChatData) {
              const [chatWithCustomer] = await fetchCustomersForChats([activeChatData]);
              setActiveChat(mapChatData(chatWithCustomer));
            } else {
              setActiveChat(null);
            }
          }
        } else {
          setActiveChat(null);
        }
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllChatData();
  }, [user, selectedChatId, fetchCustomersForChats]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || agentChats.length === 0) return;

      try {
        // Parallel fetching for dashboard stats
        const [
          { count: activeAgentsCount },
          { data: resolvedChats },
          { data: notificationData }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'agent').eq('status', 'online'),
          supabase.from('chats').select('id').eq('assigned_agent_id', user.id).eq('status', 'resolved'),
          supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
        ]);
        
        const openTickets = agentChats.length;
        const totalAssignedChats = openTickets + (resolvedChats?.length || 0);
        const resolutionRate = totalAssignedChats > 0 ? (((resolvedChats?.length || 0) / totalAssignedChats) * 100).toFixed(1) : '0';
        const avgWaitTime = agentChats.length > 0 ? (agentChats.reduce((acc, c) => acc + (c.wait_time || 0), 0) / agentChats.length / 60).toFixed(1) : '0';

        setStats([
          { title: 'Open Tickets', value: openTickets.toString(), icon: MessageSquare, color: 'bg-blue-500 text-white' },
          { title: 'Active Agents', value: (activeAgentsCount || 0).toString(), icon: Users, color: 'bg-emerald-500 text-white' },
          { title: 'Avg. Wait Time', value: `${avgWaitTime} mins`, icon: Clock, color: 'bg-amber-400 text-white' },
          { title: 'Resolution Rate', value: `${resolutionRate}%`, icon: CheckCircle, color: 'bg-violet-500 text-white' },
        ]);
        
        setActivities((notificationData || []).map(n => ({
          customer: (n.data as any)?.customer_name || 'System',
          action: n.message,
          time: new Date(n.created_at).toLocaleTimeString(),
          type: n.type === 'system_alert' ? 'warning' : 'info'
        })));

        setTodayPerformance({
          chatsHandled: openTickets,
          avgResponse: `${avgWaitTime} min`,
          satisfaction: agentChats.length > 0 ? (agentChats.reduce((acc, c) => acc + (c.satisfaction_rating || 0), 0) / agentChats.length).toFixed(2) : '0',
        });
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err.message);
        setError("Could not load dashboard stats.");
      }
    };
    
    fetchDashboardData();
  }, [user, agentChats]);

  const handleChatSelect = (chatId: string) => {
    navigate(`/agent/active-chat/${chatId}`);
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleBackToSearch = () => {
    navigate('/agent/customer-360', { replace: true });
    setSelectedCustomerId(null);
  };

  const handleQueueAction = (chatId: string) => {
    navigate(`/agent/active-chat/${chatId}`);
  };

  // Handler to update subject in both activeChat and agentChats
  const handleUpdateChatSubject = async (chatId: string, newSubject: string) => {
    setAgentChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, subject: newSubject } : chat));
    setActiveChat(prev => prev && prev.id === chatId ? { ...prev, subject: newSubject } : prev);
    setSubjectRefreshKey(k => k + 1);
  };

  const renderTabContent = () => {
    if (loading && activeTab === 'chat') return <div>Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    if (selectedCustomerId) {
      return <Customer360 customerId={selectedCustomerId} onBack={handleBackToSearch} agentId={user?.id} refreshKey={subjectRefreshKey} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} agentName={user?.email || ''} activities={activities} queue={agentChats} todayPerformance={todayPerformance} onQueueAction={handleQueueAction} onStatClick={()=>{}} feedback={{csat:0, dsat:0, totalResponses:0, recentFeedback:[]}} />;
      case 'chat':
        return <ChatContent 
                  chats={agentChats}
                  chat={activeChat} 
                  onSendMessage={() => {}}
                  agentName={user?.email || ''} 
                  onChatSelect={handleChatSelect}
                  onSubjectUpdated={handleUpdateChatSubject}
                />;
      case 'all-chats':
        return <AllChatsContent onChatSelect={handleChatSelect} refreshKey={subjectRefreshKey} />;
      case 'contacts':
        return <ContactsContent onCustomerSelect={handleCustomerSelect} />;
      case 'customer-insights':
        return (
          <FeatureGuard feature="customer_360">
            <Customer360 
              customerId={selectedCustomerId} 
              onBack={handleBackToSearch} 
              agentId={user?.id}
              refreshKey={subjectRefreshKey}
            />
          </FeatureGuard>
        );
      case 'settings':
        return <OtherTabsContent title="Settings" />;
      case 'profile':
        return <AgentProfile />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen h-screen w-full flex flex-col bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavigationHeader 
          title="Agent Dashboard" 
          role="agent"
          userEmail={user?.email}
        />
      </div>

      <div className="flex-1 flex min-h-0 pt-16">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full h-full min-h-0">
            <AgentSidebar 
              todayPerformance={todayPerformance}
              activeTab={activeTab}
            />

            <SidebarInset className="flex-1">
              {renderTabContent()}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

const AgentNotifications = () => (
  <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow">
    <h2 className="text-xl font-bold mb-4">Notifications</h2>
    <p className="text-slate-600">You have no new notifications.</p>
  </div>
);

export default function AgentDashboardWrapper() {
  return (
    <Routes>
      <Route path="/agent/notifications" element={<AgentNotifications />} />
      <Route path="*" element={<AgentDashboard />} />
    </Routes>
  );
}
