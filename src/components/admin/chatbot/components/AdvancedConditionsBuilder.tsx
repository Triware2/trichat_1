
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicOperator?: 'AND' | 'OR';
}

interface ConditionGroup {
  id: string;
  name: string;
  conditions: Condition[];
  isActive: boolean;
}

export const AdvancedConditionsBuilder = () => {
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([
    {
      id: '1',
      name: 'VIP Customer Check',
      isActive: true,
      conditions: [
        { id: '1', field: 'customer_tier', operator: 'equals', value: 'VIP', logicOperator: 'AND' },
        { id: '2', field: 'account_value', operator: 'greater_than', value: '10000' }
      ]
    }
  ]);

  const [newGroup, setNewGroup] = useState<Partial<ConditionGroup>>({
    name: '',
    conditions: [],
    isActive: true
  });

  const [isCreating, setIsCreating] = useState(false);

  const addCondition = (groupId: string) => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };

    setConditionGroups(groups => 
      groups.map(group => 
        group.id === groupId 
          ? { ...group, conditions: [...group.conditions, newCondition] }
          : group
      )
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setConditionGroups(groups => 
      groups.map(group => 
        group.id === groupId 
          ? { ...group, conditions: group.conditions.filter(c => c.id !== conditionId) }
          : group
      )
    );
  };

  const handleCreateGroup = () => {
    if (newGroup.name) {
      const group: ConditionGroup = {
        id: Date.now().toString(),
        name: newGroup.name,
        conditions: [],
        isActive: true
      };
      setConditionGroups([...conditionGroups, group]);
      setNewGroup({ name: '', conditions: [], isActive: true });
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Advanced Condition Builder</h3>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Condition Group
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Condition Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="VIP Customer Check"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateGroup} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {conditionGroups.map(group => (
        <Card key={group.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{group.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={group.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {group.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => addCondition(group.id)}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add Condition
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {index > 0 && (
                    <Select defaultValue={condition.logicOperator || 'AND'}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Input
                    placeholder="Field"
                    value={condition.field}
                    className="flex-1"
                  />
                  <Select defaultValue={condition.operator}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    value={condition.value}
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline" onClick={() => removeCondition(group.id, condition.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {group.conditions.length === 0 && (
                <p className="text-center text-gray-500 py-4">No conditions added yet. Click "Add Condition" to start building conditions.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
