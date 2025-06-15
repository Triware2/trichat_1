
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Code, Plus } from 'lucide-react';

export const CustomizationHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Customization Studio
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Phase 3</Badge>
        </h1>
        <p className="text-gray-600 mt-2">
          Enterprise-grade customization platform with code editor, sandbox environments, and API management
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Code className="w-4 h-4 mr-2" />
          Developer Mode
        </Button>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Customization
        </Button>
      </div>
    </div>
  );
};
