
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to transform your customer experience?
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Join thousands of companies that trust Trichat to deliver exceptional customer experiences at scale.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            onClick={() => navigate('/pricing')}
          >
            View Pricing
          </Button>
        </div>
      </div>
    </div>
  );
};
