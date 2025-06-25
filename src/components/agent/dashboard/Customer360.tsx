import React from "react";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, BarChart2, Smile, MessageSquare, List, Star, Languages, Clock, ArrowLeft, Search, ShoppingCart, Activity, FileText, StickyNote, Building, UserCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Customer360Props {
  customerId: string | null;
  onBack: () => void;
  agentId?: string;
  refreshKey?: string | number;
}

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  metadata: any;
  agent_name?: string;
}

interface ChatStats {
  total: number;
  open: number;
  resolved: number;
  avgSatisfaction: number | null;
  satisfactionRatings: number[];
  preferredChannel: string;
  preferredLanguage: string;
}

interface ChatRecord {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  satisfaction_rating: number | null;
  metadata: any;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  agent_name: string;
}

export const Customer360 = ({ customerId, onBack, agentId, refreshKey }: Customer360Props) => {
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [chatStats, setChatStats] = useState<ChatStats | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatRecord[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const navigate = useNavigate();
  const [noteLoading, setNoteLoading] = useState(false);

  // Helper to detect demo user
  const isDemoCustomer = customer?.email === 'elena.rodriguez@example.com';

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    setSearchAttempted(true);
    setIsSearching(true);
    setError(null);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Error searching for customers:', error);
      setError('Failed to perform search.');
    } else {
      setSearchResults(data || []);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    if (!customerId) {
      setCustomer(null);
      setChatStats(null);
      setChatHistory([]);
      setNotes([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (customerError || !customerData) {
        setError('Failed to fetch customer details.');
        setLoading(false);
        return;
      }
      setCustomer(customerData);

      // Fetch chat history for stats
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('id, subject, status, created_at, satisfaction_rating, channel, metadata')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (chatsError) {
        setError('Failed to fetch chat history.');
        setLoading(false);
        return;
      }

      // Fetch notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select(`*, agent:profiles(full_name)`)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (notesError) {
        console.error("Error fetching notes:", notesError);
      } else {
        setNotes(notesData.map(n => ({ ...n, agent_name: n.agent.full_name || 'Unknown Agent' })));
      }

      // Calculate stats
      if (chatsData && chatsData.length > 0) {
        const total = chatsData.length;
        const resolved = chatsData.filter(c => c.status === 'resolved' || c.status === 'closed').length;
        const open = total - resolved;
        
        const satisfactionRatings = chatsData
          .map(c => c.satisfaction_rating)
          .filter((r): r is number => r !== null && r > 0);
        
        const avgSatisfaction = satisfactionRatings.length > 0
          ? satisfactionRatings.reduce((a, b) => a + b, 0) / satisfactionRatings.length
          : null;

        const getMostCommon = (arr: string[]) => arr.reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const channels = chatsData.map(c => c.channel);
        const channelCounts = getMostCommon(channels);
        const preferredChannel = Object.keys(channelCounts).reduce((a, b) => channelCounts[a] > channelCounts[b] ? a : b, 'N/A');

        const languages = chatsData.map(c => {
          if (typeof c.metadata === 'object' && c.metadata !== null && 'language' in c.metadata) {
            return (c.metadata as any).language;
          }
          return 'English';
        });
        const languageCounts = getMostCommon(languages);
        const preferredLanguage = Object.keys(languageCounts).reduce((a, b) => languageCounts[a] > languageCounts[b] ? a : b, 'N/A');

        setChatStats({
          total,
          open,
          resolved,
          avgSatisfaction,
          satisfactionRatings,
          preferredChannel,
          preferredLanguage
        });

        setChatHistory(chatsData.map(c => ({
          id: c.id,
          subject: c.subject || 'No Subject',
          status: c.status,
          created_at: c.created_at,
          satisfaction_rating: c.satisfaction_rating,
          metadata: c.metadata,
        })));

      } else {
        setChatStats({
          total: 0,
          open: 0,
          resolved: 0,
          avgSatisfaction: null,
          satisfactionRatings: [],
          preferredChannel: 'N/A',
          preferredLanguage: 'N/A'
        });
        setChatHistory([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [customerId, refreshKey]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !customerId) return;
    if (!agentId) {
      setError("Could not identify the current agent. Please refresh and try again.");
      return;
    }
    setNoteLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          customer_id: customerId,
          agent_id: agentId, 
          content: newNote,
        })
        .select(`*, agent:profiles(full_name)`)
        .single();
      if (error) {
        setError(`Failed to add note: ${error.message}`);
      } else if (data) {
        setNotes([{...data, agent_name: data.agent?.full_name || 'Unknown Agent'}, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      setError('An unexpected error occurred while adding the note.');
    } finally {
      setNoteLoading(false);
    }
  };

  // --- UI Components for the new layout ---

  const NavLink = ({ viewName, label, icon: Icon }: { viewName: string, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveView(viewName)}
      className={cn(
        "flex items-center w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
        activeView === viewName
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-100"
      )}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
      <div className="p-2 bg-slate-100 rounded-lg">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
  
  const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <Card className={cn("w-full shadow-sm border-slate-200", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  // --- Main Render ---

  if (loading) {
    return <div className="p-6 text-center">Loading customer data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (customerId && !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center w-full max-w-md">
          <UserCircle className="w-14 h-14 text-blue-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Customer Not Found</h2>
          <p className="text-slate-500 mb-4 text-center">We couldn't find a customer with this ID. Please check the link or try searching again.</p>
          <Button variant="outline" onClick={onBack} className="mt-2">Back to Search</Button>
        </div>
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl px-10 py-12 flex flex-col items-center w-full max-w-lg animate-fade-in">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 rounded-full p-4 mb-2">
              <UserCircle className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Search for a Customer</h2>
            <p className="text-base text-slate-500 text-center mb-2">
              Use the search bar below to find a customer by name, email, or phone number.
            </p>
          </div>
          <form className="w-full flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
            <Input
              className="flex-1 rounded-full px-5 py-3 text-lg shadow focus:ring-2 focus:ring-blue-200 transition"
              placeholder="e.g., Elena Rodriguez, elena@example.com"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            />
            <Button
              className="rounded-full px-6 py-3 text-lg font-bold shadow bg-blue-600 hover:bg-blue-700 transition flex items-center"
              type="submit"
              disabled={isSearching}
            >
              {isSearching ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Search className="w-6 h-6 animate-fade-in" />
              )}
            </Button>
          </form>
          {/* Search Results */}
          {searchAttempted && !isSearching && searchResults.length === 0 && (
            <div className="mt-2 text-slate-500 text-center">No customers found.</div>
          )}
          {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
          {searchResults.length > 0 && (
            <ul className="mt-4 w-full divide-y divide-slate-100 rounded-xl bg-slate-50/80 shadow">
              {searchResults.map(c => (
                <li key={c.id} className="p-3 hover:bg-blue-50 transition rounded-xl cursor-pointer flex items-center gap-3"
                  onClick={() => navigate(`/agent/customer-360?customerId=${c.id}`)}
                >
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 truncate">{c.name}</div>
                    <div className="text-xs text-slate-500 truncate">{c.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-sm text-slate-400 text-center">
            Start by searching for a customer to see their 360° profile!
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full flex bg-slate-50">
        {/* Left Navigation */}
        <aside className="w-64 bg-white p-4 border-r border-slate-200 flex flex-col gap-6">
          <header className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <h2 className="text-lg font-semibold text-slate-800 truncate">{customer.name}</h2>
                {customer.metadata?.tier === 'Premium' && <Badge variant="premium">Premium</Badge>}
              </div>
              <p className="text-sm text-slate-500 truncate">{customer.email}</p>
            </div>
          </header>
          <nav className="flex flex-col gap-1">
            <NavLink viewName="overview" label="Overview" icon={UserCircle} />
            <NavLink viewName="productUsage" label="Product Usage" icon={ShoppingCart} />
            <NavLink viewName="accountStatus" label="Account Status" icon={Activity} />
            <NavLink viewName="interactions" label="Interactions" icon={MessageSquare} />
            <NavLink viewName="issues" label="Issues" icon={FileText} />
            <NavLink viewName="profile" label="Profile" icon={User} />
            <NavLink viewName="notes" label="Notes" icon={StickyNote} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeView === 'overview' && (
            <OverviewView />
          )}
          {activeView === 'productUsage' && (
            <ProductUsageView />
          )}
          {activeView === 'accountStatus' && (
            <AccountStatusView />
          )}
          {activeView === 'interactions' && (
            <InteractionsView />
          )}
          {activeView === 'issues' && (
            <IssuesView />
          )}
          {activeView === 'profile' && (
            <ProfileView />
          )}
          {activeView === 'notes' && (
            <NotesView />
          )}
        </main>
      </div>
    );
  }

  function OverviewView() {
    return (
      <div className="space-y-6">
        <Section title="Key Statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Chats" value={chatStats?.total ?? 'N/A'} icon={MessageSquare} />
            <StatCard title="Resolved" value={chatStats?.resolved ?? 'N/A'} icon={CheckCircle} />
            <StatCard title="Open" value={chatStats?.open ?? 'N/A'} icon={Clock} />
            <StatCard title="Avg. CSAT" value={chatStats?.avgSatisfaction ? `${chatStats.avgSatisfaction.toFixed(1)}/5` : 'N/A'} icon={Smile} />
          </div>
        </Section>
        <Section title="Communication Profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Preferred Channel" value={chatStats?.preferredChannel} />
            <InfoItem label="Preferred Language" value={chatStats?.preferredLanguage} />
          </div>
        </Section>
        <Section title="Recent Interactions">
          <ul className="space-y-2">
            {chatHistory.slice(0, 5).map(chat => (
              <li key={chat.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-700">{chat.subject}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(chat.created_at).toLocaleDateString()} - {chat.status}
                  </p>
                </div>
                {chat.satisfaction_rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{chat.satisfaction_rating}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    );
  }

  function NotesView() {
    const [noteLoading, setNoteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noteInput, setNoteInput] = useState("");
    const handleAddNoteLocal = async () => {
      if (!noteInput.trim() || !customerId) return;
      if (!agentId) {
        setError("Could not identify the current agent. Please refresh and try again.");
        return;
      }
      setNoteLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('notes')
          .insert({
            customer_id: customerId,
            agent_id: agentId, 
            content: noteInput,
          })
          .select(`*, agent:profiles(full_name)`)
          .single();
        if (error) {
          setError(`Failed to add note: ${error.message}`);
        } else if (data) {
          setNotes([{...data, agent_name: data.agent?.full_name || 'Unknown Agent'}, ...notes]);
          setNoteInput('');
        }
      } catch (err) {
        setError('An unexpected error occurred while adding the note.');
      } finally {
        setNoteLoading(false);
      }
    };
    return (
      <Section title="Notes">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea 
              placeholder="Add a new note for this customer..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="min-h-[80px]"
              disabled={noteLoading}
            />
            <Button onClick={handleAddNoteLocal} disabled={!noteInput.trim() || noteLoading}>
              {noteLoading ? 'Saving...' : 'Add Note'}
            </Button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
          <ul className="space-y-3">
            {notes.map(note => (
              <li key={note.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-800 mb-1">{note.content}</p>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>by {note.agent_name}</span>
                  <span>{new Date(note.created_at).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    );
  }
  
  function InfoItem({ label, value }: { label: string, value?: string | number | null }) {
    return (
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-base text-slate-800">{value ?? 'N/A'}</p>
      </div>
    );
  }
  
  function ProfileView() {
    return (
      <Section title="Customer Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Full Name" value={customer?.name} />
          <InfoItem label="Email Address" value={customer?.email} />
          <InfoItem label="Phone Number" value={customer?.phone} />
          <InfoItem label="Customer Since" value={customer ? new Date(customer.created_at).toLocaleDateString() : 'N/A'} />
          <InfoItem label="Contact ID" value={customer?.id} />
          <InfoItem label="Company" value={customer?.metadata?.company ?? 'N/A'} />
        </div>
      </Section>
    );
  }

  function InteractionsView() {
    return (
      <Section title="Interaction History">
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {chatHistory.length > 0 ? (
                chatHistory.map(chat => (
                  <li key={chat.id} className="p-4 border rounded-lg bg-white flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                        <div>
                            <p className="font-semibold text-slate-800">{chat.subject}</p>
                            <p className="text-sm text-slate-500">{new Date(chat.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                       {chat.satisfaction_rating && (
                         <div className="flex items-center gap-1.5">
                           <Star className="w-4 h-4 text-yellow-400 fill-current" />
                           <span className="font-medium">{chat.satisfaction_rating}/5</span>
                         </div>
                       )}
                       <Badge variant={chat.status === 'resolved' || chat.status === 'closed' ? 'default' : 'secondary'}>{chat.status}</Badge>
                       <Button variant="outline" size="sm" onClick={() => navigate(`/agent/active-chat/${chat.id}`)}>View</Button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No interaction history found.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </Section>
    );
  }

  function IssuesView() {
    const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];
    const categorizedIssues = React.useMemo(() => {
        return safeChatHistory.reduce((acc, chat) => {
            const category = chat && chat.metadata && typeof chat.metadata === 'object' && chat.metadata.category
                ? chat.metadata.category
                : 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(chat);
            return acc;
        }, {} as Record<string, ChatRecord[]>);
    }, [safeChatHistory]);

    return (
      <Section title="Customer Issues by Disposition">
        <Card>
          <CardContent className="pt-6">
            {Object.keys(categorizedIssues).length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {Object.entries(categorizedIssues).map(([category, issues]) => (
                        <AccordionItem value={category} key={category}>
                            <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-slate-500" />
                                  <span>{category} ({issues.length} issue{issues.length > 1 ? 's' : ''})</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 pt-2 pl-4">
                                    {issues.map(issue => (
                                        <li key={issue?.id || Math.random()} className="p-3 border-l-2 border-slate-200 flex justify-between items-center transition-colors">
                                            <div>
                                                <p className="font-medium text-slate-800">{issue?.subject || 'No Subject'}</p>
                                                <p className="text-sm text-slate-500">
                                                    Reported on: {issue?.created_at ? new Date(issue.created_at).toLocaleDateString() : 'Unknown'}
                                                </p>
                                            </div>
                                            <Badge variant={issue?.status === 'resolved' || issue?.status === 'closed' ? 'default' : 'destructive'}>
                                                {issue?.status || 'Unknown'}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="text-center text-slate-500 py-10">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">No Issues Found</h3>
                    <p>This customer has not reported any issues.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </Section>
    );
  }
  
  function AccountStatusView() {
    if (isDemoCustomer) {
      const account = {
        plan: customer?.metadata?.tier || 'Premium',
        status: customer?.metadata?.status || 'Active',
        renewalDate: customer?.metadata?.renewalDate || '2024-12-31',
        paymentMethod: customer?.metadata?.paymentMethod || 'Visa **** 4321',
        lastLogin: customer?.metadata?.lastLogin || '2024-03-15 10:30 AM'
      };
      return (
        <Section title="Account Status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>Subscription Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <InfoItem label="Current Plan" value={account.plan} />
                <InfoItem label="Account Status" value={account.status} />
                <InfoItem label="Next Renewal" value={account.renewalDate} />
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Billing & Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <InfoItem label="Payment Method" value={account.paymentMethod} />
                <InfoItem label="Last Login" value={account.lastLogin} />
              </CardContent>
            </Card>
          </div>
        </Section>
      );
    } else {
      // For real users, show only real data (customize as needed)
      const account = {
        plan: customer?.metadata?.tier || 'Standard',
        status: customer?.metadata?.status || 'Active',
        renewalDate: customer?.metadata?.renewalDate || 'N/A',
        paymentMethod: customer?.metadata?.paymentMethod || 'N/A',
        lastLogin: customer?.metadata?.lastLogin || 'N/A'
      };
      return (
        <Section title="Account Status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>Subscription Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <InfoItem label="Current Plan" value={account.plan} />
                <InfoItem label="Account Status" value={account.status} />
                <InfoItem label="Next Renewal" value={account.renewalDate} />
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Billing & Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <InfoItem label="Payment Method" value={account.paymentMethod} />
                <InfoItem label="Last Login" value={account.lastLogin} />
              </CardContent>
            </Card>
          </div>
        </Section>
      );
    }
  }

  function ProductUsageView() {
    if (isDemoCustomer) {
      const mockOrders = [
        { id: 'ORD-001', date: '2023-10-15', product: 'StellarPhone Pro', amount: '$999.00', status: 'Delivered' },
        { id: 'ORD-002', date: '2023-11-20', product: 'StellarPods 2', amount: '$249.00', status: 'Delivered' },
        { id: 'ORD-003', date: '2024-01-05', product: 'StellarBook Max', amount: '$2499.00', status: 'Shipped' },
        { id: 'ORD-004', date: '2024-02-28', product: 'StellarWatch SE', amount: '$399.00', status: 'Processing' },
      ];
      return (
        <Section title="Product & Order History">
          <Card>
              <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Mock data is shown. This would be connected to your e-commerce platform.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                              <tr>
                                  <th className="p-3 text-left font-semibold text-slate-600">Order ID</th>
                                  <th className="p-3 text-left font-semibold text-slate-600">Product</th>
                                  <th className="p-3 text-left font-semibold text-slate-600">Date</th>
                                  <th className="p-3 text-left font-semibold text-slate-600">Amount</th>
                                  <th className="p-3 text-left font-semibold text-slate-600">Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {mockOrders.map((order) => (
                                  <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50/50">
                                      <td className="p-3 font-medium text-slate-800">{order.id}</td>
                                      <td className="p-3">{order.product}</td>
                                      <td className="p-3 text-slate-600">{order.date}</td>
                                      <td className="p-3 font-medium">{order.amount}</td>
                                      <td className="p-3">
                                          <Badge variant={
                                              order.status === 'Delivered' ? 'default' :
                                              order.status === 'Shipped' ? 'secondary' :
                                              'outline'
                                          }>{order.status}</Badge>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </CardContent>
          </Card>
        </Section>
      );
    } else {
      // For real users, show a message or real data if available
      return (
        <Section title="Product & Order History">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>No product usage/order data available for this customer.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* If you have real data, render it here. Otherwise, show a message. */}
            </CardContent>
          </Card>
        </Section>
      );
    }
  }
}; 