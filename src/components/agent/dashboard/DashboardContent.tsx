
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { Search, Filter, Star, TrendingUp, MessageSquare, Award } from 'lucide-react';
import { useState } from 'react';

interface DashboardContentProps {
  stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }>;
  chats: Array<{
    id: number;
    customer: string;
    lastMessage: string;
    time: string;
    status: string;
    unread: number;
    priority: string;
  }>;
  activities: Array<{
    customer: string;
    action: string;
    time: string;
    type: string;
  }>;
  onStatClick: (statTitle: string) => void;
  onQueueAction: (customer: string) => void;
}

export const DashboardContent = ({ 
  stats, 
  chats, 
  activities, 
  onStatClick, 
  onQueueAction 
}: DashboardContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleGlobalSearch = () => {
    if (searchQuery.trim()) {
      console.log('Global search for:', searchQuery);
      // Global search functionality would be implemented here
    }
  };

  // CSAT data for the agent
  const csatData = {
    averageCSAT: 4.6,
    totalResponses: 89,
    responseRate: 72,
    npsScore: 54,
    recentFeedback: [
      {
        rating: 5,
        feedback: 'Excellent service! Very knowledgeable and helpful.',
        customer: 'John S.',
        date: '2 hours ago'
      },
      {
        rating: 4,
        feedback: 'Good support, resolved my issue quickly.',
        customer: 'Sarah M.',
        date: '1 day ago'
      },
      {
        rating: 5,
        feedback: 'Amazing support! Solved my issue in minutes.',
        customer: 'Mike R.',
        date: '2 days ago'
      }
    ]
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <TabsContent value="dashboard" className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Global Search Section */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-500" />
              Global Search
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations, customers, tickets, or any content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleGlobalSearch()}
                />
              </div>
              <Button 
                onClick={handleGlobalSearch}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="px-4">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Search across all conversations, customer profiles, tickets, and knowledge base
            </p>
          </CardContent>
        </Card>

        <DashboardStats stats={stats} onStatClick={onStatClick} />

        {/* CSAT Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              My CSAT Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">CSAT Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{csatData.averageCSAT}</p>
                <Badge className="bg-green-100 text-green-800 text-xs mt-1">+0.3</Badge>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Response Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{csatData.responseRate}%</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">+5%</Badge>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">NPS Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{csatData.npsScore}</p>
                <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">+8</Badge>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Total Reviews</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{csatData.totalResponses}</p>
                <Badge className="bg-gray-100 text-gray-800 text-xs mt-1">This month</Badge>
              </div>
            </div>

            {/* Recent Feedback */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Customer Feedback</h4>
              <div className="space-y-3">
                {csatData.recentFeedback.map((feedback, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {getRatingStars(feedback.rating)}
                        </div>
                        <span className="text-xs text-gray-500">{feedback.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">"{feedback.feedback}"</p>
                    <p className="text-xs text-gray-600">- {feedback.customer}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <QueueStatus chats={chats} onQueueAction={onQueueAction} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </TabsContent>
  );
};
