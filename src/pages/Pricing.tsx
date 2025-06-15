
import { PricingNavigation } from '@/components/pricing/PricingNavigation';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingCards } from '@/components/pricing/PricingCards';
import { FeatureComparison } from '@/components/pricing/FeatureComparison';
import { PricingCTA } from '@/components/pricing/PricingCTA';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      <PricingNavigation />
      <PricingHero />
      <PricingCards />
      <FeatureComparison />
      <PricingCTA />
    </div>
  );
};

export default Pricing;
