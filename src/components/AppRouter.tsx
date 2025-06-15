
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { PublicRoutes } from '@/routes/PublicRoutes';
import { AdminRoutes } from '@/routes/AdminRoutes';
import { SupervisorRoutes } from '@/routes/SupervisorRoutes';
import { AgentRoutes } from '@/routes/AgentRoutes';
import { PlatformControlRoutes } from '@/routes/PlatformControlRoutes';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <PublicRoutes />
        <AdminRoutes />
        <SupervisorRoutes />
        <AgentRoutes />
        <PlatformControlRoutes />
      </Routes>
    </Router>
  );
};
