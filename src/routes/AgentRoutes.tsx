import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrialGuard } from '@/components/TrialGuard';
import { TrialBanner } from '@/components/TrialBanner';
import AgentDashboard from '@/pages/AgentDashboard';

export const AgentRoutes = () => (
  <>
    <Route 
      path="/agent" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/active-chat/:chatId" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/active-chat" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/all-chats" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/contacts" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/customer-360" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/settings" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agent/profile" 
      element={
        <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
          <TrialGuard>
            <TrialBanner />
            <AgentDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
  </>
);
