
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { customizationService } from '@/services/customizationService';
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2,
  Settings,
  Users,
  FileText,
  Package,
  Link2,
  Activity,
  Type,
  Calendar,
  List,
  Hash,
  ToggleLeft,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface CustomObject {
  id: string;
  name: string;
  label: string;
  description: string;
  fieldsCount: number;
  recordsCount: number;
  permissions: string[];
  relationships: number;
  status: 'active' | 'inactive';
  lastModified: string;
}

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface CustomRecord {
  id: string;
  data: any;
  created_at: string;
  updated_at: string;
}

interface ObjectRelationship {
  id: string;
  source_object_id: string;
  target_object_id: string;
  type: string;
  name: string;
  target_object?: CustomObject;
}

export const CustomObjectManager = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newObject, setNewObject] = useState({
    name: '',
    label: '',
    description: ''
  });
  const [customObjects, setCustomObjects] = useState<CustomObject[]>([]);
  const [editingObject, setEditingObject] = useState<CustomObject | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Object detail states
  const [selectedObject, setSelectedObject] = useState<CustomObject | null>(null);
  const [isObjectDetailOpen, setIsObjectDetailOpen] = useState(false);
  const [objectFields, setObjectFields] = useState<CustomField[]>([]);
  const [objectRecords, setObjectRecords] = useState<CustomRecord[]>([]);
  const [objectRelationships, setObjectRelationships] = useState<ObjectRelationship[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [placements, setPlacements] = useState<any[]>([]);
  const [isAddPlacementOpen, setIsAddPlacementOpen] = useState(false);
  const [newPlacement, setNewPlacement] = useState({ destination: 'contact_panel', section_label: '', link_key: 'customer_id', include_fields: '' });

  // Field management states
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false,
    options: ''
  });

  // Record management states
  const [isCreateRecordOpen, setIsCreateRecordOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<any>({});

  // Relationship management states
  const [isCreateRelationshipOpen, setIsCreateRelationshipOpen] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    target_object_id: '',
    type: 'one-to-many',
    name: ''
  });

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'textarea', label: 'Text Area', icon: FileText },
    { value: 'boolean', label: 'Yes/No', icon: ToggleLeft }
  ];

  const relationshipTypes = [
    { value: 'one-to-one', label: 'One to One' },
    { value: 'one-to-many', label: 'One to Many' },
    { value: 'many-to-many', label: 'Many to Many' }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        // Initialize database tables if they don't exist
        await customizationService.initializeDatabase();
        
        const [list, count] = await Promise.all([
          customizationService.listObjects({ from: (page-1)*pageSize, to: (page*pageSize)-1, search }),
          customizationService.countObjects(search),
        ]);
        const mapped: CustomObject[] = (list || []).map((o: any) => ({
          id: o.id,
          name: o.name,
          label: o.label,
          description: o.description,
          fieldsCount: o.fields_count || 0,
          recordsCount: o.records_count || 0,
          permissions: o.permissions || ['read'],
          relationships: o.relationships || 0,
          status: (o.status as any) || 'active',
          lastModified: o.updated_at || 'recently'
        }));
        setCustomObjects(mapped);
        setTotal(count || 0);
      } catch (error) {
        console.error('Error loading objects:', error);
        toast({
          title: "Error Loading Objects",
          description: "Failed to load custom objects. Please check your database connection.",
          variant: "destructive"
        });
      }
    };
    load();
  }, [page, search]);

  const handleCreateObject = async () => {
    if (!newObject.name || !newObject.label) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const created = await customizationService.createObject(newObject);
    if (created) {
      setCustomObjects(prev => [{
        id: created.id,
        name: created.name,
        label: created.label,
        description: created.description,
        fieldsCount: created.fields_count || 0,
        recordsCount: created.records_count || 0,
        permissions: created.permissions || ['read'],
        relationships: created.relationships || 0,
        status: created.status || 'active',
        lastModified: created.updated_at
      }, ...prev]);
      toast({ title: 'Custom Object Created', description: `${newObject.label} has been created successfully.` });
    }
    setIsCreateOpen(false);
    setNewObject({ name: '', label: '', description: '' });
  };

  const handleDeleteObject = async (objectId: string, objectName: string) => {
    await customizationService.deleteObject(objectId);
    setCustomObjects(prev => prev.filter(o => o.id !== objectId));
    toast({ title: 'Object Deleted', description: `${objectName} has been removed.` });
  };

  const openObjectDetail = async (object: CustomObject) => {
    setSelectedObject(object);
    setIsObjectDetailOpen(true);
    setActiveTab('overview');
    
    // Load object details
    const [fields, records, relationships] = await Promise.all([
      customizationService.listObjectFields(object.id),
      customizationService.listObjectRecords(object.id),
      customizationService.listObjectRelationships(object.id)
    ]);
    
    setObjectFields(fields || []);
    setObjectRecords(records || []);
    setObjectRelationships(relationships || []);

    const p = await customizationService.listObjectPlacements();
    setPlacements((p || []).filter((pl: any) => pl.object_id === object.id));
  };

  const handleCreateField = async () => {
    if (!selectedObject || !newField.name || !newField.label) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const created = await customizationService.createObjectField(selectedObject.id, {
      name: newField.name,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      options: newField.options ? newField.options.split(',').map(o => o.trim()).filter(Boolean) : []
    });

    if (created) {
      setObjectFields(prev => [{
        id: created.id,
        name: created.name,
        label: created.label,
        type: created.type,
        required: !!created.required,
        options: created.options || undefined
      }, ...prev]);
      toast({ title: 'Field Created', description: `${newField.label} has been added to ${selectedObject.label}.` });
    }
    setIsCreateFieldOpen(false);
    setNewField({ name: '', label: '', type: 'text', required: false, options: '' });
  };

  const handleCreateRecord = async () => {
    if (!selectedObject) return;

    const created = await customizationService.createObjectRecord(selectedObject.id, newRecord);
    if (created) {
      setObjectRecords(prev => [created, ...prev]);
      toast({ title: 'Record Created', description: `New record has been added to ${selectedObject.label}.` });
    }
    setIsCreateRecordOpen(false);
    setNewRecord({});
  };

  const handleCreateRelationship = async () => {
    if (!selectedObject || !newRelationship.target_object_id || !newRelationship.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const created = await customizationService.createObjectRelationship({
        source_object_id: selectedObject.id,
        target_object_id: newRelationship.target_object_id,
        type: newRelationship.type,
        name: newRelationship.name
      });

      if (created) {
        const targetObject = customObjects.find(o => o.id === newRelationship.target_object_id);
        setObjectRelationships(prev => [{
          id: created.id,
          source_object_id: selectedObject.id,
          target_object_id: newRelationship.target_object_id,
          type: newRelationship.type,
          name: newRelationship.name,
          target_object: targetObject
        }, ...prev]);
        toast({ title: 'Relationship Created', description: `Relationship with ${targetObject?.label} has been created.` });
      }
      setIsCreateRelationshipOpen(false);
      setNewRelationship({ target_object_id: '', type: 'one-to-many', name: '' });
    } catch (error) {
      console.error('Error creating relationship:', error);
      toast({
        title: "Error Creating Relationship",
        description: error instanceof Error ? error.message : "Failed to create relationship. Please check if the database tables exist.",
        variant: "destructive"
      });
    }
  };

  const renderFieldInput = (field: CustomField, value: any, onChange: (value: any) => void) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.label}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'boolean':
        return (
          <Select value={value ? 'true' : 'false'} onValueChange={(v) => onChange(v === 'true')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Custom Objects</h2>
          <p className="text-gray-600">Create and manage custom data objects for your platform</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Object
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create Custom Object</DialogTitle>
              <DialogDescription>
                Define a new data object to extend your platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="object-name">Object Name</Label>
                <Input
                  id="object-name"
                  value={newObject.name}
                  onChange={(e) => setNewObject({...newObject, name: e.target.value})}
                  placeholder="e.g., project"
                />
                <p className="text-xs text-gray-500 mt-1">Used in API calls (lowercase, no spaces)</p>
              </div>
              
              <div>
                <Label htmlFor="object-label">Display Label</Label>
                <Input
                  id="object-label"
                  value={newObject.label}
                  onChange={(e) => setNewObject({...newObject, label: e.target.value})}
                  placeholder="e.g., Project"
                />
              </div>

              <div>
                <Label htmlFor="object-description">Description</Label>
                <Input
                  id="object-description"
                  value={newObject.description}
                  onChange={(e) => setNewObject({...newObject, description: e.target.value})}
                  placeholder="Brief description of the object"
                />
              </div>

              <Button onClick={handleCreateObject} className="w-full">
                Create Object
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Object Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Objects</p>
                <p className="text-2xl font-bold">{customObjects.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Objects</p>
                <p className="text-2xl font-bold text-green-600">
                  {customObjects.filter(o => o.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">
                  {customObjects.reduce((sum, o) => sum + o.recordsCount, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Relationships</p>
                <p className="text-2xl font-bold">
                  {customObjects.reduce((sum, o) => sum + o.relationships, 0)}
                </p>
              </div>
              <Link2 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Custom Objects
          </CardTitle>
          <CardDescription>
            Manage your custom data objects and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <Input placeholder="Search objects..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />
            <div className="flex items-center gap-2 text-sm">
              <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
              <span>Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</Button>
            </div>
          </div>
          <div className="space-y-4">
            {customObjects.map((object) => (
              <div key={object.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${object.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Database className={`w-5 h-5 ${object.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{object.label}</h4>
                      <Badge variant={object.status === 'active' ? 'default' : 'secondary'}>
                        {object.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {object.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{object.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{object.fieldsCount} fields</span>
                      <span>•</span>
                      <span>{object.recordsCount} records</span>
                      <span>•</span>
                      <span>{object.relationships} relationships</span>
                      <span>•</span>
                      <span>Modified {object.lastModified}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openObjectDetail(object)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingObject(object); setIsEditOpen(true); }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteObject(object.id, object.label)}
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

      {/* Object Detail Dialog */}
      <Dialog open={isObjectDetailOpen} onOpenChange={setIsObjectDetailOpen}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {selectedObject?.label} - Object Details
            </DialogTitle>
            <DialogDescription>
              Manage fields, records, and relationships for this object
            </DialogDescription>
          </DialogHeader>
          
          {selectedObject && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="destinations">Destinations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Object Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Name:</strong> {selectedObject.name}</div>
                      <div><strong>Label:</strong> {selectedObject.label}</div>
                      <div><strong>Description:</strong> {selectedObject.description}</div>
                      <div><strong>Status:</strong> 
                        <Badge variant={selectedObject.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                          {selectedObject.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Fields:</strong> {objectFields.length}</div>
                      <div><strong>Records:</strong> {objectRecords.length}</div>
                      <div><strong>Relationships:</strong> {objectRelationships.length}</div>
                      <div><strong>Last Modified:</strong> {selectedObject.lastModified}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="fields" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Object Fields</h3>
                  <Dialog open={isCreateFieldOpen} onOpenChange={setIsCreateFieldOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Field to {selectedObject.label}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Field Name</Label>
                          <Input
                            value={newField.name}
                            onChange={(e) => setNewField({...newField, name: e.target.value})}
                            placeholder="e.g., title"
                          />
                        </div>
                        <div>
                          <Label>Display Label</Label>
                          <Input
                            value={newField.label}
                            onChange={(e) => setNewField({...newField, label: e.target.value})}
                            placeholder="e.g., Title"
                          />
                        </div>
                        <div>
                          <Label>Field Type</Label>
                          <Select value={newField.type} onValueChange={(value) => setNewField({...newField, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="required"
                            checked={newField.required}
                            onChange={(e) => setNewField({...newField, required: e.target.checked})}
                          />
                          <Label htmlFor="required">Required Field</Label>
                        </div>
                        {newField.type === 'select' && (
                          <div>
                            <Label>Options (comma-separated)</Label>
                            <Input
                              value={newField.options}
                              onChange={(e) => setNewField({...newField, options: e.target.value})}
                              placeholder="Option 1, Option 2, Option 3"
                            />
                          </div>
                        )}
                        <Button onClick={handleCreateField} className="w-full">
                          Add Field
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-2">
                  {objectFields.map((field) => {
                    const fieldType = fieldTypes.find(t => t.value === field.type);
                    return (
                      <div key={field.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded">
                            {fieldType && <fieldType.icon className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div>
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-600">{field.name} • {fieldType?.label}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {objectFields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No fields defined yet. Add your first field to get started.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Object Records</h3>
                  <Dialog open={isCreateRecordOpen} onOpenChange={setIsCreateRecordOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Record to {selectedObject.label}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {objectFields.map((field) => (
                          <div key={field.id}>
                            <Label>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
                            {renderFieldInput(field, newRecord[field.name], (value) => 
                              setNewRecord({...newRecord, [field.name]: value})
                            )}
                          </div>
                        ))}
                        {objectFields.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            No fields defined. Add fields first to create records.
                          </div>
                        )}
                        {objectFields.length > 0 && (
                          <Button onClick={handleCreateRecord} className="w-full">
                            Create Record
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-2">
                  {objectRecords.map((record) => (
                    <div key={record.id} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Record #{record.id.slice(0, 8)}</div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {objectFields.map((field) => (
                          <div key={field.id}>
                            <span className="font-medium">{field.label}:</span>
                            <span className="ml-2 text-gray-600">
                              {record.data[field.name] || 'Not set'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Created: {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {objectRecords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No records yet. Create your first record to get started.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="relationships" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Object Relationships</h3>
                  <Dialog open={isCreateRelationshipOpen} onOpenChange={setIsCreateRelationshipOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Relationship
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Relationship to {selectedObject.label}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Target Object</Label>
                          <Select value={newRelationship.target_object_id} onValueChange={(value) => setNewRelationship({...newRelationship, target_object_id: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select target object" />
                            </SelectTrigger>
                            <SelectContent>
                              {customObjects.filter(o => o.id !== selectedObject.id).map((obj) => (
                                <SelectItem key={obj.id} value={obj.id}>
                                  {obj.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Relationship Type</Label>
                          <Select value={newRelationship.type} onValueChange={(value) => setNewRelationship({...newRelationship, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {relationshipTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Relationship Name</Label>
                          <Input
                            value={newRelationship.name}
                            onChange={(e) => setNewRelationship({...newRelationship, name: e.target.value})}
                            placeholder="e.g., has_projects"
                          />
                        </div>
                        <Button onClick={handleCreateRelationship} className="w-full">
                          Create Relationship
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-2">
                  {objectRelationships.map((rel) => (
                    <div key={rel.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Link2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{rel.name}</div>
                          <div className="text-sm text-gray-600">
                            {selectedObject.label} → {rel.target_object?.label} ({rel.type})
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {objectRelationships.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No relationships defined. Create relationships to link objects together.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="destinations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Destinations</h3>
                  <Dialog open={isAddPlacementOpen} onOpenChange={setIsAddPlacementOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Destination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Mount Object to Destination</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Destination</Label>
                          <Select value={newPlacement.destination} onValueChange={(v) => setNewPlacement({ ...newPlacement, destination: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contact_panel">Contact Properties Panel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Section Label</Label>
                          <Input value={newPlacement.section_label} onChange={(e) => setNewPlacement({ ...newPlacement, section_label: e.target.value })} placeholder="e.g., Customer Details" />
                        </div>
                        <div>
                          <Label>Link Key</Label>
                          <Select value={newPlacement.link_key} onValueChange={(v) => setNewPlacement({ ...newPlacement, link_key: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer_id">customer_id (recommended)</SelectItem>
                              <SelectItem value="email">email</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Include Fields (comma separated, optional)</Label>
                          <Input value={newPlacement.include_fields} onChange={(e) => setNewPlacement({ ...newPlacement, include_fields: e.target.value })} placeholder="leave blank for all fields" />
                        </div>
                        <Button onClick={async () => {
                          if (!selectedObject) return;
                          const created = await customizationService.createObjectPlacement({
                            object_id: selectedObject.id,
                            destination: newPlacement.destination,
                            section_label: newPlacement.section_label || selectedObject.label,
                            link_key: newPlacement.link_key,
                            include_fields: newPlacement.include_fields ? newPlacement.include_fields.split(',').map(s => s.trim()).filter(Boolean) : undefined
                          });
                          if (created) {
                            setPlacements(prev => [created, ...prev]);
                            toast({ title: 'Destination Added', description: 'Object will render in the selected destination.' });
                          }
                          setIsAddPlacementOpen(false);
                          setNewPlacement({ destination: 'contact_panel', section_label: '', link_key: 'customer_id', include_fields: '' });
                        }} className="w-full">Save</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  {placements.length === 0 && <div className="text-sm text-gray-500">No destinations configured yet.</div>}
                  {placements.map((pl) => (
                    <div key={pl.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{pl.section_label}</div>
                        <div className="text-sm text-gray-600">{pl.destination} • link by {pl.link_key}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={async () => { await customizationService.updateObjectPlacement(pl.id, { is_active: !pl.is_active }); setPlacements(prev => prev.map(x => x.id === pl.id ? { ...x, is_active: !x.is_active } : x)); }}>{pl.is_active ? 'Disable' : 'Enable'}</Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={async () => { await customizationService.deleteObjectPlacement(pl.id); setPlacements(prev => prev.filter(x => x.id !== pl.id)); }}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Object Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Object</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Display Label</Label>
              <Input value={editingObject?.label || ''} onChange={(e) => setEditingObject(prev => prev ? { ...prev, label: e.target.value } : prev)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editingObject?.description || ''} onChange={(e) => setEditingObject(prev => prev ? { ...prev, description: e.target.value } : prev)} />
            </div>
            <Button onClick={async () => {
              if (!editingObject) return;
              const updated = await customizationService.updateObject(editingObject.id, { label: editingObject.label, description: editingObject.description });
              if (updated) {
                setCustomObjects(prev => prev.map(o => o.id === editingObject.id ? { ...o, label: editingObject.label, description: editingObject.description } : o));
                toast({ title: 'Object Updated', description: 'Changes saved successfully.' });
              }
              setIsEditOpen(false);
            }} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
