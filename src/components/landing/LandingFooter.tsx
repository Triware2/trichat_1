
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Trichat</span>
            </div>
            <p className="text-gray-400">
              Enterprise-grade customer experience platform trusted by thousands of businesses worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => navigate('/solutions/by-usecase')}>By Use Case</button></li>
              <li><button onClick={() => navigate('/solutions/by-industry')}>By Industry</button></li>
              <li><button onClick={() => navigate('/solutions/by-size')}>By Organization Size</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => navigate('/documentation')}>Documentation</button></li>
              <li><button onClick={() => navigate('/pricing')}>Pricing</button></li>
              <li><button onClick={() => navigate('/resources')}>Resource Center</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Trichat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
