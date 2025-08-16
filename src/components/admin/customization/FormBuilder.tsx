
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { customizationService } from '@/services/customizationService';
import { 
  FormInput, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Type,
  Calendar,
  List,
  CheckSquare,
  Hash,
  Upload,
  Grip,
  Move
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  order: number;
}

interface CustomForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  status: 'draft' | 'published';
  responses: number;
  lastModified: string;
}

export const FormBuilder = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [editingForm, setEditingForm] = useState<CustomForm | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const load = async () => {
      const list = await customizationService.listForms({ from: (page-1)*pageSize, to: (page*pageSize)-1, search });
      // Map to local shape if needed
      const mapped: CustomForm[] = (list || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        fields: [],
        status: (f.status as any) || 'draft',
        responses: f.responses || 0,
        lastModified: f.last_modified || 'recently'
      }));
      setForms(mapped);
    };
    load();
  }, [page, search]);

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'email', label: 'Email', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'date', label: 'Date Picker', icon: Calendar },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'textarea', label: 'Text Area', icon: FormInput },
    { value: 'file', label: 'File Upload', icon: Upload }
  ];

  const handleCreateForm = async () => {
    const nameEl = document.getElementById('form-name') as HTMLInputElement | null;
    const descEl = document.getElementById('form-description') as HTMLInputElement | null;
    const name = nameEl?.value?.trim();
    const description = descEl?.value?.trim() || '';
    if (!name) {
      toast({ title: 'Form name is required', variant: 'destructive' });
      return;
    }
    const created = await customizationService.createForm({ name, description });
    if (created) {
      setForms(prev => [{
        id: created.id,
        name: created.name,
        description: created.description,
        fields: [],
        status: created.status,
        responses: created.responses || 0,
        lastModified: created.last_modified
      }, ...prev]);
    }
    toast({ title: 'Form Created', description: 'New form has been created successfully.' });
    setIsCreateOpen(false);
  };

  const handleDeleteForm = async (formId: string, formName: string) => {
    await customizationService.deleteForm(formId);
    setForms(prev => prev.filter(f => f.id !== formId));
    toast({ title: 'Form Deleted', description: `${formName} has been removed.` });
  };

  const openFormBuilder = (form: CustomForm) => {
    setSelectedForm(form);
    setIsBuilderOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Form Builder</h2>
          <p className="text-gray-600">Create and customize forms with drag-and-drop functionality</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
              <DialogDescription>
                Start building a custom form for your platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="form-name">Form Name</Label>
                <Input
                  id="form-name"
                  placeholder="e.g., Contact Form"
                />
              </div>
              
              <div>
                <Label htmlFor="form-description">Description</Label>
                <Input
                  id="form-description"
                  placeholder="Brief description of the form"
                />
              </div>

              <Button onClick={handleCreateForm} className="w-full">
                Create Form
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Form Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold">{forms.length}</p>
              </div>
              <FormInput className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {forms.filter(f => f.status === 'published').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold">
                  {forms.reduce((sum, f) => sum + f.responses, 0)}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Rate</p>
                <p className="text-2xl font-bold">73%</p>
              </div>
              <Hash className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms List */}
      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
          <CardTitle className="flex items-center gap-2">
            <FormInput className="w-5 h-5" />
            Custom Forms
          </CardTitle>
          <CardDescription>
            Manage your custom forms and their configurations
          </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search forms..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p+1)}>Next</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forms
              .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase()))
              .map((form) => (
              <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FormInput className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{form.name}</h4>
                      <Badge variant={form.status === 'published' ? 'default' : 'secondary'}>
                        {form.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{form.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{form.fields.length} fields</span>
                      <span>•</span>
                      <span>{form.responses} responses</span>
                      <span>•</span>
                      <span>Modified {form.lastModified}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingForm(form); setIsEditOpen(true); }}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteForm(form.id, form.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Form Name</Label>
              <Input value={editingForm?.name || ''} onChange={(e) => setEditingForm(prev => prev ? { ...prev, name: e.target.value } : prev)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editingForm?.description || ''} onChange={(e) => setEditingForm(prev => prev ? { ...prev, description: e.target.value } : prev)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editingForm?.status || 'draft'} onValueChange={(v) => setEditingForm(prev => prev ? { ...prev, status: v as any } : prev)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={async () => {
              if (!editingForm) return;
              const updated = await customizationService.updateForm(editingForm.id, { name: editingForm.name, description: editingForm.description, status: editingForm.status });
              if (updated) {
                setForms(prev => prev.map(f => f.id === editingForm.id ? { ...f, name: editingForm.name, description: editingForm.description, status: editingForm.status } : f));
              }
              toast({ title: 'Form Updated', description: 'Changes saved successfully.' });
              setIsEditOpen(false);
            }} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Builder Modal */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="bg-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Builder - {selectedForm?.name}</DialogTitle>
            <DialogDescription>
              Drag and drop fields to build your custom form
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Field Types Panel */}
            <div className="space-y-4">
              <h3 className="font-medium">Field Types</h3>
              <div className="space-y-2">
                {fieldTypes.map((fieldType) => {
                  const Icon = fieldType.icon;
                  return (
                    <div 
                      key={fieldType.value}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-move hover:bg-gray-50"
                      draggable
                    >
                      <Grip className="w-4 h-4 text-gray-400" />
                      <Icon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{fieldType.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Builder Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Form Canvas</h3>
                <Button size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 min-h-[400px]">
                <div className="space-y-4">
                  {selectedForm?.fields
                    .sort((a, b) => a.order - b.order)
                    .map((field) => (
                    <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                      <Move className="w-4 h-4 text-gray-400 cursor-move" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === 'text' && (
                          <Input className="mt-1" placeholder={field.placeholder} disabled />
                        )}
                        {field.type === 'textarea' && (
                          <textarea className="w-full mt-1 p-2 border rounded" rows={3} disabled />
                        )}
                        {field.type === 'select' && (
                          <select className="w-full mt-1 p-2 border rounded" disabled>
                            <option>Select an option...</option>
                            {field.options?.map((option, idx) => (
                              <option key={idx}>{option}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {selectedForm?.fields.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FormInput className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Drag field types from the left panel to start building your form</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
