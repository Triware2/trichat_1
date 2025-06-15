
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Award className="w-3 h-3 mr-1" />
              Trusted by 10,000+ businesses worldwide
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise-Grade <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customer Experience</span> Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your customer interactions with AI-powered chat management, real-time analytics, and seamless omnichannel support. Built for enterprise scale with uncompromising security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/solutions')}
              >
                View Solutions
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">SOC 2 compliant</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Live Chat Dashboard</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">247</div>
                    <div className="text-xs text-gray-500">Active Chats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-xs text-gray-500">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1.2s</div>
                    <div className="text-xs text-gray-500">Avg Response</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <Badge variant="outline" className="text-xs">Online</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating metrics */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-xs text-gray-600">Uptime</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border">
              <div className="text-2xl font-bold text-blue-600">&lt; 200ms</div>
              <div className="text-xs text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
