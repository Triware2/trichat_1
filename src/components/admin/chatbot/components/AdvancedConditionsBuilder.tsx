
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Code,
  Variable,
  GitBranch,
  Settings,
  TestTube,
  History,
  Download,
  Upload,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Minus,
  X,
  Zap,
  Brain,
  Shield,
  MessageSquare,
  User,
  Database,
  FileText,
  Calendar,
  Clock,
  Hash,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Percent,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Layers,
  Target,
  Filter,
  Search,
  BookOpen,
  Lightbulb,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  Condition, 
  Action, 
  ValidationRule, 
  PersonalizationRule, 
  ComplianceCheck,
  chatbotService 
} from '@/services/chatbotService';

interface AdvancedConditionsBuilderProps {
  chatbotId?: string;
  onConditionsSaved?: (conditions: Condition[]) => void;
}

interface ConditionGroup {
  id: string;
  name: string;
  description?: string;
  logicalOperator: 'and' | 'or';
  conditions: Condition[];
  children?: ConditionGroup[];
  isEnabled: boolean;
  priority: number;
}

interface ConditionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'user' | 'conversation' | 'system' | 'business' | 'custom';
  variables: string[];
  operators: string[];
  examples: string[];
  icon: any;
  color: string;
}

interface SavedConditionSet {
  id: string;
  name: string;
  description: string;
  conditions: Condition[];
  created_at: string;
  updated_at: string;
  version: number;
  is_active: boolean;
  tags: string[];
}

const CONDITION_TEMPLATES: ConditionTemplate[] = [
  {
    id: 'user_profile',
    name: 'User Profile',
    description: 'Conditions based on user profile data',
    category: 'user',
    variables: ['user.name', 'user.email', 'user.age', 'user.location', 'user.preferences', 'user.membership_level', 'user.language', 'user.timezone'],
    operators: ['==', '!=', 'contains', 'starts_with', 'ends_with', '>', '<', '>=', '<='],
    examples: ['user.age > 18', 'user.membership_level == "premium"', 'user.location contains "New York"'],
    icon: User,
    color: 'bg-blue-500'
  },
  {
    id: 'conversation_state',
    name: 'Conversation State',
    description: 'Conditions based on conversation context',
    category: 'conversation',
    variables: ['conversation.turn_count', 'conversation.duration', 'conversation.sentiment', 'conversation.intent', 'conversation.confidence', 'conversation.topic', 'conversation.urgency'],
    operators: ['==', '!=', '>', '<', '>=', '<='],
    examples: ['conversation.turn_count > 5', 'conversation.sentiment == "positive"', 'conversation.confidence >= 0.8'],
    icon: MessageSquare,
    color: 'bg-green-500'
  },
  {
    id: 'system_metrics',
    name: 'System Metrics',
    description: 'Conditions based on system performance',
    category: 'system',
    variables: ['system.response_time', 'system.error_rate', 'system.load', 'system.uptime', 'system.queue_length', 'system.available_agents'],
    operators: ['==', '!=', '>', '<', '>=', '<='],
    examples: ['system.response_time < 1000', 'system.error_rate < 0.01', 'system.load < 0.8'],
    icon: BarChart3,
    color: 'bg-purple-500'
  },
  {
    id: 'business_rules',
    name: 'Business Rules',
    description: 'Conditions based on business logic',
    category: 'business',
    variables: ['business.hour', 'business.day_of_week', 'business.is_holiday', 'business.region', 'business.product_category', 'business.campaign', 'business.season'],
    operators: ['==', '!=', 'in', 'not_in', 'contains'],
    examples: ['business.hour >= 9 && business.hour <= 17', 'business.day_of_week in ["monday", "tuesday", "wednesday"]'],
    icon: Target,
    color: 'bg-orange-500'
  },
  {
    id: 'custom_variables',
    name: 'Custom Variables',
    description: 'User-defined custom variables',
    category: 'custom',
    variables: ['custom.priority', 'custom.category', 'custom.source', 'custom.tags', 'custom.score', 'custom.status'],
    operators: ['==', '!=', 'contains', 'starts_with', 'ends_with', 'in', 'not_in'],
    examples: ['custom.priority == "high"', 'custom.tags contains "urgent"', 'custom.source in ["web", "mobile"]'],
    icon: Variable,
    color: 'bg-pink-500'
  },
  {
    id: 'sentiment_analysis',
    name: 'Sentiment Analysis',
    description: 'Conditions based on user sentiment',
    category: 'user',
    variables: ['sentiment.score', 'sentiment.label', 'sentiment.confidence', 'sentiment.emotion', 'sentiment.intensity'],
    operators: ['==', '!=', '>', '<', '>=', '<='],
    examples: ['sentiment.score > 0.7', 'sentiment.label == "positive"', 'sentiment.confidence >= 0.8'],
    icon: Smile,
    color: 'bg-yellow-500'
  },
  {
    id: 'time_based',
    name: 'Time Based',
    description: 'Conditions based on time and date',
    category: 'system',
    variables: ['time.hour', 'time.day', 'time.month', 'time.year', 'time.weekday', 'time.is_business_hours', 'time.timezone'],
    operators: ['==', '!=', '>', '<', '>=', '<='],
    examples: ['time.hour >= 9 && time.hour <= 17', 'time.weekday in [1,2,3,4,5]', 'time.is_business_hours == true'],
    icon: Clock,
    color: 'bg-indigo-500'
  },
  {
    id: 'location_based',
    name: 'Location Based',
    description: 'Conditions based on geographic location',
    category: 'user',
    variables: ['location.country', 'location.region', 'location.city', 'location.timezone', 'location.language', 'location.currency'],
    operators: ['==', '!=', 'contains', 'in', 'not_in'],
    examples: ['location.country == "US"', 'location.timezone == "America/New_York"', 'location.language in ["en", "es"]'],
    icon: MapPin,
    color: 'bg-teal-500'
  }
];

