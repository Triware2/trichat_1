
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WizardStepProps } from './types';

export const ConfigurationStep = ({ botData, setBotData }: WizardStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Bot Configuration</Label>
        <p className="text-sm text-gray-600 mb-4">Configure your chatbot's basic settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Bot Name *</Label>
          <Input
            id="name"
            value={botData.name}
            onChange={(e) => setBotData({...botData, name: e.target.value})}
            placeholder="Customer Support Bot"
            className="mt-1"
          />
        </div>

        {botData.type === 'llm' && (
          <div>
            <Label htmlFor="llmProvider">LLM Provider *</Label>
            <Select value={botData.llmProvider} onValueChange={(value) => setBotData({...botData, llmProvider: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="custom">Custom Endpoint</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {botData.type === 'llm' && botData.llmProvider && (
        <div>
          <Label htmlFor="model">Model *</Label>
          <Select value={botData.model} onValueChange={(value) => setBotData({...botData, model: value})}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {botData.llmProvider === 'openai' && (
                <>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </>
              )}
              {botData.llmProvider === 'anthropic' && (
                <>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                </>
              )}
              {botData.llmProvider === 'mistral' && (
                <>
                  <SelectItem value="mistral-large">Mistral Large</SelectItem>
                  <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={botData.description}
          onChange={(e) => setBotData({...botData, description: e.target.value})}
          placeholder="Describe the purpose and functionality of this chatbot"
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};
