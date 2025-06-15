
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import Solutions from '@/pages/Solutions';
import Pricing from '@/pages/Pricing';
import Documentation from '@/pages/Documentation';
import Resources from '@/pages/Resources';
import ByUseCase from '@/pages/solutions/ByUseCase';
import ByIndustry from '@/pages/solutions/ByIndustry';
import BySize from '@/pages/solutions/BySize';
import AgentDashboard from '@/pages/AgentDashboard';
import SupervisorDashboard from '@/pages/SupervisorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import PlatformControl from '@/pages/PlatformControl';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/by-usecase" element={<ByUseCase />} />
            <Route path="/solutions/by-industry" element={<ByIndustry />} />
            <Route path="/solutions/by-size" element={<BySize />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/resources" element={<Resources />} />
            
            {/* Protected Routes */}
            <Route 
              path="/agent" 
              element={
                <ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisor" 
              element={
                <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                  <SupervisorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/control" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PlatformControl />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