const OPERATORS = {
  '==': 'Equals',
  '!=': 'Not Equals',
  '>': 'Greater Than',
  '<': 'Less Than',
  '>=': 'Greater Than or Equal',
  '<=': 'Less Than or Equal',
  'contains': 'Contains',
  'starts_with': 'Starts With',
  'ends_with': 'Ends With',
  'regex': 'Regex Match',
  'in': 'In List',
  'not_in': 'Not In List',
  'exists': 'Exists',
  'not_exists': 'Not Exists'
};

const VARIABLE_TYPES = {
  'string': 'Text',
  'number': 'Number',
  'boolean': 'True/False',
  'date': 'Date',
  'array': 'List',
  'object': 'Object',
  'email': 'Email',
  'phone': 'Phone',
  'url': 'URL'
};

export const AdvancedConditionsBuilder: React.FC<AdvancedConditionsBuilderProps> = ({
  chatbotId,
  onConditionsSaved
}) => {
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customVariables, setCustomVariables] = useState<Array<{ name: string; type: string; description: string; defaultValue?: string }>>([]);
  const [savedConditionSets, setSavedConditionSets] = useState<SavedConditionSet[]>([]);
  const [selectedSavedCondition, setSelectedSavedCondition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('builder');
  const [previewMode, setPreviewMode] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load saved conditions on component mount
  useEffect(() => {
    if (chatbotId) {
      loadSavedConditionSets();
    }
  }, [chatbotId]);

  const loadSavedConditionSets = async () => {
    try {
      setIsLoading(true);
      // Load from localStorage for now, can be replaced with API call
      const saved = localStorage.getItem(`chatbot_${chatbotId}_condition_sets`);
      if (saved) {
        setSavedConditionSets(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved condition sets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addConditionGroup = (parentId?: string) => {
    const newGroup: ConditionGroup = {
      id: `group_${Date.now()}_${Math.random()}`,
      name: `Condition Group ${conditionGroups.length + 1}`,
      description: '',
      logicalOperator: 'and',
      conditions: [],
      children: [],
      isEnabled: true,
      priority: conditionGroups.length + 1
    };

    if (parentId) {
      setConditionGroups(prev => updateConditionGroups(prev, parentId, group => ({
        ...group,
        children: [...(group.children || []), newGroup]
      })));
    } else {
      setConditionGroups(prev => [...prev, newGroup]);
    }
  };

  const updateConditionGroups = (
    groups: ConditionGroup[], 
    targetId: string, 
    updater: (group: ConditionGroup) => ConditionGroup
  ): ConditionGroup[] => {
    return groups.map(group => {
      if (group.id === targetId) {
        return updater(group);
      }
      if (group.children) {
        return {
          ...group,
          children: updateConditionGroups(group.children, targetId, updater)
        };
      }
      return group;
    });
  };

  const addCondition = (groupId: string) => {
    const newCondition: Condition = {
      id: `condition_${Date.now()}_${Math.random()}`,
      type: 'if',
      variable: '',
      operator: '==',
      value: '',
      logical_operator: 'and'
    };

    setConditionGroups(prev => updateConditionGroups(prev, groupId, group => ({
      ...group,
      conditions: [...group.conditions, newCondition]
    })));
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<Condition>) => {
    setConditionGroups(prev => updateConditionGroups(prev, groupId, group => ({
      ...group,
      conditions: group.conditions.map(condition => 
        condition.id === conditionId ? { ...condition, ...updates } : condition
      )
    })));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setConditionGroups(prev => updateConditionGroups(prev, groupId, group => ({
      ...group,
      conditions: group.conditions.filter(condition => condition.id !== conditionId)
    })));
  };

  const removeConditionGroup = (groupId: string) => {
    setConditionGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const applyTemplate = (templateId: string) => {
    const template = CONDITION_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const newGroup: ConditionGroup = {
      id: `group_${Date.now()}_${Math.random()}`,
      name: template.name,
      description: template.description,
      logicalOperator: 'and',
      conditions: template.examples.map((example, index) => ({
        id: `condition_${Date.now()}_${index}`,
        type: 'if',
        variable: template.variables[0],
        operator: template.operators[0] as any,
        value: example.split(' ').pop() || '',
        logical_operator: 'and'
      })),
      children: [],
      isEnabled: true,
      priority: conditionGroups.length + 1
    };

    setConditionGroups(prev => [...prev, newGroup]);
    setSelectedTemplate('');
  };

  const addCustomVariable = () => {
    setCustomVariables(prev => [...prev, { name: '', type: 'string', description: '', defaultValue: '' }]);
  };

  const updateCustomVariable = (index: number, updates: Partial<{ name: string; type: string; description: string; defaultValue?: string }>) => {
    setCustomVariables(prev => prev.map((variable, i) => i === index ? { ...variable, ...updates } : variable));
  };

  const removeCustomVariable = (index: number) => {
    setCustomVariables(prev => prev.filter((_, i) => i !== index));
  };

  const validateConditions = (): string[] => {
    const errors: string[] = [];

    const validateGroup = (group: ConditionGroup): void => {
      if (!group.name.trim()) {
        errors.push(`Condition group "${group.id}" must have a name`);
      }

      if (group.conditions.length === 0) {
        errors.push(`Condition group "${group.name}" must have at least one condition`);
      }

      group.conditions.forEach(condition => {
        if (!condition.variable.trim()) {
          errors.push(`Condition in group "${group.name}" must have a variable`);
        }
        if (!condition.value.toString().trim()) {
          errors.push(`Condition in group "${group.name}" must have a value`);
        }
      });

      if (group.children) {
        group.children.forEach(validateGroup);
      }
    };

    conditionGroups.forEach(validateGroup);
    return errors;
  };

  const saveConditionSet = async () => {
    const errors = validateConditions();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const flattenConditions = (groups: ConditionGroup[]): Condition[] => {
        let allConditions: Condition[] = [];
        groups.forEach(group => {
          if (group.isEnabled) {
            allConditions.push(...group.conditions);
            if (group.children) {
              allConditions.push(...flattenConditions(group.children));
            }
          }
        });
        return allConditions;
      };

      const conditionSet: SavedConditionSet = {
        id: `condition_set_${Date.now()}`,
        name: `Condition Set ${savedConditionSets.length + 1}`,
        description: 'Advanced condition set',
        conditions: flattenConditions(conditionGroups),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        is_active: true,
        tags: []
      };

      const updatedSets = [...savedConditionSets, conditionSet];
      setSavedConditionSets(updatedSets);
      
      // Save to localStorage
      localStorage.setItem(`chatbot_${chatbotId}_condition_sets`, JSON.stringify(updatedSets));
      
      // Call callback if provided
      onConditionsSaved?.(conditionSet.conditions);
      
      setValidationErrors([]);
    } catch (error) {
      console.error('Error saving condition set:', error);
      setValidationErrors(['Failed to save condition set']);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConditionSet = (conditionSetId: string) => {
    const conditionSet = savedConditionSets.find(set => set.id === conditionSetId);
    if (!conditionSet) return;

    // Convert flat conditions back to groups
    const groups: ConditionGroup[] = [{
      id: `group_${Date.now()}`,
      name: conditionSet.name,
      description: conditionSet.description,
      logicalOperator: 'and',
      conditions: conditionSet.conditions,
      children: [],
      isEnabled: true,
      priority: 1
    }];

    setConditionGroups(groups);
    setSelectedSavedCondition(conditionSetId);
  };

  const generateCode = (): string => {
    const generateConditionCode = (condition: Condition): string => {
      const operatorMap: { [key: string]: string } = {
        '==': '===',
        '!=': '!==',
        '>': '>',
        '<': '<',
        '>=': '>=',
        '<=': '<=',
        'contains': '.includes',
        'starts_with': '.startsWith',
        'ends_with': '.endsWith',
        'in': '.includes',
        'not_in': '!.includes'
      };

      const operator = operatorMap[condition.operator] || condition.operator;
      const value = typeof condition.value === 'string' ? `"${condition.value}"` : condition.value;

      if (condition.operator === 'contains') {
        return `${condition.variable}.includes(${value})`;
      } else if (condition.operator === 'starts_with') {
        return `${condition.variable}.startsWith(${value})`;
      } else if (condition.operator === 'ends_with') {
        return `${condition.variable}.endsWith(${value})`;
      } else if (condition.operator === 'in') {
        return `${value}.includes(${condition.variable})`;
      } else if (condition.operator === 'not_in') {
        return `!${value}.includes(${condition.variable})`;
      } else {
        return `${condition.variable} ${operator} ${value}`;
      }
    };

    const generateGroupCode = (group: ConditionGroup): string => {
      if (group.conditions.length === 0) return 'true';

      const conditionCodes = group.conditions.map(generateConditionCode);
      const operator = group.logicalOperator === 'and' ? ' && ' : ' || ';
      
      let code = conditionCodes.join(operator);
      
      if (group.children && group.children.length > 0) {
        const childCodes = group.children.map(generateGroupCode);
        code = `(${code}) && (${childCodes.join(' && ')})`;
      }

      return code;
    };

    if (conditionGroups.length === 0) {
      return '// No conditions defined\nreturn true;';
    }

    const groupCodes = conditionGroups.map(generateGroupCode);
    const finalCode = groupCodes.join(' && ');

    return `// Generated condition code
function evaluateConditions(context) {
  const { ${[...new Set(conditionGroups.flatMap(g => g.conditions.map(c => c.variable.split('.')[0])))]} } = context;
  
  return ${finalCode};
}

// Usage example:
// const result = evaluateConditions({
//   user: { name: "John", age: 25 },
//   conversation: { turn_count: 3 },
//   system: { response_time: 500 }
// });`;
  };

  const testConditions = () => {
    setTestMode(true);
    const testData = {
      user: { name: "John", age: 25, location: "New York", membership_level: "premium" },
      conversation: { turn_count: 5, sentiment: "positive", confidence: 0.8 },
      system: { response_time: 500, error_rate: 0.005, load: 0.6 },
      business: { hour: 14, day_of_week: "monday", is_holiday: false },
      custom: { priority: "high", tags: ["urgent", "support"] }
    };

    try {
      const code = generateCode();
      const testFunction = new Function('context', code.replace('// Generated condition code\nfunction evaluateConditions(context) {', 'return ').replace('}', ''));
      const result = testFunction(testData);
      
      setTestResults([
        { 
          testCase: "Sample Test Data", 
          data: testData, 
          result: result ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      setTestResults([
        { 
          testCase: "Sample Test Data", 
          data: testData, 
          result: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const renderCondition = (condition: Condition, groupId: string) => (
    <div key={condition.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-1 grid grid-cols-4 gap-2">
        <Input
          value={condition.variable}
          onChange={(e) => updateCondition(groupId, condition.id, { variable: e.target.value })}
          placeholder="Variable"
          className="text-sm"
        />
        <Select 
          value={condition.operator} 
          onValueChange={(value) => updateCondition(groupId, condition.id, { operator: value })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(OPERATORS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={condition.value}
          onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
          placeholder="Value"
          className="text-sm"
        />
        <Select 
          value={condition.logical_operator || 'and'} 
          onValueChange={(value) => updateCondition(groupId, condition.id, { logical_operator: value })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="and">AND</SelectItem>
            <SelectItem value="or">OR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => removeCondition(groupId, condition.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderConditionGroup = (group: ConditionGroup, depth = 0) => (
    <div key={group.id} className={`border rounded-lg p-4 ${depth > 0 ? 'ml-6' : ''}`} style={{ borderLeftWidth: depth > 0 ? '4px' : '1px' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={group.isEnabled}
              onChange={(e) => setConditionGroups(prev => updateConditionGroups(prev, group.id, g => ({ ...g, isEnabled: e.target.checked })))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <Input
              value={group.name}
              onChange={(e) => setConditionGroups(prev => updateConditionGroups(prev, group.id, g => ({ ...g, name: e.target.value })))}
              placeholder="Group Name"
              className="w-48 text-sm font-medium"
            />
          </div>
          <Select 
            value={group.logicalOperator} 
            onValueChange={(value) => setConditionGroups(prev => updateConditionGroups(prev, group.id, g => ({ ...g, logicalOperator: value as 'and' | 'or' })))}
          >
            <SelectTrigger className="w-20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="and">AND</SelectItem>
              <SelectItem value="or">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addCondition(group.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Condition
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addConditionGroup(group.id)}
          >
            <Layers className="h-4 w-4 mr-1" />
            Add Subgroup
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeConditionGroup(group.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {group.description && (
        <Textarea
          value={group.description}
          onChange={(e) => setConditionGroups(prev => updateConditionGroups(prev, group.id, g => ({ ...g, description: e.target.value })))}
          placeholder="Group description (optional)"
          className="mb-4 text-sm"
          rows={2}
        />
      )}

      <div className="space-y-2">
        {group.conditions.map(condition => renderCondition(condition, group.id))}
      </div>

      {group.children && group.children.length > 0 && (
        <div className="mt-4 space-y-4">
          {group.children.map(child => renderConditionGroup(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            Advanced Conditions Builder
          </CardTitle>
          <p className="text-slate-600">Create complex conditional logic for your chatbot flows</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100/80 text-green-700 border-green-200/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready
              </Badge>
              <span className="text-sm text-slate-600">
                {conditionGroups.length} groups • {conditionGroups.reduce((total, group) => 
                  total + group.conditions.length + (group.children?.reduce((childTotal, child) => 
                    childTotal + child.conditions.length, 0) || 0), 0
                )} conditions
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                variant="outline"
                onClick={testConditions}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test
              </Button>
              <Button
                onClick={saveConditionSet}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Condition Set
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-indigo-600" />
            </div>
            Condition Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-slate-50 p-2 rounded-xl gap-2">
              <TabsTrigger value="builder" className="py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100">
                <span className="text-sm">Condition Builder</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100">
                <span className="text-sm">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="variables" className="py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100">
                <span className="text-sm">Variables</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100">
                <span className="text-sm">Saved</span>
              </TabsTrigger>
              <TabsTrigger value="testing" className="py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100">
                <span className="text-sm">Testing</span>
              </TabsTrigger>
            </TabsList>

            {/* Condition Builder Tab */}
            <TabsContent value="builder" className="space-y-6 mt-6">
              {validationErrors.length > 0 && (
                <Card className="bg-white/60 backdrop-blur-sm border border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-red-900">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      Validation Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-red-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <GitBranch className="w-3 h-3 text-green-600" />
                        </div>
                        Condition Groups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {conditionGroups.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <GitBranch className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <p>No condition groups yet</p>
                          <p className="text-sm">Add your first condition group to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {conditionGroups.map(group => renderConditionGroup(group))}
                        </div>
                      )}

                      <div className="mt-6 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => addConditionGroup()}
                          className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Condition Group
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addCondition('')}
                          className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Simple Condition
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {previewMode && (
                    <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                            <Code className="w-3 h-3 text-purple-600" />
                          </div>
                          Code Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                          {generateCode()}
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-3 h-3 text-blue-600" />
                        </div>
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Total Groups:</span>
                          <span className="font-medium">{conditionGroups.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Total Conditions:</span>
                          <span className="font-medium">
                            {conditionGroups.reduce((total, group) => 
                              total + group.conditions.length + (group.children?.reduce((childTotal, child) => 
                                childTotal + child.conditions.length, 0) || 0), 0
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Enabled Groups:</span>
                          <span className="font-medium">
                            {conditionGroups.filter(g => g.isEnabled).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6 mt-6">
              <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-orange-600" />
                    </div>
                    Condition Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CONDITION_TEMPLATES.map(template => {
                      const IconComponent = template.icon;
                      return (
                        <div
                          key={template.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white/60 backdrop-blur-sm"
                          onClick={() => applyTemplate(template.id)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg ${template.color} flex items-center justify-center`}>
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{template.name}</h4>
                              <p className="text-sm text-slate-600">{template.category}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-700">Examples:</p>
                            {template.examples.slice(0, 2).map((example, index) => (
                              <p key={index} className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                                {example}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Variables Tab */}
            <TabsContent value="variables" className="space-y-6 mt-6">
              <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                      <Variable className="w-3 h-3 text-pink-600" />
                    </div>
                    Custom Variables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customVariables.map((variable, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-white/60 backdrop-blur-sm">
                        <Input
                          value={variable.name}
                          onChange={(e) => updateCustomVariable(index, { name: e.target.value })}
                          placeholder="Variable name"
                          className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                        <Select
                          value={variable.type}
                          onValueChange={(value) => updateCustomVariable(index, { type: value })}
                        >
                          <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(VARIABLE_TYPES).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={variable.defaultValue || ''}
                          onChange={(e) => updateCustomVariable(index, { defaultValue: e.target.value })}
                          placeholder="Default value"
                          className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomVariable(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addCustomVariable}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Variable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved" className="space-y-6 mt-6">
              <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <History className="w-3 h-3 text-teal-600" />
                    </div>
                    Saved Condition Sets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : savedConditionSets.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <History className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No saved condition sets</p>
                      <p className="text-sm">Create and save your first condition set</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedConditionSets.map(saved => (
                        <div key={saved.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/60 backdrop-blur-sm">
                          <div>
                            <h4 className="font-medium text-slate-900">{saved.name}</h4>
                            <p className="text-sm text-slate-600">{saved.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">v{saved.version}</Badge>
                              <Badge variant={saved.is_active ? "default" : "secondary"}>
                                {saved.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadConditionSet(saved.id)}
                              className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testing Tab */}
            <TabsContent value="testing" className="space-y-6 mt-6">
              <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <TestTube className="w-3 h-3 text-yellow-600" />
                    </div>
                    Condition Testing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button onClick={testConditions} disabled={conditionGroups.length === 0} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Run Test
                      </Button>
                      <Button variant="outline" onClick={() => setTestResults([])} className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear Results
                      </Button>
                    </div>

                    {testResults.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-900">Test Results:</h4>
                        {testResults.map((result, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            result.result === 'PASS' ? 'bg-green-50 border-green-200' :
                            result.result === 'FAIL' ? 'bg-red-50 border-red-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{result.testCase}</span>
                              <Badge variant={
                                result.result === 'PASS' ? 'default' :
                                result.result === 'FAIL' ? 'destructive' : 'secondary'
                              }>
                                {result.result}
                              </Badge>
                            </div>
                            {result.error && (
                              <p className="text-sm text-red-600">{result.error}</p>
                            )}
                            <p className="text-xs text-slate-500">
                              {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
