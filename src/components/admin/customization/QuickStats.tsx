
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Database, Code, Key, Cloud } from 'lucide-react';

export const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Themes</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <Palette className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Custom Objects</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Scripts</p>
              <p className="text-2xl font-bold">15</p>
            </div>
            <Code className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API Endpoints</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <Key className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-indigo-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sandbox Envs</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <Cloud className="w-8 h-8 text-indigo-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
