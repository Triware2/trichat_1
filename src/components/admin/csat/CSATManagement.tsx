
import { useState } from 'react';
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
  Bell
} from 'lucide-react';
import { SurveyBuilder } from './SurveyBuilder';
import { CSATDashboard } from './CSATDashboard';
import { FeedbackAnalysis } from './FeedbackAnalysis';
import { SentimentMonitoring } from './SentimentMonitoring';
import { CSATSettings } from './CSATSettings';
import { SurveyCreationModal } from './SurveyCreationModal';

export const CSATManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const csatStats = [
    {
      title: "Average CSAT",
      value: "4.3",
      change: "+0.2",
      icon: Star,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Response Rate",
      value: "67%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "NPS Score",
      value: "45",
      change: "+8",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Surveys",
      value: "12",
      change: "+3",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const handleCreateSurvey = () => {
    setCreateModalOpen(true);
  };

  const handleSurveyCreated = () => {
    // Survey created successfully, maybe refresh data or show notification
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">CSAT Management</h1>
          <p className="text-gray-600 mt-1">
            Manage customer satisfaction surveys and analyze feedback
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateSurvey}>
          <Plus className="w-4 h-4 mr-2" />
          Create Survey
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {csatStats.map((stat, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white border-b border-gray-200 -mx-6 px-6">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <div className="flex space-x-0 overflow-x-auto">
              <TabsTrigger
                value="dashboard"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'dashboard' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="surveys"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'surveys' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <MessageSquare className="w-4 h-4" />
                Survey Builder
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'analysis' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Eye className="w-4 h-4" />
                Feedback Analysis
              </TabsTrigger>
              <TabsTrigger
                value="sentiment"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'sentiment' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Brain className="w-4 h-4" />
                Sentiment Monitoring
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap
                  ${activeTab === 'settings' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <div className="px-6">
          <TabsContent value="dashboard" className="mt-0">
            <CSATDashboard />
          </TabsContent>

          <TabsContent value="surveys" className="mt-0">
            <SurveyBuilder />
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <FeedbackAnalysis />
          </TabsContent>

          <TabsContent value="sentiment" className="mt-0">
            <SentimentMonitoring />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <CSATSettings />
          </TabsContent>
        </div>
      </Tabs>

      <SurveyCreationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSurveyCreated={handleSurveyCreated}
      />
    </div>
  );
};
