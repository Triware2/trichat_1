
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
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
  Activity
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

export const CustomObjectManager = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newObject, setNewObject] = useState({
    name: '',
    label: '',
    description: ''
  });

  const [customObjects] = useState<CustomObject[]>([
    {
      id: '1',
      name: 'project',
      label: 'Project',
      description: 'Track and manage project information',
      fieldsCount: 12,
      recordsCount: 45,
      permissions: ['read', 'write', 'delete'],
      relationships: 3,
      status: 'active',
      lastModified: '2 hours ago'
    },
    {
      id: '2',
      name: 'invoice',
      label: 'Invoice',
      description: 'Manage billing and invoice data',
      fieldsCount: 8,
      recordsCount: 234,
      permissions: ['read', 'write'],
      relationships: 2,
      status: 'active',
      lastModified: '1 day ago'
    },
    {
      id: '3',
      name: 'equipment',
      label: 'Equipment',
      description: 'Track equipment and asset information',
      fieldsCount: 15,
      recordsCount: 78,
      permissions: ['read'],
      relationships: 1,
      status: 'inactive',
      lastModified: '3 days ago'
    }
  ]);

  const handleCreateObject = () => {
    if (!newObject.name || !newObject.label) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Custom Object Created",
      description: `${newObject.label} has been created successfully.`,
    });

    setIsCreateOpen(false);
    setNewObject({
      name: '',
      label: '',
      description: ''
    });
  };

  const handleDeleteObject = (objectId: string, objectName: string) => {
    toast({
      title: "Object Deleted",
      description: `${objectName} has been removed.`,
    });
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
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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
    </div>
  );
};
