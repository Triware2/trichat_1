
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2,
  Type,
  Calendar,
  List,
  FileText,
  Hash,
  ToggleLeft
} from 'lucide-react';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  object: string;
  required: boolean;
  options?: string[];
}

export const CustomFieldsManager = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    object: 'contacts',
    required: false,
    options: ''
  });

  const [customFields] = useState<CustomField[]>([
    { id: '1', name: 'priority_level', label: 'Priority Level', type: 'select', object: 'tickets', required: true, options: ['Low', 'Medium', 'High', 'Critical'] },
    { id: '2', name: 'department', label: 'Department', type: 'select', object: 'contacts', required: false, options: ['Sales', 'Support', 'Marketing'] },
    { id: '3', name: 'follow_up_date', label: 'Follow-up Date', type: 'date', object: 'tickets', required: false },
    { id: '4', name: 'customer_value', label: 'Customer Value', type: 'number', object: 'contacts', required: false },
    { id: '5', name: 'notes', label: 'Internal Notes', type: 'textarea', object: 'tickets', required: false }
  ]);

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'textarea', label: 'Text Area', icon: FileText },
    { value: 'boolean', label: 'Yes/No', icon: ToggleLeft }
  ];

  const objectTypes = [
    { value: 'contacts', label: 'Contacts' },
    { value: 'tickets', label: 'Tickets' },
    { value: 'users', label: 'Users' },
    { value: 'chats', label: 'Chats' }
  ];

  const handleCreateField = () => {
    if (!newField.name || !newField.label) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Custom Field Created",
      description: `${newField.label} has been added successfully.`,
    });

    setIsCreateOpen(false);
    setNewField({
      name: '',
      label: '',
      type: 'text',
      object: 'contacts',
      required: false,
      options: ''
    });
  };

  const handleDeleteField = (fieldId: string, fieldName: string) => {
    toast({
      title: "Field Deleted",
      description: `${fieldName} has been removed.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Custom Fields</h2>
          <p className="text-gray-600">Add custom data fields to your objects and forms</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Field
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create Custom Field</DialogTitle>
              <DialogDescription>
                Add a new custom field to enhance your data collection
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="field-name">Field Name</Label>
                <Input
                  id="field-name"
                  value={newField.name}
                  onChange={(e) => setNewField({...newField, name: e.target.value})}
                  placeholder="e.g., customer_priority"
                />
              </div>
              
              <div>
                <Label htmlFor="field-label">Display Label</Label>
                <Input
                  id="field-label"
                  value={newField.label}
                  onChange={(e) => setNewField({...newField, label: e.target.value})}
                  placeholder="e.g., Customer Priority"
                />
              </div>

              <div>
                <Label htmlFor="field-type">Field Type</Label>
                <Select value={newField.type} onValueChange={(value) => setNewField({...newField, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {fieldTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="field-object">Add to Object</Label>
                <Select value={newField.object} onValueChange={(value) => setNewField({...newField, object: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {objectTypes.map((object) => (
                      <SelectItem key={object.value} value={object.value}>
                        {object.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(newField.type === 'select') && (
                <div>
                  <Label htmlFor="field-options">Options (comma-separated)</Label>
                  <Input
                    id="field-options"
                    value={newField.options}
                    onChange={(e) => setNewField({...newField, options: e.target.value})}
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              <Button onClick={handleCreateField} className="w-full">
                Create Field
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Field Type Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fieldTypes.slice(0, 4).map((type) => {
          const Icon = type.icon;
          const count = customFields.filter(f => f.type === type.value).length;
          return (
            <Card key={type.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{type.label} Fields</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fields List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Existing Custom Fields
          </CardTitle>
          <CardDescription>
            Manage your custom fields and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customFields.map((field) => {
              const fieldType = fieldTypes.find(t => t.value === field.type);
              const FieldIcon = fieldType?.icon || Type;
              
              return (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FieldIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{field.label}</h4>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {field.name} • {fieldType?.label} • {objectTypes.find(o => o.value === field.object)?.label}
                      </p>
                      {field.options && (
                        <p className="text-xs text-gray-500 mt-1">
                          Options: {field.options.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteField(field.id, field.label)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
