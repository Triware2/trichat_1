
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
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

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
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
