import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  Brain, 
  Zap, 
  Shield, 
  Database,
  Save,
  X
} from 'lucide-react';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
  onSave: (config: any) => void;
  presetType: 'rule-based' | 'llm';
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border border-gray-200">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-600" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  presetType
}) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (key: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localConfig);
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        setLocalConfig(config);
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Configuration</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="text-xs">
              Modified
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Settings */}
        <CollapsibleSection title="Basic Settings" icon={Settings} defaultOpen>
          <div className="space-y-4">
            <div>
              <Label htmlFor="model">Model</Label>
              <Select 
                value={localConfig.model || 'gpt-4'} 
                onValueChange={(value) => updateConfig('model', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="llama-3">Llama 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max_tokens">Max Tokens: {localConfig.max_tokens || 1000}</Label>
              <Slider
                value={[localConfig.max_tokens || 1000]}
                onValueChange={([value]) => updateConfig('max_tokens', value)}
                max={4000}
                min={100}
                step={100}
                className="mt-2"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* AI Parameters */}
        <CollapsibleSection title="AI Parameters" icon={Brain}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="temperature">Temperature: {localConfig.temperature || 0.7}</Label>
              <Slider
                value={[localConfig.temperature || 0.7]}
                onValueChange={([value]) => updateConfig('temperature', value)}
                max={2}
                min={0}
                step={0.1}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controls randomness. Lower values are more deterministic.
              </p>
            </div>

            <div>
              <Label htmlFor="top_p">Top P: {localConfig.top_p || 0.9}</Label>
              <Slider
                value={[localConfig.top_p || 0.9]}
                onValueChange={([value]) => updateConfig('top_p', value)}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="custom_instructions">Custom Instructions</Label>
              <Textarea
                value={localConfig.custom_instructions || ''}
                onChange={(e) => updateConfig('custom_instructions', e.target.value)}
                placeholder="Provide specific instructions for the AI model..."
                rows={4}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Training Parameters */}
        <CollapsibleSection title="Training Parameters" icon={Zap}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="epochs">Epochs: {localConfig.epochs || 3}</Label>
              <Slider
                value={[localConfig.epochs || 3]}
                onValueChange={([value]) => updateConfig('epochs', value)}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="learning_rate">Learning Rate: {localConfig.learning_rate || 0.001}</Label>
              <Slider
                value={[localConfig.learning_rate || 0.001]}
                onValueChange={([value]) => updateConfig('learning_rate', value)}
                max={0.01}
                min={0.0001}
                step={0.0001}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="batch_size">Batch Size: {localConfig.batch_size || 32}</Label>
              <Select 
                value={String(localConfig.batch_size || 32)} 
                onValueChange={(value) => updateConfig('batch_size', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="64">64</SelectItem>
                  <SelectItem value="128">128</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="validation_split">Validation Split: {(localConfig.validation_split || 0.2) * 100}%</Label>
              <Slider
                value={[localConfig.validation_split || 0.2]}
                onValueChange={([value]) => updateConfig('validation_split', value)}
                max={0.5}
                min={0.1}
                step={0.05}
                className="mt-2"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Safety & Security */}
        <CollapsibleSection title="Safety & Security" icon={Shield}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="safety_filters">Enable Safety Filters</Label>
              <Switch
                checked={localConfig.safety_filters !== false}
                onCheckedChange={(checked) => updateConfig('safety_filters', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="content_filtering">Content Filtering</Label>
              <Switch
                checked={localConfig.content_filtering !== false}
                onCheckedChange={(checked) => updateConfig('content_filtering', checked)}
              />
            </div>

            <div>
              <Label htmlFor="max_conversation_length">Max Conversation Length</Label>
              <Input
                type="number"
                value={localConfig.max_conversation_length || 50}
                onChange={(e) => updateConfig('max_conversation_length', parseInt(e.target.value))}
                min={10}
                max={200}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Data Configuration */}
        <CollapsibleSection title="Data Configuration" icon={Database}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="data_source">Data Source</Label>
              <Select 
                value={localConfig.data_source || 'upload'} 
                onValueChange={(value) => updateConfig('data_source', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">File Upload</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">API Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data_format">Data Format</Label>
              <Select 
                value={localConfig.data_format || 'jsonl'} 
                onValueChange={(value) => updateConfig('data_format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jsonl">JSONL</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}; 