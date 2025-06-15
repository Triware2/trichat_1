
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Terminal, 
  Play, 
  FileCode,
  Copy,
  Download,
  Settings
} from 'lucide-react';
import { CustomScript } from './types';

interface ScriptsListProps {
  scripts: CustomScript[];
}

export const ScriptsList = ({ scripts }: ScriptsListProps) => {
  const { toast } = useToast();

  const handleRunScript = (scriptId: string, scriptName: string) => {
    toast({
      title: "Script Executed",
      description: `${scriptName} is running in the background.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'javascript': return 'bg-yellow-100 text-yellow-800';
      case 'typescript': return 'bg-blue-100 text-blue-800';
      case 'python': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Custom Scripts
        </CardTitle>
        <CardDescription>
          Manage your custom code and automation scripts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scripts.map((script) => (
            <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileCode className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{script.name}</h4>
                    <Badge className={getStatusColor(script.status)}>
                      {script.status}
                    </Badge>
                    <Badge variant="outline" className={getLanguageColor(script.language)}>
                      {script.language}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {script.trigger}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {script.environment}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{script.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{script.executions} executions</span>
                    <span>•</span>
                    <span>Last run {script.lastRun}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRunScript(script.id, script.name)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
