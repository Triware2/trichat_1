import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { SubscriptionProvider } from '@/hooks/use-subscription';
import { TrialGuard } from '@/components/TrialGuard';
import { TrialBanner } from '@/components/TrialBanner';
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
        <SubscriptionProvider>
          <Router>
            <Routes>
              {/* Landing Page Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/lp/solutions" element={<Solutions />} />
              <Route path="/lp/solutions/by-usecase" element={<ByUseCase />} />
              <Route path="/lp/solutions/by-industry" element={<ByIndustry />} />
              <Route path="/lp/solutions/by-size" element={<BySize />} />
              <Route path="/lp/pricing" element={<Pricing />} />
              <Route path="/lp/documentation" element={<Documentation />} />
              <Route path="/lp/resources" element={<Resources />} />
              
              {/* Admin Routes */}
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

              {/* Supervisor Routes */}
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

              {/* Agent Routes */}
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

              {/* Platform Control Routes */}
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

              {/* Legacy routes redirects - keeping for backward compatibility */}
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/by-usecase" element={<ByUseCase />} />
              <Route path="/solutions/by-industry" element={<ByIndustry />} />
              <Route path="/solutions/by-size" element={<BySize />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/resources" element={<Resources />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
