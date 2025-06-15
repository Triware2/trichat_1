
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Start with our free plan or try any paid plan with a 14-day free trial.
        </p>
        
        <Button 
          size="lg" 
          variant="secondary"
          onClick={() => navigate('/auth')}
        >
          Get Started Now
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
