
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export const SystemAlertsCard = () => {
  const alerts = [
    {
      type: "High Queue",
      message: "Queue length exceeded threshold (20+)",
      time: "5 minutes ago",
      severity: "high",
      color: "border-red-500 bg-red-50",
      iconColor: "text-red-600"
    },
    {
      type: "Agent Offline",
      message: "John Smith went offline unexpectedly",
      time: "15 minutes ago",
      severity: "medium",
      color: "border-yellow-500 bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      type: "SLA Warning",
      message: "3 tickets approaching SLA deadline",
      time: "30 minutes ago",
      severity: "high",
      color: "border-red-500 bg-red-50",
      iconColor: "text-red-600"
    }
  ];

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
          {alerts.map((alert, index) => (
            <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${alert.color} transition-all hover:shadow-sm`}>
              <AlertTriangle className={`w-4 h-4 ${alert.iconColor} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 text-sm">{alert.type}</p>
                  <Badge variant="outline" className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-700 mb-1">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
