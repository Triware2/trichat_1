
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Settings, 
  Clock, 
  Users, 
  Filter,
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  Activity,
  Timer,
  Zap,
  Radio,
  Shield,
  BarChart3,
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ChannelManagement } from './ChannelManagement';
import { ChatRules } from './ChatRules';
import { BulkOperations } from './BulkOperations';
import { ChatAnalytics } from './ChatAnalytics';
import { QuickSetupModal } from './QuickSetupModal';
import { GlobalFiltersModal } from './GlobalFiltersModal';
import { chatManagementService, ChatStats } from '@/services/chatManagementService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const ChatManagement = () => {
  const [activeTab, setActiveTab] = useState('channels');
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [stats, setStats] = useState<ChatStats>({
    total_chats: 0,
    active_chats: 0,
    waiting_chats: 0,
    avg_response_time: 0,
    channels_active: 0,
    rules_active: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load real-time stats
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await chatManagementService.getChatStats('24 hours');
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load chat statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Set up real-time subscription for stats updates
  useEffect(() => {
    if (!user) return;

    const subscription = chatManagementService.subscribeToConversations((payload) => {
      // Refresh stats when conversations change
      loadStats();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Handle quick setup
  const handleQuickSetup = () => {
    setIsQuickSetupOpen(true);
  };

  // Handle global filters
  const handleGlobalFilters = () => {
    setIsFiltersOpen(true);
  };

  // Stats cards with loading states and real data
  const statsCards = [
    {
      label: 'Total Chats',
      value: stats.total_chats,
      icon: MessageSquare,
      color: 'blue',
      trend: '+12%',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Chats',
      value: stats.active_chats,
      icon: Activity,
      color: 'green',
      trend: '+5%',
      trendDirection: 'up' as const
    },
    {
      label: 'Waiting',
      value: stats.waiting_chats,
      icon: Clock,
      color: 'orange',
      trend: '-8%',
      trendDirection: 'down' as const
    },
    {
      label: 'Avg Response',
      value: formatTime(stats.avg_response_time),
      icon: Timer,
      color: 'purple',
      trend: '-15%',
      trendDirection: 'down' as const
    },
    {
      label: 'Channels',
      value: stats.channels_active,
      icon: Radio,
      color: 'cyan',
      trend: '+2',
      trendDirection: 'up' as const
    },
    {
      label: 'Rules Active',
      value: stats.rules_active,
      icon: Shield,
      color: 'indigo',
      trend: '+3',
      trendDirection: 'up' as const
    }
  ];

  if (loading && stats.total_chats === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Chat Management</h1>
          </div>
          <p className="text-sm text-slate-600">
            Monitor and manage all customer conversations across channels
          </p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-slate-600">Loading chat management data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Chat Management</h1>
        </div>
        <p className="text-sm text-slate-600">
          Monitor and manage all customer conversations across channels
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleQuickSetup} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Quick Setup
        </Button>
        <Button 
          variant="outline" 
          onClick={handleGlobalFilters} 
          className="border-slate-300"
          disabled={loading}
        >
          <Filter className="w-4 h-4 mr-2" />
          Global Filters
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            orange: 'bg-orange-100 text-orange-600',
            purple: 'bg-purple-100 text-purple-600',
            cyan: 'bg-cyan-100 text-cyan-600',
            indigo: 'bg-indigo-100 text-indigo-600'
          };

          return (
            <Card 
              key={stat.label} 
              className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                // Navigate to relevant tab based on stat
                if (stat.label === 'Channels') setActiveTab('channels');
                if (stat.label === 'Rules Active') setActiveTab('rules');
                if (stat.label === 'Total Chats' || stat.label === 'Active Chats') setActiveTab('analytics');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                    </div>
                  </div>
                  {!loading && (
                    <div className={`flex items-center gap-1 text-xs ${
                      stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trendDirection === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{stat.trend}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Error Loading Data</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadStats}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Card className="border border-slate-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="h-auto bg-transparent p-0 space-x-0">
              <div className="flex">
                <TabsTrigger 
                  value="channels" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Radio className="w-4 h-4" />
                  Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="rules" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Shield className="w-4 h-4" />
                  Chat Rules
                </TabsTrigger>
                <TabsTrigger 
                  value="bulk" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Zap className="w-4 h-4" />
                  Bulk Operations
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="channels" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Channel Management</h3>
                <p className="text-sm text-slate-600 mt-1">Configure and manage your communication channels</p>
              </div>
              <ChannelManagement onChannelUpdate={loadStats} />
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Chat Rules & Automation</h3>
                <p className="text-sm text-slate-600 mt-1">Set up automated routing and response rules</p>
              </div>
              <ChatRules onRuleUpdate={loadStats} />
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-0 p-6">
            <BulkOperations />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Chat Analytics</h3>
                <p className="text-sm text-slate-600 mt-1">Analyze conversation patterns and performance</p>
              </div>
              <ChatAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Modals */}
      <QuickSetupModal 
        open={isQuickSetupOpen} 
        onOpenChange={setIsQuickSetupOpen}
        onSetupComplete={loadStats}
      />
      
      <GlobalFiltersModal 
        open={isFiltersOpen} 
        onOpenChange={setIsFiltersOpen} 
      />
    </div>
  );
};
