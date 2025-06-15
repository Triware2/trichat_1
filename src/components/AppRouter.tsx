
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import Solutions from '@/pages/Solutions';
import Pricing from '@/pages/Pricing';
import Documentation from '@/pages/Documentation';
import Resources from '@/pages/Resources';
import AuditDashboard from '@/pages/AuditDashboard';
import ByUseCase from '@/pages/solutions/ByUseCase';
import ByIndustry from '@/pages/solutions/ByIndustry';
import BySize from '@/pages/solutions/BySize';
import NotFound from '@/pages/NotFound';
import AdminDashboard from '@/pages/AdminDashboard';
import SupervisorDashboard from '@/pages/SupervisorDashboard';
import AgentDashboard from '@/pages/AgentDashboard';
import PlatformControl from '@/pages/PlatformControl';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrialGuard } from '@/components/TrialGuard';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/lp/solutions" element={<Solutions />} />
        <Route path="/lp/solutions/by-usecase" element={<ByUseCase />} />
        <Route path="/lp/solutions/by-industry" element={<ByIndustry />} />
        <Route path="/lp/solutions/by-size" element={<BySize />} />
        <Route path="/lp/pricing" element={<Pricing />} />
        <Route path="/lp/documentation" element={<Documentation />} />
        <Route path="/lp/resources" element={<Resources />} />

        {/* Legacy routes redirects - keeping for backward compatibility */}
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/solutions/by-usecase" element={<ByUseCase />} />
        <Route path="/solutions/by-industry" element={<ByIndustry />} />
        <Route path="/solutions/by-size" element={<BySize />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/resources" element={<Resources />} />

        {/* Audit Dashboard Route */}
        <Route 
          path="/audit" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuditDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TrialGuard>
                <AdminDashboard />
              </TrialGuard>
            </ProtectedRoute>
          } 
        />

        {/* Protected Supervisor Routes */}
        <Route 
          path="/supervisor/*" 
          element={
            <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
              <TrialGuard>
                <SupervisorDashboard />
              </TrialGuard>
            </ProtectedRoute>
          } 
        />

        {/* Protected Agent Routes */}
        <Route 
          path="/agent/*" 
          element={
            <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
              <TrialGuard>
                <AgentDashboard />
              </TrialGuard>
            </ProtectedRoute>
          } 
        />

        {/* Protected Platform Control Routes */}
        <Route 
          path="/platform-control/*" 
          element={
            <ProtectedRoute allowedRoles={['platform_admin']}>
              <TrialGuard>
                <PlatformControl />
              </TrialGuard>
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
