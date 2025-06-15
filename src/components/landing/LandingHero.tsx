
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-8 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Transform Customer Experience with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Chat
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Connect with customers instantly across all channels. Boost satisfaction, increase sales, 
            and scale your support with intelligent automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600 mb-8 sm:mb-12 px-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>24/7 support included</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-sm sm:text-base text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm sm:text-base text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">50M+</div>
              <div className="text-sm sm:text-base text-gray-600">Messages Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">24/7</div>
              <div className="text-sm sm:text-base text-gray-600">Global Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
