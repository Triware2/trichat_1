
import { Badge } from '@/components/ui/badge';

export const PricingHero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From free forever to enterprise-grade features, find the right plan for your team size and needs.
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Badge className="bg-green-100 text-green-700">Free plan available</Badge>
            <Badge className="bg-blue-100 text-blue-700">14-day trial on paid plans</Badge>
            <Badge className="bg-purple-100 text-purple-700">No setup fees</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
