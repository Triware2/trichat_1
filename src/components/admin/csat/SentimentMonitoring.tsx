
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Bell
} from 'lucide-react';

export const SentimentMonitoring = () => {
  const sentimentAlerts = [
    {
      id: '1',
      type: 'negative_trend',
      severity: 'high',
      title: 'Declining Sentiment in Technical Support',
      description: 'Customer sentiment has dropped 15% in the last 7 days',
      affectedCustomers: 23,
      department: 'Technical Support',
      timestamp: '2 hours ago',
      action: 'Review recent interactions'
    },
    {
      id: '2',
      type: 'angry_customer',
      severity: 'critical',
      title: 'Highly Negative Customer Detected',
      description: 'Customer John Smith expressing extreme frustration',
      affectedCustomers: 1,
      department: 'Billing',
      timestamp: '15 minutes ago',
      action: 'Immediate escalation required'
    },
    {
      id: '3',
      type: 'positive_spike',
      severity: 'low',
      title: 'Positive Sentiment Increase',
      description: 'Sales team showing 20% improvement in customer satisfaction',
      affectedCustomers: 45,
      department: 'Sales',
      timestamp: '1 day ago',
      action: 'Analyze success factors'
    }
  ];

  const realtimeMonitoring = [
    {
      id: '1',
      customer: 'Alice Johnson',
      agent: 'Sarah Johnson',
      channel: 'Chat',
      sentiment: 'positive',
      confidence: 0.89,
      lastMessage: 'Thank you so much for your help! This solved my problem perfectly.',
      timestamp: '2 minutes ago',
      escalated: false
    },
    {
      id: '2',
      customer: 'Bob Wilson',
      agent: 'Mike Chen',
      channel: 'Email',
      sentiment: 'negative',
      confidence: 0.92,
      lastMessage: 'This is the third time I am contacting you about this issue. Very disappointed.',
      timestamp: '5 minutes ago',
      escalated: true
    },
    {
      id: '3',
      customer: 'Carol Davis',
      agent: 'Emily Rodriguez',
      channel: 'Chat',
      sentiment: 'neutral',
      confidence: 0.76,
      lastMessage: 'I understand the process now, but it seems quite complicated.',
      timestamp: '8 minutes ago',
      escalated: false
    }
  ];

  const sentimentTrends = [
    { timeframe: 'Last Hour', positive: 72, neutral: 18, negative: 10 },
    { timeframe: 'Last 4 Hours', positive: 68, neutral: 22, negative: 10 },
    { timeframe: 'Last 24 Hours', positive: 65, neutral: 25, negative: 10 },
    { timeframe: 'Last Week', positive: 70, neutral: 20, negative: 10 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😤';
      default: return '😐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Positive Sentiment</p>
                <p className="text-2xl font-bold text-green-600">72%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+5% from yesterday</span>
                </div>
              </div>
              <div className="text-2xl">😊</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Neutral Sentiment</p>
                <p className="text-2xl font-bold text-yellow-600">18%</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-600">-2% from yesterday</span>
                </div>
              </div>
              <div className="text-2xl">😐</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Negative Sentiment</p>
                <p className="text-2xl font-bold text-red-600">10%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600">-3% from yesterday</span>
                </div>
              </div>
              <div className="text-2xl">😤</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
                <div className="flex items-center gap-1 mt-1">
                  <Bell className="w-3 h-3 text-orange-600" />
                  <span className="text-xs text-orange-600">1 critical</span>
                </div>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Sentiment Alerts
          </CardTitle>
          <CardDescription>Real-time alerts based on sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{alert.department}</span>
                        <span>{alert.affectedCustomers} customers</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Real-time Sentiment Monitoring
          </CardTitle>
          <CardDescription>Live sentiment analysis of ongoing interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realtimeMonitoring.map((interaction) => (
              <div key={interaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-lg">
                      {getSentimentIcon(interaction.sentiment)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{interaction.customer}</h4>
                        <Badge className={getSentimentColor(interaction.sentiment)}>
                          {interaction.sentiment}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(interaction.confidence * 100)}% confidence
                        </Badge>
                        {interaction.escalated && (
                          <Badge className="bg-red-100 text-red-800">Escalated</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Agent: {interaction.agent} • {interaction.channel} • {interaction.timestamp}
                      </p>
                      <p className="text-sm text-gray-800 italic">
                        "{interaction.lastMessage}"
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
          <CardDescription>Sentiment distribution over different time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sentimentTrends.map((trend, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{trend.timeframe}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">{trend.positive}% Positive</span>
                    <span className="text-yellow-600">{trend.neutral}% Neutral</span>
                    <span className="text-red-600">{trend.negative}% Negative</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                  <div 
                    className="bg-green-500 h-3"
                    style={{ width: `${trend.positive}%` }}
                  />
                  <div 
                    className="bg-yellow-500 h-3"
                    style={{ width: `${trend.neutral}%` }}
                  />
                  <div 
                    className="bg-red-500 h-3"
                    style={{ width: `${trend.negative}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
