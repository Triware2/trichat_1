
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingNavigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trichat
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Button variant="ghost" onClick={() => navigate('/solutions')}>Solutions</Button>
              <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
              <Button variant="ghost" onClick={() => navigate('/documentation')}>Documentation</Button>
              <Button variant="ghost" onClick={() => navigate('/resources')}>Resources</Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
