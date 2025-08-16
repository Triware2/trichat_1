
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrialGuard } from '@/components/TrialGuard';
import { TrialBanner } from '@/components/TrialBanner';
import AdminDashboard from '@/pages/AdminDashboard';

export const AdminRoutes = () => (
  <>
    <Route 
      path="/admin" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/user-management" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/access-control" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/chatbot-training" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/api-keys" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/sla" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/csat" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/analytics" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/widgets" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/data-sources" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/chat-management" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/customization" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/system-settings" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <TrialGuard>
            <TrialBanner />
            <AdminDashboard />
          </TrialGuard>
        </ProtectedRoute>
      } 
    />

  </>
);
