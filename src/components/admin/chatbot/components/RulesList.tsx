
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatbotRule } from '@/services/chatbotService';
import { MessageSquare, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface RulesListProps {
  rules: ChatbotRule[];
  mockRules: any[];
  onEditRule: (rule: ChatbotRule) => void;
  onDeleteRule: (id: string) => void;
}

export const RulesList = ({ rules, mockRules, onEditRule, onDeleteRule }: RulesListProps) => {
  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'response': return 'bg-blue-100 text-blue-800';
      case 'behavior': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'response': return <MessageSquare className="w-4 h-4" />;
      case 'behavior': return <MessageSquare className="w-4 h-4" />;
      case 'security': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (rules.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Rules Created</h3>
          <p className="text-slate-600">Start by creating your first rule using the form above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          Training Rules ({rules.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    {getRuleTypeIcon(rule.rule_type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{rule.rule_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getRuleTypeColor(rule.rule_type)}>
                        {rule.rule_type}
                      </Badge>
                      <Badge variant={rule.is_active ? "default" : "secondary"} className="text-xs">
                        {rule.is_active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {rule.rule_description && (
                  <p className="text-sm text-slate-600">{rule.rule_description}</p>
                )}
                
                <div className="bg-slate-50/80 rounded-lg p-3">
                  <p className="text-sm font-mono text-slate-700">{rule.rule_content}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditRule(rule)}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white text-slate-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteRule(rule.id)}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
