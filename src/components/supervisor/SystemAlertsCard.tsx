import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemAlert {
  id: string;
  title: string;
  message: string;
  created_at: string;
  severity?: string;
}

export const SystemAlertsCard = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('id, title, message, created_at, data')
          .eq('type', 'system_alert')
          .order('created_at', { ascending: false })
          .limit(5);
        if (fetchError) throw new Error('Failed to fetch system alerts');
        // Map severity if present in data JSON
        const mapped = (data || []).map((alert: any) => ({
          id: alert.id,
          title: alert.title,
          message: alert.message,
          created_at: alert.created_at,
          severity: alert.data?.severity || 'medium',
        }));
        setAlerts(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch system alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-600';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-600';
      case 'low': return 'border-blue-500 bg-blue-50 text-blue-600';
      default: return 'border-gray-300 bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return <Card className="border border-gray-200"><CardContent className="p-6 text-center">Loading system alerts...</CardContent></Card>;
  }
  if (error) {
    return <Card className="border border-gray-200"><CardContent className="p-6 text-center text-red-600">{error}</CardContent></Card>;
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              System Alerts
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              Important notifications requiring attention
            </CardDescription>
          </div>
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-1">
            {alerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 && <div className="text-gray-500 text-sm">No active system alerts.</div>}
          {alerts.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getAlertColor(alert.severity || 'medium')} transition-all hover:shadow-sm`}>
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-700 mb-1">{alert.message}</p>
                <p className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
