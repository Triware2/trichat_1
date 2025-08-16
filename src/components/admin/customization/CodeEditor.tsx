
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScriptStats } from './code-editor/ScriptStats';
import { CreateScriptDialog } from './code-editor/CreateScriptDialog';
import { ScriptsList } from './code-editor/ScriptsList';
import { CustomScript, NewScript } from './code-editor/types';
import { useEffect } from 'react';
import { customizationService } from '@/services/customizationService';

export const CodeEditor = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [customScripts, setCustomScripts] = useState<CustomScript[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await customizationService.listScripts();
      const mapped: CustomScript[] = (list || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        language: s.language,
        trigger: s.trigger,
        code: s.code,
        status: s.status,
        lastRun: s.updated_at || 'recently',
        executions: s.executions || 0,
        environment: s.environment || 'production'
      }));
      setCustomScripts(mapped);
    };
    load();
  }, []);

  const handleCreateScript = async (newScript: NewScript) => {
    const created = await customizationService.createScript({
      name: newScript.name,
      description: newScript.description,
      language: newScript.language,
      trigger: newScript.trigger,
      code: newScript.code,
      environment: 'production'
    });
    if (created) {
      setCustomScripts(prev => [{
        id: created.id,
        name: created.name,
        description: created.description,
        language: created.language,
        trigger: created.trigger,
        code: created.code,
        status: created.status,
        lastRun: created.updated_at,
        executions: created.executions || 0,
        environment: created.environment
      }, ...prev]);
    }
    toast({ title: 'Script Created', description: `${newScript.name} has been created successfully.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Code Editor & Script Management</h2>
          <p className="text-gray-600">Create and manage custom scripts for advanced automation</p>
        </div>
        <div className="flex gap-2">
          <CreateScriptDialog 
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onCreateScript={handleCreateScript}
          />
        </div>
      </div>

      <ScriptStats scripts={customScripts} />
      <ScriptsList scripts={customScripts} />
    </div>
  );
};
