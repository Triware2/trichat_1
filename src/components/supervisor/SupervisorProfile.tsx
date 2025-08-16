import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { 
  User, 
  Mail, 
  Shield, 
  Edit3, 
  Save, 
  Camera, 
  MapPin, 
  Phone, 
  Calendar,
  Clock,
  Users,
  Activity,
  BarChart3,
  Award,
  TrendingUp,
  MessageSquare,
  Target,
  Star,
  CheckCircle,
  UserCheck,
  Settings,
  ArrowRight,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

interface SupervisorProfile {
  id: string;
  full_name: string;
  email: string;
  department?: string;
  role: string;
  status: string;
  created_at: string;
  avatar_url?: string;
  timezone?: string;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  status: string;
  department?: string;
  avatar_url?: string;
  activeChats: number;
  totalChats: number;
  avgResponseTime: string;
  satisfaction: number;
  isSelected: boolean;
}

interface SupervisorStats {
  totalTeamMembers: number;
  activeChatsSupervisedToday: number;
  escalationsHandled: number;
  avgResponseTime: string;
  teamSatisfactionScore: number;
  weeklyPerformance: number;
  resolutionRate: number;
  totalResolved: number;
}

export const SupervisorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<SupervisorProfile | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [stats, setStats] = useState<SupervisorStats>({
    totalTeamMembers: 0,
    activeChatsSupervisedToday: 0,
    escalationsHandled: 0,
    avgResponseTime: '0m',
    teamSatisfactionScore: 0,
    weeklyPerformance: 0,
    resolutionRate: 0,
    totalResolved: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTeam, setSavingTeam] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    department: '',
    timezone: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchTeamMembers();
    fetchStats();
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        department: data.department || '',
        timezone: data.timezone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // Fetch all agents
      const { data: agents, error: agentsError } = await supabase
        .from('profiles')
        .select('id, full_name, email, status, department, avatar_url')
        .eq('role', 'agent');

      if (agentsError) throw agentsError;

      // Fetch chat data for each agent
      const { data: chats } = await supabase
        .from('chats')
        .select('assigned_agent_id, status, response_time, satisfaction_rating, created_at');

      // Get supervisor's current team assignments
      const { data: teamAssignments } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'supervisor_team_assignments')
        .eq('updated_by', user?.id)
        .single();

      const assignedMemberIds = teamAssignments?.value?.members || [];

      // Process team members with stats
      const processedMembers: TeamMember[] = (agents || []).map(agent => {
        const agentChats = (chats || []).filter(c => c.assigned_agent_id === agent.id);
        const activeChats = agentChats.filter(c => c.status === 'active').length;
        const totalChats = agentChats.length;
        
        // Calculate average response time
        const responseTimes = agentChats
          .map(c => c.response_time)
          .filter(time => time && time > 0);
        const avgResponseTime = responseTimes.length > 0 
          ? `${Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 60)}m`
          : '0m';

        // Calculate satisfaction
        const satisfactionRatings = agentChats
          .map(c => c.satisfaction_rating)
          .filter(rating => rating && rating > 0);
        const satisfaction = satisfactionRatings.length > 0
          ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length
          : 0;

        return {
          id: agent.id,
          full_name: agent.full_name,
          email: agent.email,
          status: agent.status,
          department: agent.department,
          avatar_url: agent.avatar_url,
          activeChats,
          totalChats,
          avgResponseTime,
          satisfaction,
          isSelected: assignedMemberIds.includes(agent.id)
        };
      });

      setTeamMembers(processedMembers);
      setSelectedTeamMembers(assignedMemberIds);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      // Fetch today's supervised chats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayChats } = await supabase
        .from('chats')
        .select('id, response_time, satisfaction_rating, status, created_at')
        .gte('created_at', today.toISOString());

      // Calculate comprehensive stats
      const totalTeamMembers = teamMembers.length;
      const activeChatsSupervisedToday = todayChats?.length || 0;
      const resolvedChats = todayChats?.filter(c => c.status === 'resolved' || c.status === 'closed') || [];
      
      const responseTimes = todayChats?.filter(c => c.response_time).map(c => c.response_time) || [];
      const avgResponseTime = responseTimes.length > 0 
        ? `${Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 60)}m`
        : '0m';

      const satisfactionRatings = todayChats?.filter(c => c.satisfaction_rating).map(c => c.satisfaction_rating) || [];
      const teamSatisfactionScore = satisfactionRatings.length > 0
        ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length
        : 0;

      const resolutionRate = todayChats?.length > 0 ? (resolvedChats.length / todayChats.length) * 100 : 0;

      setStats({
        totalTeamMembers,
        activeChatsSupervisedToday,
        escalationsHandled: 8, // Mock data
        avgResponseTime,
        teamSatisfactionScore,
        weeklyPerformance: 92, // Mock data
        resolutionRate,
        totalResolved: resolvedChats.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          department: formData.department,
          timezone: formData.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile();
      setIsEditing(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const saveTeamAssignments = async () => {
    if (!user?.id) return;

    setSavingTeam(true);
    try {
      // First, try to find existing setting
      const { data: existingSetting } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'supervisor_team_assignments')
        .eq('updated_by', user.id)
        .single();

      let error;
      if (existingSetting) {
        // Update existing record
        ({ error } = await supabase
          .from('system_settings')
          .update({
            value: { members: selectedTeamMembers },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSetting.id));
      } else {
        // Insert new record
        ({ error } = await supabase
          .from('system_settings')
          .insert({
            key: 'supervisor_team_assignments',
            value: { members: selectedTeamMembers },
            updated_by: user.id,
            updated_at: new Date().toISOString(),
            description: 'Supervisor team member assignments'
          }));
      }

      if (error) throw error;

      // Update local state
      setTeamMembers(prev => prev.map(member => ({
        ...member,
        isSelected: selectedTeamMembers.includes(member.id)
      })));

      toast({
        title: 'Team Updated',
        description: `${selectedTeamMembers.length} team members assigned`,
      });
    } catch (error) {
      console.error('Error saving team assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to save team assignments',
        variant: 'destructive',
      });
    } finally {
      setSavingTeam(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        department: profile.department || '',
        timezone: profile.timezone || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Supervisor Profile</h1>
                <p className="text-slate-600 mt-1">Manage your profile, team, and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="bg-white hover:bg-slate-50 border-slate-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Modern Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl p-2">
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Users className="w-4 h-4 mr-2" />
                My Team
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Award className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Profile Hero Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                        {profile?.full_name?.charAt(0).toUpperCase() || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-3xl font-bold mb-2">{profile?.full_name}</h2>
                    <p className="text-blue-100 text-lg mb-3">{profile?.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Supervisor
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Users className="w-3 h-3 mr-1" />
                        {stats.totalTeamMembers} Team Members
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        {profile?.created_at ? new Date(profile.created_at).getFullYear() : 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">{stats.weeklyPerformance}%</div>
                    <p className="text-blue-100">Performance Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Team Members</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.totalTeamMembers}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">Active supervision</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Today's Chats</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.activeChatsSupervisedToday}</p>
                      <div className="flex items-center mt-2">
                        <MessageSquare className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">Supervised</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Response</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.avgResponseTime}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="w-3 h-3 text-orange-600 mr-1" />
                        <span className="text-xs text-orange-600">Team average</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Team CSAT</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.teamSatisfactionScore.toFixed(1)}</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-3 h-3 text-yellow-600 mr-1" />
                        <span className="text-xs text-yellow-600">Satisfaction</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Today's Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Resolution Rate</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                            style={{ width: `${stats.resolutionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{stats.resolutionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Escalations Handled</span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.escalationsHandled}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Resolved</span>
                      <Badge className="bg-green-100 text-green-800">{stats.totalResolved}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Top Supervisor</h4>
                        <p className="text-green-600 text-sm">Highest performance this month</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Goal Achievement</h4>
                        <p className="text-blue-600 text-sm">92% of monthly targets reached</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Team Leadership</h4>
                        <p className="text-purple-600 text-sm">Excellent team management skills</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                <CardTitle className="text-xl font-semibold text-slate-900">Personal Information</CardTitle>
                <CardDescription className="text-slate-600">
                  Update your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl font-bold">
                          {profile?.full_name?.charAt(0).toUpperCase() || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute -bottom-2 -right-2 rounded-full p-3 bg-white shadow-lg hover:shadow-xl"
                        disabled={!isEditing}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900">{profile?.full_name}</p>
                      <p className="text-slate-600">{profile?.email}</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Supervisor</Badge>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm font-medium text-slate-700">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                        <Input
                          id="email"
                          value={profile?.email || ''}
                          disabled
                          className="bg-slate-50 border-slate-200 text-slate-500"
                        />
                        <p className="text-xs text-slate-500">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium text-slate-700">Department</Label>
                        <Select 
                          value={formData.department} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer-support">Customer Support</SelectItem>
                            <SelectItem value="technical-support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm font-medium text-slate-700">Timezone</Label>
                        <Select 
                          value={formData.timezone} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                            <SelectItem value="Europe/London">GMT (London)</SelectItem>
                            <SelectItem value="Europe/Berlin">CET (Berlin)</SelectItem>
                            <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium text-slate-700">Role</Label>
                        <Input
                          id="role"
                          value="Supervisor"
                          disabled
                          className="bg-slate-50 border-slate-200 text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="member_since" className="text-sm font-medium text-slate-700">Member Since</Label>
                        <Input
                          id="member_since"
                          value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                          disabled
                          className="bg-slate-50 border-slate-200 text-slate-500"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                        <Button variant="outline" onClick={handleCancel} disabled={saving}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          {saving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
                      <Users className="w-6 h-6 text-green-600" />
                      <span>Team Management</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      Select and manage your team members ({selectedTeamMembers.length} selected)
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={saveTeamAssignments} 
                    disabled={savingTeam}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  >
                    {savingTeam ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Save Team
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {teamMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Team Members Available</h3>
                    <p className="text-slate-600">No agents are currently available for assignment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                          selectedTeamMembers.includes(member.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                        onClick={() => handleTeamMemberToggle(member.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                                {member.full_name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                              selectedTeamMembers.includes(member.id) ? 'bg-green-500' : 'bg-slate-300'
                            }`}>
                              {selectedTeamMembers.includes(member.id) ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <Plus className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 truncate">{member.full_name}</h4>
                            <p className="text-sm text-slate-600 truncate">{member.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  member.status === 'online' ? 'bg-green-100 text-green-800' :
                                  member.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {member.status}
                              </Badge>
                              <span className="text-xs text-slate-500">{member.department}</span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500">Active: </span>
                                <span className="font-medium">{member.activeChats}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Total: </span>
                                <span className="font-medium">{member.totalChats}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Avg: </span>
                                <span className="font-medium">{member.avgResponseTime}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">CSAT: </span>
                                <span className="font-medium">{member.satisfaction.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span>Performance Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-slate-900 mb-2">{stats.weeklyPerformance}%</div>
                    <p className="text-slate-600">Weekly Performance Score</p>
                    <div className="mt-4 w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000"
                        style={{ width: `${stats.weeklyPerformance}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Team Satisfaction</span>
                      <span className="font-semibold text-slate-900">{stats.teamSatisfactionScore.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Resolution Rate</span>
                      <span className="font-semibold text-slate-900">{stats.resolutionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Escalations Handled</span>
                      <span className="font-semibold text-slate-900">{stats.escalationsHandled}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements & Goals */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-yellow-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span>Achievements & Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Top Supervisor</h4>
                        <p className="text-green-600 text-sm">Highest performance this month</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Goal Achievement</h4>
                        <p className="text-blue-600 text-sm">92% of monthly targets reached</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Team Leadership</h4>
                        <p className="text-purple-600 text-sm">Excellent team management skills</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 