import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    todayTarget: '-',
    peakPerformance: '-',
    teamEfficiency: '-',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: chats, error: chatsError } = await supabase
          .from('chats')
          .select('id, status, closed_at, created_at');
        if (chatsError) throw new Error('Failed to fetch chats');
        const now = new Date();
        const todayStart = getStartOfDay(now);
        const weekStart = getStartOfWeek(now);
        // Today's metrics
        const chatsToday = chats.filter((c: any) => c.closed_at && new Date(c.closed_at) >= todayStart);
        const resolvedToday = chatsToday.filter((c: any) => c.status === 'resolved');
        const todayTarget = chatsToday.length > 0 ? ((resolvedToday.length / chatsToday.length) * 100).toFixed(1) : '-';
        // This week's metrics
        const chatsThisWeek = chats.filter((c: any) => c.closed_at && new Date(c.closed_at) >= weekStart);
        // Group by day and find peak
        const dayMap: { [key: string]: { total: number; resolved: number } } = {};
        chatsThisWeek.forEach((c: any) => {
          if (!c.closed_at) return;
          const day = getStartOfDay(new Date(c.closed_at)).toISOString();
          if (!dayMap[day]) dayMap[day] = { total: 0, resolved: 0 };
          dayMap[day].total++;
          if (c.status === 'resolved') dayMap[day].resolved++;
        });
        let peak = 0;
        Object.values(dayMap).forEach((d) => {
          if (d.total > 0) {
            const rate = (d.resolved / d.total) * 100;
            if (rate > peak) peak = rate;
          }
        });
        const peakPerformance = peak > 0 ? peak.toFixed(1) : '-';
        // Team efficiency (all time)
        const resolvedAll = chats.filter((c: any) => c.status === 'resolved');
        const teamEfficiency = chats.length > 0 ? ((resolvedAll.length / chats.length) * 100).toFixed(1) : '-';
        setMetrics({
          todayTarget,
          peakPerformance,
          teamEfficiency,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch performance metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardContent className="p-6 text-center">Loading performance metrics...</CardContent></Card></div>;
  }
  if (error) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardContent className="p-6 text-center text-red-600">{error}</CardContent></Card></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border border-emerald-200 bg-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-800 text-xs font-medium tracking-wide uppercase">Today's Target</p>
              <p className="text-xl font-semibold text-emerald-900 tracking-tight">{metrics.todayTarget}%</p>
              <p className="text-emerald-700 text-xs">Resolution Rate</p>
            </div>
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 text-xs font-medium tracking-wide uppercase">Peak Performance</p>
              <p className="text-xl font-semibold text-blue-900 tracking-tight">{metrics.peakPerformance}%</p>
              <p className="text-blue-700 text-xs">This Week</p>
            </div>
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-800 text-xs font-medium tracking-wide uppercase">Team Efficiency</p>
              <p className="text-xl font-semibold text-purple-900 tracking-tight">{metrics.teamEfficiency}%</p>
              <p className="text-purple-700 text-xs">Above Baseline</p>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
