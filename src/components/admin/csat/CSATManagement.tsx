
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Brain,
  Bell,
  ClipboardList
} from 'lucide-react';
import { SurveyBuilder } from './SurveyBuilder';
import { CSATDashboard } from './CSATDashboard';
import { FeedbackAnalysis } from './FeedbackAnalysis';
import { SentimentMonitoring } from './SentimentMonitoring';
import { CSATSettings } from './CSATSettings';
import { SurveyCreationModal } from './SurveyCreationModal';
import { csatService, CSATMetrics } from '@/services/csatService';
import { supabase } from '@/integrations/supabase/client';

export const CSATManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [csatMetrics, setCsatMetrics] = useState<CSATMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute monthly change from trend data when available
  const monthlyChange = useMemo(() => {
    if (!csatMetrics?.trendData || csatMetrics.trendData.length < 2) return 0;
    const last = csatMetrics.trendData[csatMetrics.trendData.length - 1];
    const prev = csatMetrics.trendData[csatMetrics.trendData.length - 2];
    return (last.csat - prev.csat).toFixed(1);
  }, [csatMetrics]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await csatService.getCSATMetrics('30d');
      setCsatMetrics(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load CSAT metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    // Real-time refresh on new responses/surveys
    const channel = (supabase as any)
      .channel('csat-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'csat_responses' }, () => loadMetrics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'csat_surveys' }, () => loadMetrics())
      .subscribe();
    return () => { (supabase as any).removeChannel(channel); };
  }, []);

  const handleCreateSurvey = () => {
    setCreateModalOpen(true);
  };

  const handleSurveyCreated = () => {
    setCreateModalOpen(false);
    loadMetrics();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">CSAT Management</h1>
          </div>
          <p className="text-sm text-slate-600">Monitor and analyze customer satisfaction scores and feedback</p>
        </div>
        <Button onClick={handleCreateSurvey} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Survey
        </Button>
      </div>

      {/* CSAT Overview Cards with semi glass */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/30 shadow-2xl">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{csatMetrics?.averageCSAT?.toFixed ? csatMetrics.averageCSAT.toFixed(1) : '0.0'}</p>
              <p className="text-sm font-medium text-slate-600">Overall CSAT</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/30 shadow-2xl">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{csatMetrics?.totalResponses || 0}</p>
              <p className="text-sm font-medium text-slate-600">Total Responses</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/30 shadow-2xl">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{csatMetrics?.responseRate ? `${Math.round(csatMetrics.responseRate)}%` : '0%'}</p>
              <p className="text-sm font-medium text-slate-600">Response Rate</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/30 shadow-2xl">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{Number(monthlyChange) >= 0 ? `+${monthlyChange}` : monthlyChange}</p>
              <p className="text-sm font-medium text-slate-600">Monthly Change</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs with semi glass */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/30 shadow-2xl">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="h-auto bg-transparent p-0 space-x-0">
              <div className="flex">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="surveys" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <ClipboardList className="w-4 h-4" />
                  Survey Builder
                </TabsTrigger>
                <TabsTrigger 
                  value="responses" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <MessageSquare className="w-4 h-4" />
                  Responses
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <TrendingUp className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0 p-6">
            <div className="space-y-6">
              <CSATDashboard csatMetrics={csatMetrics} onRefresh={loadMetrics} />
            </div>
          </TabsContent>

          <TabsContent value="surveys" className="mt-0 p-6">
            <SurveyBuilder onSurveyUpdate={loadMetrics} />
          </TabsContent>

          <TabsContent value="responses" className="mt-0 p-6">
            <FeedbackAnalysis onRefresh={loadMetrics} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 p-6">
            <SentimentMonitoring csatMetrics={csatMetrics} onRefresh={loadMetrics} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 p-6">
            <CSATSettings />
          </TabsContent>
        </Tabs>
      </div>

      <SurveyCreationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSurveyCreated={handleSurveyCreated}
      />
    </div>
  );
};
