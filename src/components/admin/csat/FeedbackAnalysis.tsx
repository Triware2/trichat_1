
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Eye,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Filter,
  Download
} from 'lucide-react';

export const FeedbackAnalysis = () => {
  const feedbackThemes = [
    {
      theme: 'Response Speed',
      count: 89,
      sentiment: 'positive',
      change: '+12%',
      keywords: ['fast', 'quick', 'prompt', 'immediate'],
      examples: [
        'Agent responded very quickly to my inquiry',
        'Fast resolution, very satisfied',
        'Quick turnaround time, great service'
      ]
    },
    {
      theme: 'Agent Knowledge',
      count: 67,
      sentiment: 'positive',
      change: '+8%',
      keywords: ['knowledgeable', 'expert', 'helpful', 'experienced'],
      examples: [
        'Agent was very knowledgeable about the product',
        'Expert guidance helped solve my issue',
        'Professional and well-informed support'
      ]
    },
    {
      theme: 'Communication',
      count: 45,
      sentiment: 'neutral',
      change: '-3%',
      keywords: ['unclear', 'confusing', 'complicated', 'jargon'],
      examples: [
        'Could use clearer explanations',
        'Too much technical jargon',
        'Instructions were somewhat confusing'
      ]
    },
    {
      theme: 'Wait Time',
      count: 34,
      sentiment: 'negative',
      change: '-15%',
      keywords: ['slow', 'waiting', 'delayed', 'long'],
      examples: [
        'Had to wait too long for response',
        'Very slow initial response time',
        'Waited over an hour for help'
      ]
    }
  ];

  const recentFeedback = [
    {
      id: '1',
      customer: 'John Smith',
      rating: 5,
      sentiment: 'positive',
      feedback: 'Excellent service! The agent was very helpful and resolved my issue quickly.',
      agent: 'Sarah Johnson',
      department: 'Technical Support',
      date: '2024-01-15',
      themes: ['Response Speed', 'Agent Knowledge']
    },
    {
      id: '2',
      customer: 'Emily Davis',
      rating: 3,
      sentiment: 'neutral',
      feedback: 'The issue was resolved but it took longer than expected. Agent could have been more proactive.',
      agent: 'Mike Chen',
      department: 'Billing',
      date: '2024-01-15',
      themes: ['Wait Time', 'Communication']
    },
    {
      id: '3',
      customer: 'David Wilson',
      rating: 4,
      sentiment: 'positive',
      feedback: 'Good service overall. Agent was knowledgeable but explanation could be clearer.',
      agent: 'Lisa Wang',
      department: 'General Support',
      date: '2024-01-14',
      themes: ['Agent Knowledge', 'Communication']
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTrendIcon = (change: string) => {
    const isPositive = change.startsWith('+');
    const isNegative = change.startsWith('-');
    
    if (isPositive) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (isNegative) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option value="all">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Analysis
        </Button>
      </div>

      {/* Feedback Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Themes Analysis</CardTitle>
          <CardDescription>
            Common themes extracted from customer feedback using NLP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {feedbackThemes.map((theme, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(theme.sentiment)}
                      <h4 className="font-medium text-gray-900">{theme.theme}</h4>
                    </div>
                    <Badge className={getSentimentColor(theme.sentiment)}>
                      {theme.sentiment}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{theme.count}</span>
                    <span className="text-sm text-gray-600">mentions</span>
                    {getTrendIcon(theme.change)}
                    <span className={`text-sm ${theme.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {theme.change}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Keywords</h5>
                    <div className="flex flex-wrap gap-1">
                      {theme.keywords.map((keyword, keywordIndex) => (
                        <Badge key={keywordIndex} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Example Feedback</h5>
                    <div className="space-y-1">
                      {theme.examples.slice(0, 2).map((example, exampleIndex) => (
                        <p key={exampleIndex} className="text-xs text-gray-600 italic">
                          "{example}"
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest customer feedback with sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{feedback.customer}</h4>
                        <div className="flex items-center">
                          {getRatingStars(feedback.rating)}
                        </div>
                        <Badge className={getSentimentColor(feedback.sentiment)}>
                          {feedback.sentiment}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {feedback.department} • {feedback.agent} • {feedback.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-800 italic">"{feedback.feedback}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Themes:</span>
                  {feedback.themes.map((theme, themeIndex) => (
                    <Badge key={themeIndex} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
