
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ChatbotRule } from '@/services/chatbotService';
import { MessageSquare, Save, X, Plus } from 'lucide-react';

interface RuleCreationFormProps {
  newRule: Partial<ChatbotRule>;
  editingRule: string | null;
  onRuleChange: (rule: Partial<ChatbotRule>) => void;
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
  const handleInputChange = (field: keyof ChatbotRule, value: any) => {
    onRuleChange({ ...newRule, [field]: value });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          {editingRule ? 'Edit Rule' : 'Create New Rule'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rule Name */}
          <div className="space-y-2">
            <Label htmlFor="rule_name" className="text-sm font-medium text-slate-700">
              Rule Name *
            </Label>
            <Input
              id="rule_name"
              placeholder="Enter rule name..."
              value={newRule.rule_name || ''}
              onChange={(e) => handleInputChange('rule_name', e.target.value)}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          {/* Rule Type */}
          <div className="space-y-2">
            <Label htmlFor="rule_type" className="text-sm font-medium text-slate-700">
              Rule Type *
            </Label>
            <Select 
              value={newRule.rule_type || 'response'} 
              onValueChange={(value) => handleInputChange('rule_type', value)}
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Select rule type" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl">
                <SelectItem value="response" className="hover:bg-blue-50/50">Response Rule</SelectItem>
                <SelectItem value="behavior" className="hover:bg-blue-50/50">Behavior Rule</SelectItem>
                <SelectItem value="security" className="hover:bg-blue-50/50">Security Rule</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rule Description */}
        <div className="space-y-2">
          <Label htmlFor="rule_description" className="text-sm font-medium text-slate-700">
            Description
          </Label>
          <Textarea
            id="rule_description"
            placeholder="Describe what this rule does..."
            value={newRule.rule_description || ''}
            onChange={(e) => handleInputChange('rule_description', e.target.value)}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
            rows={3}
          />
        </div>

        {/* Rule Content */}
        <div className="space-y-2">
          <Label htmlFor="rule_content" className="text-sm font-medium text-slate-700">
            Rule Content *
          </Label>
          <Textarea
            id="rule_content"
            placeholder="Enter the rule logic or response content..."
            value={newRule.rule_content || ''}
            onChange={(e) => handleInputChange('rule_content', e.target.value)}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 min-h-[120px]"
            rows={4}
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-slate-700">Active Status</Label>
            <p className="text-xs text-slate-500">Enable or disable this rule</p>
          </div>
          <Switch
            checked={newRule.is_active || false}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {editingRule ? (
            <>
              <Button
                variant="outline"
                onClick={onCancelEdit}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white text-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={onSaveRule}
                disabled={!newRule.rule_name || !newRule.rule_content}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={onAddRule}
              disabled={!newRule.rule_name || !newRule.rule_content}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
