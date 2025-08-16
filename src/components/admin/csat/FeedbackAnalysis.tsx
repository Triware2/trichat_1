
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Users,
  Clock,
  Activity,
  Brain,
  Target
} from 'lucide-react';
import { csatService, CSATResponse, FeedbackTheme } from '@/services/csatService';

interface FeedbackAnalysisProps {
  onRefresh: () => void;
}

export const FeedbackAnalysis = ({ onRefresh }: FeedbackAnalysisProps) => {
  const [responses, setResponses] = useState<CSATResponse[]>([]);
  const [themes, setThemes] = useState<FeedbackTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [responsesData, themesData] = await Promise.all([
        csatService.getResponses({ startDate: getStartDate(timeRange) }),
        csatService.getFeedbackThemes(timeRange)
      ]);
      setResponses(responsesData);
      setThemes(themesData);
    } catch (error) {
      console.error('Failed to load feedback data:', error);
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

  const handleExport = async () => {
    try {
      const exportData = await csatService.exportResponses({
        startDate: getStartDate(timeRange),
        endDate: new Date().toISOString().split('T')[0],
        sentiment: sentimentFilter === 'all' ? undefined : sentimentFilter
      });

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `csat-feedback-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
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

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = !searchTerm || 
      response.feedback_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.channel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSentiment = sentimentFilter === 'all' || response.sentiment === sentimentFilter;
    
    return matchesSearch && matchesSentiment;
  });

  const sentimentStats = {
    positive: responses.filter(r => r.sentiment === 'positive').length,
    neutral: responses.filter(r => r.sentiment === 'neutral').length,
    negative: responses.filter(r => r.sentiment === 'negative').length,
    total: responses.length
  };

  return (
    <div className="space-y-8">
      {/* AWS-style neutral header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
              Feedback Analysis
            </h2>
            <p className="text-sm text-slate-600 mt-1">Analyze customer feedback and sentiment trends</p>
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
            <Button onClick={handleExport} variant="outline" size="sm" className="bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Sentiment Overview - AWS-like cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {sentimentStats.positive}
              </p>
              <p className="text-sm text-slate-600">Positive</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Minus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {sentimentStats.neutral}
              </p>
              <p className="text-sm text-slate-600">Neutral</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ThumbsDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {sentimentStats.negative}
              </p>
              <p className="text-sm text-slate-600">Negative</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Themes - AWS-like panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Feedback Themes
                </h3>
                <p className="text-sm text-slate-600">Most common themes in customer feedback</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {themes.length} themes
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
                  <p className="text-sm text-slate-500">Loading themes...</p>
                </div>
              </div>
            ) : themes.length > 0 ? (
              <div className="space-y-4">
                {themes.slice(0, 5).map((theme, index) => (
                  <div key={theme.theme} className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                          theme.sentiment === 'positive' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                          theme.sentiment === 'negative' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                           <span className="text-sm font-semibold text-white">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{theme.theme}</h4>
                          <p className="text-sm text-slate-500">{theme.count} mentions</p>
                        </div>
                      </div>
                      {getSentimentBadge(theme.sentiment)}
                    </div>
                       {theme.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {theme.keywords.slice(0, 3).map((keyword, idx) => (
                          <span key={idx} className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            {keyword}
                          </span>
                        ))}
                        {theme.keywords.length > 3 && (
                          <span className="text-xs text-gray-500">+{theme.keywords.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500 font-medium">No themes found</p>
                <p className="text-sm text-slate-400 mt-1">Feedback themes will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Responses - AWS-like panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Responses
                </h3>
                <p className="text-sm text-slate-600">Latest customer feedback</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search responses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 bg-white border-slate-300 focus:border-slate-400"
                />
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger className="w-32 bg-white border-slate-300 hover:border-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  </div>
                  <p className="text-sm text-slate-500">Loading responses...</p>
                </div>
              </div>
            ) : filteredResponses.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredResponses.slice(0, 10).map((response) => (
                  <div key={response.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                        response.sentiment === 'positive' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        response.sentiment === 'negative' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                        'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {getSentimentIcon(response.sentiment)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            {getRatingStars(response.overall_rating)}
                            <span className="text-sm font-medium text-slate-900 ml-2">
                              {response.overall_rating}/5
                            </span>
                          </div>
                          {getSentimentBadge(response.sentiment)}
                          <Badge variant="outline" className="backdrop-blur-sm bg-white/80 border-white/30">
                            {response.channel}
                          </Badge>
                        </div>
                        {response.feedback_text && (
                          <p className="text-sm text-slate-700 mb-2">{response.feedback_text}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(response.submitted_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(response.submitted_at).toLocaleTimeString()}
                          </div>
                          {response.themes?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              {response.themes.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500 font-medium">No responses found</p>
                <p className="text-sm text-slate-400 mt-1">Customer responses will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
