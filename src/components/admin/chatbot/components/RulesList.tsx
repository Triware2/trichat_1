
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MessageSquare } from 'lucide-react';
import { BotRule } from '../types';

interface RulesListProps {
  rules: BotRule[];
  mockRules: BotRule[];
  onEditRule: (rule: BotRule) => void;
  onDeleteRule: (id: string) => void;
}

export const RulesList = ({ rules, mockRules, onEditRule, onDeleteRule }: RulesListProps) => {
  const displayRules = rules.length > 0 ? rules : mockRules;

  return (
    <Card className="border-gray-200/50 rounded-3xl shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-light text-gray-900">Active Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayRules.map(rule => (
            <div key={rule.id} className="p-8 bg-gradient-to-br from-gray-50/80 via-blue-50/20 to-indigo-50/10 rounded-2xl border border-gray-100/70 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <Badge variant="outline" className="bg-blue-50/80 text-blue-700 border-blue-200/70 rounded-xl px-4 py-2 font-medium">
                      {rule.trigger}
                    </Badge>
                    <Badge className={`rounded-xl px-4 py-2 font-medium ${rule.is_active ? "bg-green-50/80 text-green-700 border-green-200/70" : "bg-red-50/80 text-red-700 border-red-200/70"}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-gray-500 bg-gray-100/70 px-3 py-2 rounded-xl font-medium">
                      Priority: {rule.priority}
                    </span>
                  </div>
                  <div className="bg-white/80 p-6 rounded-2xl border border-gray-100/70 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed font-light">
                      {rule.response}
                    </p>
                  </div>
                  {rule.conditions.length > 0 && (
                    <div className="mt-4">
                      <span className="text-xs font-medium text-gray-500 mb-3 block">Conditions:</span>
                      <div className="flex flex-wrap gap-3">
                        {rule.conditions.map((condition, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-purple-50/80 text-purple-700 border-purple-200/70 rounded-xl">
                            {condition.field} {condition.operator} {condition.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 ml-8">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEditRule(rule)}
                    className="border-gray-200/70 rounded-xl hover:bg-blue-50/80 hover:border-blue-200/70 transition-all duration-300 shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDeleteRule(rule.id)}
                    className="border-gray-200/70 rounded-xl hover:bg-red-50/80 hover:border-red-200/70 transition-all duration-300 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-light text-lg">No rules configured yet. Create your first rule above.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
