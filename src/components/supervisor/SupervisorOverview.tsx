
import { SupervisorStats } from './SupervisorStats';
import { AgentPerformanceCard } from './AgentPerformanceCard';
import { SystemAlertsCard } from './SystemAlertsCard';
import { PerformanceMetrics } from './PerformanceMetrics';
import { SupervisorCSATOverview } from './SupervisorCSATOverview';

export const SupervisorOverview = () => {
  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <SupervisorStats />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Team Performance */}
        <AgentPerformanceCard />

        {/* Alerts */}
        <SystemAlertsCard />
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics />

      {/* CSAT Overview */}
      <SupervisorCSATOverview />
    </div>
  );
};
