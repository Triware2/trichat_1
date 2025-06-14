import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Star,
  MessageSquare,
  Mail,
  Smartphone,
  Monitor,
  Clock
} from 'lucide-react';

export const SurveyBuilder = () => {
  const [surveys, setSurveys] = useState([
    {
      id: '1',
      name: 'Post-Ticket CSAT',
      type: 'CSAT',
      description: 'Customer satisfaction survey sent after ticket resolution',
      channels: ['email', 'sms'],
      isActive: true,
      responses: 156,
      avgRating: 4.3
    },
    {
      id: '2',
      name: 'Chat Experience NPS',
      type: 'NPS',
      description: 'Net Promoter Score survey for chat interactions',
      channels: ['in-app', 'email'],
      isActive: true,
      responses: 89,
      avgRating: 7.8
    },
    {
      id: '3',
      name: 'Support Effort Score',
      type: 'CES',
      description: 'Customer Effort Score for support interactions',
      channels: ['email'],
      isActive: false,
      responses: 45,
      avgRating: 3.2
    }
  ]);

  const { toast } = useToast();

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <Smartphone className="w-3 h-3" />;
      case 'in-app': return <Monitor className="w-3 h-3" />;
      case 'chat': return <MessageSquare className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CSAT': return 'bg-blue-100 text-blue-800';
      case 'NPS': return 'bg-purple-100 text-purple-800';
      case 'CES': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateSurvey = () => {
    toast({
      title: "Survey Builder",
      description: "Survey creation modal would open here",
    });
  };

  const handleEditSurvey = (surveyId: string) => {
    toast({
      title: "Edit Survey",
      description: `Editing survey ${surveyId}`,
    });
  };

  const handleToggleSurvey = (surveyId: string) => {
    setSurveys(prev => prev.map(survey => 
      survey.id === surveyId 
        ? { ...survey, isActive: !survey.isActive }
        : survey
    ));
    
    const survey = surveys.find(s => s.id === surveyId);
    toast({
      title: survey?.isActive ? "Survey Deactivated" : "Survey Activated",
      description: `Survey "${survey?.name}" is now ${survey?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const handleDuplicateSurvey = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      const newSurvey = {
        ...survey,
        id: Date.now().toString(),
        name: `${survey.name} (Copy)`,
        isActive: false,
        responses: 0,
        avgRating: 0
      };
      setSurveys(prev => [...prev, newSurvey]);
      
      toast({
        title: "Survey Duplicated",
        description: `Created copy of "${survey.name}"`,
      });
    }
  };

  const handleDeleteSurvey = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    setSurveys(prev => prev.filter(s => s.id !== surveyId));
    
    toast({
      title: "Survey Deleted",
      description: `"${survey?.name}" has been deleted`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Survey Builder</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage customer satisfaction surveys
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateSurvey}>
          <Plus className="w-4 h-4 mr-2" />
          Create Survey
        </Button>
      </div>

      {/* Survey Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Start with pre-built survey templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={handleCreateSurvey}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <h4 className="font-medium">CSAT Survey</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                5-star rating with optional feedback
              </p>
              <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={handleCreateSurvey}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium">NPS Survey</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                0-10 scale with follow-up questions
              </p>
              <Badge variant="outline">Recommended</Badge>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={handleCreateSurvey}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-500" />
                <h4 className="font-medium">CES Survey</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Effort scale with efficiency questions
              </p>
              <Badge variant="outline">Quick Setup</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Surveys */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Surveys</CardTitle>
          <CardDescription>Manage your active and inactive surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{survey.name}</h4>
                        <Badge className={getTypeColor(survey.type)}>
                          {survey.type}
                        </Badge>
                        {survey.isActive && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{survey.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={survey.isActive}
                      onCheckedChange={() => handleToggleSurvey(survey.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditSurvey(survey.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDuplicateSurvey(survey.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteSurvey(survey.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Channels:</span>
                      <div className="flex gap-1">
                        {survey.channels.map((channel, index) => (
                          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                            {getChannelIcon(channel)}
                            <span className="capitalize">{channel.replace('-', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Responses</p>
                      <p className="font-medium">{survey.responses}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Avg Rating</p>
                      <p className="font-medium">{survey.avgRating}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
