
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Play } from 'lucide-react';
import { NewScript } from './types';

interface CreateScriptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateScript: (script: NewScript) => void;
}

export const CreateScriptDialog = ({ isOpen, onOpenChange, onCreateScript }: CreateScriptDialogProps) => {
  const { toast } = useToast();
  const [newScript, setNewScript] = useState<NewScript>({
    name: '',
    description: '',
    language: 'javascript',
    trigger: 'manual',
    code: ''
  });

  const handleCreateScript = () => {
    if (!newScript.name || !newScript.code) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onCreateScript(newScript);
    onOpenChange(false);
    setNewScript({
      name: '',
      description: '',
      language: 'javascript',
      trigger: 'manual',
      code: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Script
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Script</DialogTitle>
          <DialogDescription>
            Write custom code to extend platform functionality
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                value={newScript.name}
                onChange={(e) => setNewScript({...newScript, name: e.target.value})}
                placeholder="e.g., Data Validator"
              />
            </div>
            
            <div>
              <Label htmlFor="script-language">Language</Label>
              <Select value={newScript.language} onValueChange={(value: any) => setNewScript({...newScript, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="script-description">Description</Label>
            <Input
              id="script-description"
              value={newScript.description}
              onChange={(e) => setNewScript({...newScript, description: e.target.value})}
              placeholder="Brief description of the script functionality"
            />
          </div>

          <div>
            <Label htmlFor="script-trigger">Trigger Type</Label>
            <Select value={newScript.trigger} onValueChange={(value: any) => setNewScript({...newScript, trigger: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="event">Event-driven</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="script-code">Code</Label>
            <Textarea
              id="script-code"
              value={newScript.code}
              onChange={(e) => setNewScript({...newScript, code: e.target.value})}
              placeholder="// Write your custom code here..."
              className="font-mono text-sm h-64"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateScript} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Create Script
            </Button>
            <Button variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Test Run
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
