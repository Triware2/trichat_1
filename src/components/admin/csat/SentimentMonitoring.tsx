
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Star,
  Calendar,
  Download,
  BarChart3,
  Activity,
  Target,
  Users,
  Clock,
  Brain,
  ThumbsUp,
  ThumbsDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { csatService, CSATResponse, CSATMetrics } from '@/services/csatService';

interface SentimentMonitoringProps {
  csatMetrics: CSATMetrics | null;
  onRefresh: () => void;
}

export const SentimentMonitoring = ({ csatMetrics, onRefresh }: SentimentMonitoringProps) => {
  const [responses, setResponses] = useState<CSATResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [sentimentFilter, setSentimentFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const responsesData = await csatService.getResponses({ startDate: getStartDate(timeRange) });
      setResponses(responsesData);
    } catch (error) {
      console.error('Failed to load sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range: string): string => {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting sentiment monitoring data...');
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-emerald-600" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Positive</Badge>;
      case 'negative':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Negative</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Neutral</Badge>;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-emerald-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const filteredResponses = responses.filter(response => {
    return sentimentFilter === 'all' || response.sentiment === sentimentFilter;
  });

  const sentimentStats = {
    positive: responses.filter(r => r.sentiment === 'positive').length,
    neutral: responses.filter(r => r.sentiment === 'neutral').length,
    negative: responses.filter(r => r.sentiment === 'negative').length,
    total: responses.length
  };

  const averageRating = responses.length > 0 
    ? responses.reduce((sum, r) => sum + r.overall_rating, 0) / responses.length 
    : 0;

  const sentimentTrend = {
    positive: +5.2, // Mock trend data
    neutral: -1.8,
    negative: -3.4,
    overall: +2.1
  };

  return (
    <div className="space-y-8">
      {/* AWS-style neutral header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
              Sentiment Monitoring
            </h2>
            <p className="text-sm text-slate-600 mt-1">Track customer sentiment trends and patterns</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white border-slate-300 hover:border-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-40 bg-white border-slate-300 hover:border-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Trends - AWS-like panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Sentiment Trends
                </h3>
                <p className="text-sm text-slate-600">Customer sentiment over time</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredResponses.length} responses
              </Badge>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  </div>
                  <p className="text-sm text-slate-500">Loading sentiment data...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-900">Positive</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">
                      {sentimentStats.positive} ({((sentimentStats.positive / sentimentStats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sentimentStats.positive / sentimentStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-900">Neutral</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600">
                      {sentimentStats.neutral} ({((sentimentStats.neutral / sentimentStats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sentimentStats.neutral / sentimentStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-900">Negative</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">
                      {sentimentStats.negative} ({((sentimentStats.negative / sentimentStats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sentimentStats.negative / sentimentStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Response Analysis - AWS-like panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Response Analysis
                </h3>
                <p className="text-sm text-slate-600">Detailed response breakdown</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {filteredResponses.length} total
              </Badge>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  </div>
                  <p className="text-sm text-slate-500">Loading response data...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Total Responses</p>
                        <p className="text-sm text-slate-500">All feedback received</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                        {sentimentStats.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Average Rating</p>
                        <p className="text-sm text-slate-500">Overall satisfaction score</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                        {averageRating.toFixed(1)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(averageRating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Response Rate</p>
                        <p className="text-sm text-slate-500">Engagement percentage</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                        {sentimentStats.total > 0 ? ((sentimentStats.positive / sentimentStats.total) * 100).toFixed(1) : '0'}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity - AWS-like panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Activity
              </h3>
              <p className="text-sm text-slate-600">Latest sentiment changes and trends</p>
            </div>
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
              Live updates
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredResponses.slice(0, 5).map((response) => (
              <div key={response.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                      response.sentiment === 'positive' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                      response.sentiment === 'negative' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                      'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      {getSentimentIcon(response.sentiment)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {response.sentiment.charAt(0).toUpperCase() + response.sentiment.slice(1)} feedback received
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(response.submitted_at).toLocaleDateString()} at {new Date(response.submitted_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {getRatingStars(response.overall_rating)}
                      <span className="text-sm font-medium text-slate-900">
                        {response.overall_rating}/5
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{response.channel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
