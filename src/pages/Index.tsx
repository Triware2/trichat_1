
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFavicon } from '@/hooks/use-favicon';
import { LandingNavigation } from '@/components/landing/LandingNavigation';
import { LandingHero } from '@/components/landing/LandingHero';
import { CoreFeaturesSection } from '@/components/landing/CoreFeaturesSection';
import { DetailedFeaturesGrid } from '@/components/landing/DetailedFeaturesGrid';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useFavicon('landing');

  console.log('Index page rendering - User:', user, 'Loading:', loading);

  useEffect(() => {
    console.log('Index useEffect - User:', user, 'Loading:', loading);
    if (!loading && user) {
      console.log('Redirecting to admin dashboard');
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation />
      <LandingHero />
      <CoreFeaturesSection />
      <DetailedFeaturesGrid />
      <UseCasesSection />
      <TestimonialsSection />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

export default Index;
