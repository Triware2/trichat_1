
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileCode,
  CheckCircle,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { CustomScript } from './types';

interface ScriptStatsProps {
  scripts: CustomScript[];
}

export const ScriptStats = ({ scripts }: ScriptStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scripts</p>
              <p className="text-2xl font-bold">{scripts.length}</p>
            </div>
            <FileCode className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Scripts</p>
              <p className="text-2xl font-bold text-green-600">
                {scripts.filter(s => s.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold">
                {scripts.reduce((sum, s) => sum + s.executions, 0)}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Testing Scripts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {scripts.filter(s => s.status === 'testing').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
