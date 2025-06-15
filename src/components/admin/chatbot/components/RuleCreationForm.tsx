
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save } from 'lucide-react';
import { BotRule } from '../types';

interface RuleCreationFormProps {
  newRule: Partial<BotRule>;
  editingRule: string | null;
  onRuleChange: (rule: Partial<BotRule>) => void;
  onAddRule: () => void;
  onSaveRule: () => void;
  onCancelEdit: () => void;
}

export const RuleCreationForm = ({
  newRule,
  editingRule,
  onRuleChange,
  onAddRule,
  onSaveRule,
  onCancelEdit
}: RuleCreationFormProps) => {
  return (
    <Card className="bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 border-gray-200/50 rounded-3xl shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-light text-gray-900">
          {editingRule ? 'Edit Rule' : 'Create New Rule'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label htmlFor="trigger" className="text-sm font-medium text-gray-700">
              Trigger Keywords
            </Label>
            <Input
              id="trigger"
              value={newRule.trigger || ''}
              onChange={(e) => onRuleChange({...newRule, trigger: e.target.value})}
              placeholder="billing, order, support"
              className="border-gray-200/70 rounded-2xl focus:border-blue-500 transition-all duration-300 h-12 shadow-sm"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority Level
            </Label>
            <Input
              id="priority"
              type="number"
              min="1"
              max="10"
              value={newRule.priority || 1}
              onChange={(e) => onRuleChange({...newRule, priority: parseInt(e.target.value)})}
              className="border-gray-200/70 rounded-2xl focus:border-blue-500 transition-all duration-300 h-12 shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="response" className="text-sm font-medium text-gray-700">
            Bot Response
          </Label>
          <Textarea
            id="response"
            value={newRule.response || ''}
            onChange={(e) => onRuleChange({...newRule, response: e.target.value})}
            placeholder="I can help you with billing questions. What specific issue do you have?"
            rows={5}
            className="border-gray-200/70 rounded-2xl focus:border-blue-500 transition-all duration-300 resize-none shadow-sm"
          />
        </div>
        <div className="flex gap-4 pt-4">
          {editingRule ? (
            <>
              <Button 
                onClick={onSaveRule} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl px-8 py-3 transition-all duration-300 shadow-lg shadow-green-500/20 font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={onCancelEdit}
                className="border-gray-200/70 rounded-2xl px-8 py-3 transition-all duration-300 shadow-sm font-medium"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={onAddRule} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-3 transition-all duration-300 shadow-lg shadow-blue-500/20 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
