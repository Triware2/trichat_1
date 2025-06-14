
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageSquare, Mail, Phone, Star, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';

interface InteractionTimelineItem {
  date: string;
  type: 'chat' | 'email' | 'phone';
  subject: string;
  agent: string;
  duration: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  resolution: string;
  satisfaction: number;
}

interface InteractionsTabProps {
  interactionTimeline: InteractionTimelineItem[];
}

export const InteractionsTab = ({ interactionTimeline }: InteractionsTabProps) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    const className = statusColors[status as keyof typeof statusColors] || statusColors.Pending;
    return <Badge variant="outline" className={className}>{status}</Badge>;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-emerald-500" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default: return <Eye className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Interaction Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Recent Interactions Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interactionTimeline.map((interaction, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0">
                {interaction.type === 'chat' && <MessageSquare className="w-6 h-6 text-blue-500" />}
                {interaction.type === 'email' && <Mail className="w-6 h-6 text-green-500" />}
                {interaction.type === 'phone' && <Phone className="w-6 h-6 text-purple-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-900">{interaction.subject}</h4>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(interaction.sentiment)}
                    {getStatusBadge(interaction.resolution)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>{interaction.date}</span>
                  <span>Agent: {interaction.agent}</span>
                  <span>Duration: {interaction.duration}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{interaction.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
