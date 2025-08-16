
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrialGuard } from '@/components/TrialGuard';
import { TrialBanner } from '@/components/TrialBanner';
import SupervisorDashboard from '@/pages/SupervisorDashboard';

export const SupervisorRoutes = () => (
  <>
    <Route 
      path="/supervisor" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/chat-supervision" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/team-monitor" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/team-settings" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/queue-management" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/reports" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/profile" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/supervisor/settings" 
      element={
        <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <SupervisorDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
  </>
);
