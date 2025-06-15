
import { Button } from '@/components/ui/button';
import { MessageSquare, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const LandingNavigation = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trichat
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8">
              <Button variant="ghost" onClick={() => navigate('/solutions')}>Solutions</Button>
              <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
              <Button variant="ghost" onClick={() => navigate('/documentation')}>Documentation</Button>
              <Button variant="ghost" onClick={() => navigate('/resources')}>Resources</Button>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/solutions');
                  setIsMobileMenuOpen(false);
                }}
              >
                Solutions
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/pricing');
                  setIsMobileMenuOpen(false);
                }}
              >
                Pricing
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/documentation');
                  setIsMobileMenuOpen(false);
                }}
              >
                Documentation
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/resources');
                  setIsMobileMenuOpen(false);
                }}
              >
                Resources
              </Button>
              <div className="pt-4 space-y-2 md:hidden">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
