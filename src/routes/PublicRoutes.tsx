import { Route } from 'react-router-dom';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import Solutions from '@/pages/Solutions';
import Pricing from '@/pages/Pricing';
import Documentation from '@/pages/Documentation';
import Resources from '@/pages/Resources';
import ByUseCase from '@/pages/solutions/ByUseCase';
import ByIndustry from '@/pages/solutions/ByIndustry';
import BySize from '@/pages/solutions/BySize';
import NotFound from '@/pages/NotFound';

export const PublicRoutes = () => (
  <>
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

    {/* Legacy routes redirects - keeping for backward compatibility */}
    <Route path="/solutions" element={<Solutions />} />
    <Route path="/solutions/by-usecase" element={<ByUseCase />} />
    <Route path="/solutions/by-industry" element={<ByIndustry />} />
    <Route path="/solutions/by-size" element={<BySize />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/documentation" element={<Documentation />} />
    <Route path="/resources" element={<Resources />} />

    <Route path="*" element={<NotFound />} />
  </>
);
