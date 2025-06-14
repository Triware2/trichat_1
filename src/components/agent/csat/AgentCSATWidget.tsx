
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare,
  Target,
  Award
} from 'lucide-react';

export const AgentCSATWidget = () => {
  const agentMetrics = {
    averageCSAT: 4.6,
    totalResponses: 89,
    responseRate: 72,
    npsScore: 54,
    sentimentBreakdown: {
      positive: 78,
      neutral: 16,
      negative: 6
    },
    improvement: {
      csat: '+0.3',
      responseRate: '+5%',
      nps: '+8'
    },
    strengths: [
      'Quick Response Time',
      'Technical Knowledge',
      'Problem Resolution'
    ],
    improvementAreas: [
      'Communication Clarity',
      'Follow-up Consistency'
    ]
  };

  const recentFeedback = [
    {
      rating: 5,
      feedback: 'Excellent service! Very knowledgeable and helpful.',
      customer: 'John S.',
      date: '2 hours ago',
      sentiment: 'positive'
    },
    {
      rating: 4,
      feedback: 'Good support, but took a while to get the full solution.',
      customer: 'Sarah M.',
      date: '1 day ago',
      sentiment: 'neutral'
    },
    {
      rating: 5,
      feedback: 'Amazing support! Solved my issue quickly.',
      customer: 'Mike R.',
      date: '2 days ago',
      sentiment: 'positive'
    }
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My CSAT Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{agentMetrics.averageCSAT}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {agentMetrics.improvement.csat}
                  </Badge>
                </div>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{agentMetrics.responseRate}%</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {agentMetrics.improvement.responseRate}
                  </Badge>
                </div>
              </div>
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">NPS Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{agentMetrics.npsScore}</p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    {agentMetrics.improvement.nps}
                  </Badge>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{agentMetrics.totalResponses}</p>
              </div>
              <Award className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Sentiment</CardTitle>
          <CardDescription>Breakdown of customer feedback sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Positive</span>
              </div>
              <span className="text-sm font-medium">{agentMetrics.sentimentBreakdown.positive}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${agentMetrics.sentimentBreakdown.positive}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Neutral</span>
              </div>
              <span className="text-sm font-medium">{agentMetrics.sentimentBreakdown.neutral}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${agentMetrics.sentimentBreakdown.neutral}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Negative</span>
              </div>
              <span className="text-sm font-medium">{agentMetrics.sentimentBreakdown.negative}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${agentMetrics.sentimentBreakdown.negative}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agentMetrics.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-600" />
              Improvement Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agentMetrics.improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Customer Feedback</CardTitle>
          <CardDescription>Latest reviews and comments about your service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {getRatingStars(feedback.rating)}
                    </div>
                    <Badge className={getSentimentColor(feedback.sentiment)}>
                      {feedback.sentiment}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">{feedback.date}</span>
                </div>
                <p className="text-sm text-gray-800 mb-2">"{feedback.feedback}"</p>
                <p className="text-xs text-gray-600">- {feedback.customer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
