
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WizardStepProps } from './types';

export const PersonalityStep = ({ botData, setBotData }: WizardStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Bot Personality & Messages</Label>
        <p className="text-sm text-gray-600 mb-4">Define how your bot communicates with users</p>
      </div>

      <div>
        <Label htmlFor="personality">Personality & Tone</Label>
        <Textarea
          id="personality"
          value={botData.personality}
          onChange={(e) => setBotData({...botData, personality: e.target.value})}
          placeholder="Professional, friendly, and helpful. Always maintain a positive tone and ask clarifying questions when needed."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="welcomeMessage">Welcome Message *</Label>
        <Textarea
          id="welcomeMessage"
          value={botData.welcomeMessage}
          onChange={(e) => setBotData({...botData, welcomeMessage: e.target.value})}
          placeholder="Hello! I'm here to help you with any questions or issues you might have. How can I assist you today?"
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="fallbackMessage">Fallback Message</Label>
        <Textarea
          id="fallbackMessage"
          value={botData.fallbackMessage}
          onChange={(e) => setBotData({...botData, fallbackMessage: e.target.value})}
          placeholder="I'm not sure I understand. Let me connect you with a human agent who can better assist you."
          className="mt-1"
          rows={2}
        />
      </div>

      {botData.type === 'llm' && (
        <div>
          <Label htmlFor="escalationThreshold">Escalation Confidence Threshold</Label>
          <div className="mt-1">
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={botData.escalationThreshold}
              onChange={(e) => setBotData({...botData, escalationThreshold: parseFloat(e.target.value)})}
              className="w-32"
            />
            <p className="text-xs text-gray-500 mt-1">
              Escalate to human when confidence is below this threshold (0.0 - 1.0)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
