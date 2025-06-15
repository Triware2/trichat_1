
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsCharts = () => {
  const monthlyData = [
    { month: 'Jan', total: 1200, resolved: 1020, escalated: 180, satisfaction: 4.2 },
    { month: 'Feb', total: 1400, resolved: 1260, escalated: 140, satisfaction: 4.3 },
    { month: 'Mar', total: 1800, resolved: 1620, escalated: 180, satisfaction: 4.1 },
    { month: 'Apr', total: 1600, resolved: 1456, escalated: 144, satisfaction: 4.4 },
    { month: 'May', total: 2000, resolved: 1880, escalated: 120, satisfaction: 4.5 },
    { month: 'Jun', total: 2200, resolved: 2068, escalated: 132, satisfaction: 4.6 }
  ];

  const resolutionData = [
    { name: 'Auto-Resolved', value: 68, color: '#10B981' },
    { name: 'Escalated to Agent', value: 23, color: '#F59E0B' },
    { name: 'Customer Left', value: 9, color: '#EF4444' }
  ];

  return (
    <>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <CardTitle className="text-lg font-semibold text-gray-900">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" name="Total Conversations" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved by Bot" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <CardTitle className="text-lg font-semibold text-gray-900">Resolution Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resolutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction Trend */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
          <CardTitle className="text-lg font-semibold text-gray-900">Customer Satisfaction Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3.5, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Satisfaction Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};
