
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Settings,
  MessageSquare,
  Target,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ClipboardList,
  Star,
  TrendingUp,
  Activity,
  Loader2
} from 'lucide-react';
import { csatService, CSATSurvey } from '@/services/csatService';
import { SurveyCreationModal } from './SurveyCreationModal';

interface SurveyBuilderProps {
  onSurveyUpdate: () => void;
}

export const SurveyBuilder = ({ onSurveyUpdate }: SurveyBuilderProps) => {
  const [surveys, setSurveys] = useState<CSATSurvey[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<CSATSurvey | null>(null);
  const [filter, setFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'CSAT' | 'NPS' | 'CES' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const surveyData = await csatService.getSurveys();
      setSurveys(surveyData);
    } catch (error) {
      console.error('Failed to load surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (surveyId: string, isActive: boolean) => {
    try {
      await csatService.toggleSurveyStatus(surveyId, isActive);
      await loadSurveys();
      onSurveyUpdate();
    } catch (error) {
      console.error('Failed to toggle survey status:', error);
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      try {
        await csatService.deleteSurvey(surveyId);
        await loadSurveys();
        onSurveyUpdate();
      } catch (error) {
        console.error('Failed to delete survey:', error);
      }
    }
  };

  const handleDuplicateSurvey = async (survey: CSATSurvey) => {
    try {
      const duplicatedSurvey = {
        ...survey,
        name: `${survey.name} (Copy)`,
        is_active: false
      };
      delete (duplicatedSurvey as any).id;
      delete (duplicatedSurvey as any).created_at;
      delete (duplicatedSurvey as any).updated_at;
      
      await csatService.createSurvey(duplicatedSurvey);
      await loadSurveys();
      onSurveyUpdate();
    } catch (error) {
      console.error('Failed to duplicate survey:', error);
    }
  };

  const handleCreateSurvey = (template?: 'CSAT' | 'NPS' | 'CES') => {
    setSelectedTemplate(template || null);
    setCreateModalOpen(true);
  };

  const handleSurveyCreated = (survey: CSATSurvey) => {
    setCreateModalOpen(false);
    setSelectedTemplate(null);
    loadSurveys();
    onSurveyUpdate();
  };

  const getSurveyTypeIcon = (type: string) => {
    switch (type) {
      case 'CSAT':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'NPS':
        return <Target className="w-4 h-4 text-emerald-600" />;
      case 'CES':
        return <Zap className="w-4 h-4 text-orange-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSurveyTypeBadge = (type: string) => {
    switch (type) {
      case 'CSAT':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">CSAT</Badge>;
      case 'NPS':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">NPS</Badge>;
      case 'CES':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">CES</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-50 text-gray-700 border-gray-200">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const filteredSurveys = surveys.filter(survey => {
    if (filter === 'all') return true;
    if (filter === 'active') return survey.is_active;
    if (filter === 'inactive') return !survey.is_active;
    return survey.type === filter;
  });

  return (
    <div className="space-y-8">
      {/* AWS-style neutral header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
              Survey Builder
            </h2>
            <p className="text-sm text-slate-600 mt-1">Create and manage customer satisfaction surveys</p>
          </div>
          <Button onClick={() => handleCreateSurvey()} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </Button>
        </div>
      </div>

      {/* Survey Stats - AWS-like cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {surveys.length}
              </p>
              <p className="text-sm text-slate-600">Total Surveys</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {surveys.filter(s => s.is_active).length}
              </p>
              <p className="text-sm text-slate-600">Active Surveys</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {surveys.filter(s => !s.is_active).length}
              </p>
              <p className="text-sm text-slate-600">Inactive Surveys</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards - AWS-like panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => handleCreateSurvey('CSAT')}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              CSAT Survey
            </h3>
            <p className="text-sm text-slate-600">Customer Satisfaction Score</p>
          </div>
        </div>

        <div 
          onClick={() => handleCreateSurvey('NPS')}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              NPS Survey
            </h3>
            <p className="text-sm text-slate-600">Net Promoter Score</p>
          </div>
        </div>

        <div 
          onClick={() => handleCreateSurvey('CES')}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              CES Survey
            </h3>
            <p className="text-sm text-slate-600">Customer Effort Score</p>
          </div>
        </div>
      </div>

      {/* Survey List with Glass Morphism */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            All Surveys
          </h3>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white border-slate-300 focus:border-slate-400"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white border-slate-300 hover:border-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
              <p className="text-slate-500">Loading surveys...</p>
            </div>
          </div>
        ) : filteredSurveys.length > 0 ? (
          <div className="space-y-4">
            {filteredSurveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      {getSurveyTypeIcon(survey.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{survey.name}</h3>
                        {getSurveyTypeBadge(survey.type)}
                        {getStatusBadge(survey.is_active)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{survey.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(survey.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {survey.channels?.length || 0} channels
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings className="w-3 h-3" />
                          {survey.questions?.length || 0} questions
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setSelectedSurvey(survey)}
                      variant="outline"
                      size="sm"
                      className="bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDuplicateSurvey(survey)}
                      variant="outline"
                      size="sm"
                      className="bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(survey.id, !survey.is_active)}
                      variant="outline"
                      size="sm"
                      className={`${survey.is_active ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {survey.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => handleDeleteSurvey(survey.id)}
                      variant="outline"
                      size="sm"
                      className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No surveys found</h3>
              <p className="text-slate-500 mb-4">Create your first survey to get started</p>
              <Button onClick={() => handleCreateSurvey()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Survey
              </Button>
            </div>
          </div>
        )}
      </div>

      <SurveyCreationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSurveyCreated={handleSurveyCreated}
        template={selectedTemplate}
      />
    </div>
  );
};
