
import { AnalyticsKPICards } from './components/AnalyticsKPICards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { BotPerformanceTable } from './components/BotPerformanceTable';

export const ChatbotAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Chatbot Analytics & Performance</h2>
        <p className="text-gray-600 mt-1">Monitor resolution rates, user satisfaction, and bot effectiveness</p>
      </div>

      {/* KPI Cards */}
      <AnalyticsKPICards />

      {/* Charts Section */}
      <AnalyticsCharts />

      {/* Bot Performance Table */}
      <BotPerformanceTable />
    </div>
  );
};
