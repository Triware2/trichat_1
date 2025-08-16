import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Settings, 
  CheckCircle, 
  UserCheck,
  Clock,
  MessageSquare,
  Bell,
  Shield,
  Zap,
  RefreshCw,
  Save,
  Target,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: string;
  department: string;
  statusColor: string;
  max_concurrent_chats?: number;
  role: string;
  avatar_url?: string;
  skills?: string[];
  timezone?: string;
  is_active?: boolean;
}

interface TeamSettings {
  maxConcurrentChats: string;
  autoAssignChats: boolean;
  notificationsEnabled: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  priority: string;
  allowManualAssignment: boolean;
  breakDuration: string;
  awayTimeout: string;
  skillBasedAssignment: boolean;
  workloadBalance: boolean;
  languageMatch: boolean;
  priorityQueue: boolean;
  newChatNotifications: boolean;
  escalationNotifications: boolean;
  mentionNotifications: boolean;
  overdueNotifications: boolean;
  csatNotifications: boolean;
  queueNotifications: boolean;
}

export const TeamSettings = () => {
  const { toast } = useToast();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [settings, setSettings] = useState<TeamSettings>({
    maxConcurrentChats: '5',
    autoAssignChats: true,
    notificationsEnabled: true,
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    priority: 'normal',
    allowManualAssignment: true,
    breakDuration: '15',
    awayTimeout: '15',
    skillBasedAssignment: false,
    workloadBalance: true,
    languageMatch: false,
    priorityQueue: true,
    newChatNotifications: true,
    escalationNotifications: true,
    mentionNotifications: true,
    overdueNotifications: true,
    csatNotifications: false,
    queueNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, status, department, role, avatar_url, max_concurrent_chats, skills, timezone, is_active')
          .in('role', ['agent', 'supervisor']);

        if (error) throw error;

        setTeamMembers((data || []).map((member) => ({
          id: String(member.id),
          name: member.full_name,
          email: member.email,
          status: member.status || 'offline',
          department: member.department || 'General',
          statusColor: getStatusColor(member.status || 'offline'),
          max_concurrent_chats: member.max_concurrent_chats,
          role: member.role,
          avatar_url: member.avatar_url,
          skills: member.skills,
          timezone: member.timezone,
          is_active: member.is_active
        })));
      } catch (err) {
        console.error('Error fetching team members:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch team members',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'busy': return 'text-yellow-600';
      case 'away': return 'text-gray-600';
      default: return 'text-red-600';
    }
  };

  const handleSaveSettings = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: 'No Members Selected',
        description: 'Please select at least one team member to apply settings.',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    try {
      // Update team member settings in profiles table
      const updates = selectedMembers.map(async (memberId) => {
        const { error } = await supabase
          .from('profiles')
          .update({
            max_concurrent_chats: Number(settings.maxConcurrentChats),
            // Store additional settings in system_settings table
          })
          .eq('id', memberId);
        
        if (error) throw error;
        return memberId;
      });
      
      await Promise.all(updates);
      
      // Save global team settings to system_settings table
      const settingsToSave = [
        { key: 'team_auto_assign_chats', value: settings.autoAssignChats },
        { key: 'team_notifications_enabled', value: settings.notificationsEnabled },
        { key: 'team_working_hours_start', value: settings.workingHours.start },
        { key: 'team_working_hours_end', value: settings.workingHours.end },
        { key: 'team_assignment_priority', value: settings.priority },
        { key: 'team_allow_manual_assignment', value: settings.allowManualAssignment },
        { key: 'team_break_duration', value: Number(settings.breakDuration) },
        { key: 'team_away_timeout', value: Number(settings.awayTimeout) },
        { key: 'team_skill_based_assignment', value: settings.skillBasedAssignment },
        { key: 'team_workload_balance', value: settings.workloadBalance },
        { key: 'team_language_match', value: settings.languageMatch },
        { key: 'team_priority_queue', value: settings.priorityQueue },
        { key: 'team_new_chat_notifications', value: settings.newChatNotifications },
        { key: 'team_escalation_notifications', value: settings.escalationNotifications },
        { key: 'team_mention_notifications', value: settings.mentionNotifications },
        { key: 'team_overdue_notifications', value: settings.overdueNotifications },
        { key: 'team_csat_notifications', value: settings.csatNotifications },
        { key: 'team_queue_notifications', value: settings.queueNotifications }
      ];

      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({
            key: setting.key,
            value: setting.value,
            description: `Team setting for ${setting.key.replace('team_', '').replace('_', ' ')}`
          });
        
        if (error) {
          console.error('Error saving system setting:', setting.key, error);
        }
      }
      
      // Update local state
      setTeamMembers(prev => prev.map(member => 
        selectedMembers.includes(member.id) 
          ? {
              ...member,
              max_concurrent_chats: Number(settings.maxConcurrentChats)
            }
          : member
      ));
      
      toast({
        title: 'Settings Applied',
        description: `Settings have been applied to ${selectedMembers.length} team member(s).`,
      });
    } catch (err) {
      console.error('Error saving settings:', err);
      toast({
        title: 'Error',
        description: 'Failed to apply settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedMembers.length === 0) {
      toast({
        title: 'No Members Selected',
        description: 'Please select team members first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updates = selectedMembers.map(async (memberId) => {
        const { error } = await supabase
          .from('profiles')
          .update({ status: newStatus })
          .eq('id', memberId);
        
        if (error) throw error;
        return memberId;
      });
      
      await Promise.all(updates);
      
      // Update local state
      setTeamMembers(prev => prev.map(member => 
        selectedMembers.includes(member.id) 
          ? { ...member, status: newStatus, statusColor: getStatusColor(newStatus) }
          : member
      ));
      
      toast({
        title: 'Status Updated',
        description: `Status updated to ${newStatus} for ${selectedMembers.length} member(s).`,
      });
    } catch (error) {
      console.error('Error updating bulk status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member status',
        variant: 'destructive',
      });
    }
  };

  const handleBulkMaxChatsUpdate = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: 'No Members Selected',
        description: 'Please select team members first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updates = selectedMembers.map(async (memberId) => {
        const { error } = await supabase
          .from('profiles')
          .update({ max_concurrent_chats: Number(settings.maxConcurrentChats) })
          .eq('id', memberId);
        
        if (error) throw error;
        return memberId;
      });
      
      await Promise.all(updates);
      
      // Update local state
      setTeamMembers(prev => prev.map(member => 
        selectedMembers.includes(member.id) 
          ? { ...member, max_concurrent_chats: Number(settings.maxConcurrentChats) }
          : member
      ));

    toast({
        title: 'Max Chats Updated',
        description: `Max concurrent chats updated to ${settings.maxConcurrentChats} for ${selectedMembers.length} member(s).`,
      });
    } catch (error) {
      console.error('Error updating max chats:', error);
      toast({
        title: 'Error',
        description: 'Failed to update max chats',
        variant: 'destructive',
      });
    }
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, status, department, role, avatar_url, max_concurrent_chats, skills, timezone, is_active')
        .in('role', ['agent', 'supervisor']);

      if (error) throw error;

      setTeamMembers((data || []).map((member) => ({
        id: String(member.id),
        name: member.full_name,
        email: member.email,
        status: member.status || 'offline',
        department: member.department || 'General',
        statusColor: getStatusColor(member.status || 'offline'),
        max_concurrent_chats: member.max_concurrent_chats,
        role: member.role,
        avatar_url: member.avatar_url,
        skills: member.skills,
        timezone: member.timezone,
        is_active: member.is_active
      })));
      
      toast({
        title: 'Data Refreshed',
        description: 'Team data has been refreshed successfully.',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh team data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter agents based on search and filters
  const filteredAgents = teamMembers;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
      <div>
                <h1 className="text-2xl font-bold text-slate-900">Team Settings</h1>
                <p className="text-sm text-slate-600 mt-1">Configure team workflows and agent preferences</p>
              </div>
      </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200" onClick={handleRefreshData}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh settings data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                size="sm" 
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save All
              </Button>
            </div>
                    </div>
                  </div>
                </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl p-2">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger 
                value="general" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="assignments" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Assignments
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Team
              </TabsTrigger>
            </TabsList>
            </div>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <span>Chat Management</span>
            </CardTitle>
          </CardHeader>
                <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
                <div>
                      <Label htmlFor="maxChats" className="text-sm font-medium text-slate-700 mb-2 block">
                    Maximum Concurrent Chats
                  </Label>
                      <div className="flex items-center space-x-3">
                  <Input
                          id="maxChats"
                    type="number"
                    min="1"
                          max="20"
                    value={settings.maxConcurrentChats}
                          onChange={(e) => setSettings(prev => ({ ...prev, maxConcurrentChats: e.target.value }))}
                          className="max-w-20 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                        <span className="text-sm text-slate-600">chats per agent</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Set the maximum number of simultaneous conversations each agent can handle</p>
                </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                          <Label htmlFor="autoAssign" className="text-sm font-medium text-slate-900">Auto-assign Chats</Label>
                          <p className="text-xs text-slate-600">Automatically distribute incoming chats to available agents</p>
                        </div>
                  </div>
                  <Switch
                        id="autoAssign"
                    checked={settings.autoAssignChats}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAssignChats: checked }))}
                  />
                </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="w-5 h-5 text-green-600" />
                  <div>
                          <Label htmlFor="manualAssign" className="text-sm font-medium text-slate-900">Allow Manual Assignment</Label>
                          <p className="text-xs text-slate-600">Allow supervisors to manually assign chats to specific agents</p>
                        </div>
                  </div>
                  <Switch
                        id="manualAssign"
                    checked={settings.allowManualAssignment}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowManualAssignment: checked }))}
                  />
                </div>
              </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                </div>
                    <span>Working Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                <div>
                      <Label htmlFor="startTime" className="text-sm font-medium text-slate-700 mb-2 block">
                        Start Time
                      </Label>
                  <Input
                        id="startTime"
                    type="time"
                    value={settings.workingHours.start}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          workingHours: { ...prev.workingHours, start: e.target.value }
                        }))}
                        className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <div>
                      <Label htmlFor="endTime" className="text-sm font-medium text-slate-700 mb-2 block">
                        End Time
                      </Label>
                  <Input
                        id="endTime"
                    type="time"
                    value={settings.workingHours.end}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          workingHours: { ...prev.workingHours, end: e.target.value }
                        }))}
                        className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              </div>

                  <div className="space-y-4">
              <div>
                      <Label htmlFor="breakDuration" className="text-sm font-medium text-slate-700 mb-2 block">
                        Break Duration (minutes)
                      </Label>
                <Input
                        id="breakDuration"
                  type="number"
                  min="5"
                  max="60"
                        value={settings.breakDuration}
                        onChange={(e) => setSettings(prev => ({ ...prev, breakDuration: e.target.value }))}
                        className="max-w-32 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>

                    <div>
                      <Label htmlFor="awayTimeout" className="text-sm font-medium text-slate-700 mb-2 block">
                        Away Timeout (minutes)
                      </Label>
                      <Input
                        id="awayTimeout"
                        type="number"
                        min="5"
                        max="120"
                        value={settings.awayTimeout}
                        onChange={(e) => setSettings(prev => ({ ...prev, awayTimeout: e.target.value }))}
                        className="max-w-32 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                      <p className="text-xs text-slate-500 mt-1">Auto set agent status to 'away' after inactivity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignment Settings */}
          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span>Assignment Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
              <div>
                      <Label htmlFor="priority" className="text-sm font-medium text-slate-700 mb-2 block">
                        Default Priority Level
                      </Label>
                      <Select value={settings.priority} onValueChange={(value) => setSettings(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue />
                  </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent Priority</SelectItem>
                  </SelectContent>
                </Select>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-xl border border-yellow-100">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 mb-1">Assignment Logic</h4>
                          <p className="text-xs text-slate-600">
                            Chats are assigned based on agent availability, current workload, and skill matching.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Assignment Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="skill-based" 
                          checked={settings.skillBasedAssignment}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, skillBasedAssignment: !!checked }))}
                        />
                        <Label htmlFor="skill-based" className="text-sm text-slate-700">Skill-based assignment</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="workload-balance" 
                          checked={settings.workloadBalance}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, workloadBalance: !!checked }))}
                        />
                        <Label htmlFor="workload-balance" className="text-sm text-slate-700">Balance workload across agents</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="language-match" 
                          checked={settings.languageMatch}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, languageMatch: !!checked }))}
                        />
                        <Label htmlFor="language-match" className="text-sm text-slate-700">Match customer language preference</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="priority-queue" 
                          checked={settings.priorityQueue}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, priorityQueue: !!checked }))}
                        />
                        <Label htmlFor="priority-queue" className="text-sm text-slate-700">Priority-based queue ordering</Label>
                      </div>
                    </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">General Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label htmlFor="new-chat" className="text-sm text-slate-700">New chat assignments</Label>
                        <Switch 
                          id="new-chat" 
                          checked={settings.newChatNotifications}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, newChatNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label htmlFor="escalations" className="text-sm text-slate-700">Chat escalations</Label>
                        <Switch 
                          id="escalations" 
                          checked={settings.escalationNotifications}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, escalationNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label htmlFor="mentions" className="text-sm text-slate-700">@mentions in chats</Label>
                        <Switch 
                          id="mentions" 
                          checked={settings.mentionNotifications}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, mentionNotifications: checked }))}
                        />
                      </div>
                    </div>
      </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Alert Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label htmlFor="overdue" className="text-sm text-slate-700">Overdue responses</Label>
                        <Switch 
                          id="overdue" 
                          checked={settings.overdueNotifications}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, overdueNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label htmlFor="csat-low" className="text-sm text-slate-700">Low CSAT scores</Label>
                        <Switch 
                          id="csat-low" 
                          checked={settings.csatNotifications}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, csatNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label htmlFor="queue-full" className="text-sm text-slate-700">Queue capacity alerts</Label>
                        <Switch 
                          id="queue-full" 
                          checked={settings.queueNotifications}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, queueNotifications: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>Team Members</span>
                  </CardTitle>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    {teamMembers.length} agents
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading team members...</p>
                    </div>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No team members</h3>
                      <p className="text-slate-600">Add agents to your team to get started</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">Select agents to apply bulk settings</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMembers(teamMembers.map(m => m.id))}
                          className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                        >
                          Select All
                        </Button>
        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMembers([])}
                          className="bg-white hover:bg-slate-50 border-slate-200"
                        >
                          Clear
        </Button>
                      </div>
      </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedMembers.includes(member.id)
                              ? 'border-blue-500 bg-blue-50/50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                          onClick={() => {
                            setSelectedMembers(prev =>
                              prev.includes(member.id)
                                ? prev.filter(id => id !== member.id)
                                : [...prev, member.id]
                            );
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                              <AvatarFallback className="text-white text-sm font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-slate-900 truncate">{member.name}</h4>
                              <p className="text-xs text-slate-600 truncate">{member.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {member.department}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${member.statusColor}`}>
                                  {member.status}
                  </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                ))}
            </div>

                    {selectedMembers.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200">
                        <h4 className="text-sm font-medium text-slate-900 mb-3">
                          Bulk Actions ({selectedMembers.length} selected)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="bg-white hover:bg-green-50 border-green-200 text-green-700" onClick={() => handleBulkStatusUpdate('online')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Set Available
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700" onClick={() => handleBulkStatusUpdate('away')}>
                            <Clock className="w-4 h-4 mr-2" />
                            Set Away
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700" onClick={() => handleBulkMaxChatsUpdate()}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Update Max Chats
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
