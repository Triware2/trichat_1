
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrialGuard } from '@/components/TrialGuard';
import { TrialBanner } from '@/components/TrialBanner';
import PlatformControl from '@/pages/PlatformControl';

export const PlatformControlRoutes = () => (
  <Route 
    path="/control" 
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <TrialGuard>
          <TrialBanner />
          <PlatformControl />
        </TrialGuard>
      </ProtectedRoute>
    } 
  />
);
