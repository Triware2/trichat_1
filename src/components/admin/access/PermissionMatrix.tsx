
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Settings, 
  Save, 
  RotateCcw, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccessManagement } from './useAccessManagement';
import { Permission, Role, CustomPermission } from './types';

export const PermissionMatrix = () => {
  const { toast } = useToast();
  const { 
    rolePermissions, 
    permissionGroups, 
    customPermissions,
    loading,
    updateRolePermissions, 
    createCustomPermission,
    deleteCustomPermission,
    exportPermissions
  } = useAccessManagement();

  const [localPermissions, setLocalPermissions] = useState<Record<Role, Permission[]>>(() => {
    const initial: Record<Role, Permission[]> = {} as Record<Role, Permission[]>;
    rolePermissions.forEach(rp => {
      initial[rp.role] = [...rp.permissions];
    });
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCustomPermissions, setShowCustomPermissions] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomPermission, setSelectedCustomPermission] = useState<CustomPermission | null>(null);

  // Custom permission form state
  const [customPermissionForm, setCustomPermissionForm] = useState({
    name: '',
    description: '',
    code: '',
    category: '',
    appliesTo: [] as Role[]
  });

  // Filtered permission groups
  const filteredGroups = useMemo(() => {
    return permissionGroups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.permissions.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [permissionGroups, searchTerm, selectedCategory]);

  // All available permissions including custom ones
  const allPermissions = useMemo(() => {
    const standardPermissions = permissionGroups.flatMap(group => group.permissions);
    const customPermCodes = customPermissions.map(cp => cp.code);
    return [...standardPermissions, ...customPermCodes];
  }, [permissionGroups, customPermissions]);

  const handlePermissionToggle = (role: Role, permission: Permission, checked: boolean) => {
    setLocalPermissions(prev => ({
      ...prev,
      [role]: checked 
        ? [...(prev[role] || []), permission]
        : (prev[role] || []).filter(p => p !== permission)
    }));
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        Object.entries(localPermissions).map(([role, permissions]) =>
          updateRolePermissions(role as Role, permissions)
        )
      );
      
      toast({
        title: "Permissions Updated",
        description: "Role permissions have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    const resetPermissions: Record<Role, Permission[]> = {} as Record<Role, Permission[]>;
    rolePermissions.forEach(rp => {
      resetPermissions[rp.role] = [...rp.permissions];
    });
    setLocalPermissions(resetPermissions);
    toast({
      title: "Changes Reset",
      description: "All changes have been reset to current saved state.",
    });
  };

  const handleCreateCustomPermission = async () => {
    try {
      // Validate form data
      if (!customPermissionForm.name || !customPermissionForm.description || !customPermissionForm.code || !customPermissionForm.category) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Check if permission code already exists
      const existingPermission = customPermissions.find(cp => cp.code === customPermissionForm.code);
      if (existingPermission) {
        toast({
          title: "Validation Error",
          description: "A permission with this code already exists.",
          variant: "destructive"
        });
        return;
      }

      await createCustomPermission({
        name: customPermissionForm.name,
        description: customPermissionForm.description,
        code: customPermissionForm.code,
        category: customPermissionForm.category,
        createdBy: 'system', // Use system as default since we're in local mode
        isActive: true,
        appliesTo: customPermissionForm.appliesTo
      });

      setCustomPermissionForm({
        name: '',
        description: '',
        code: '',
        category: '',
        appliesTo: []
      });
      setIsCreateDialogOpen(false);

    } catch (error) {
      console.error('Error creating custom permission:', error);
      toast({
        title: "Error",
        description: "Failed to create custom permission. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCustomPermission = async () => {
    if (!selectedCustomPermission) return;

    try {
      await deleteCustomPermission(selectedCustomPermission.id);
      setIsDeleteDialogOpen(false);
      setSelectedCustomPermission(null);

      toast({
        title: "Custom Permission Deleted",
        description: "Custom permission has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete custom permission. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      case 'supervisor': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'agent': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'admin': return <Shield className="w-3.5 h-3.5" />;
      case 'supervisor': return <Users className="w-3.5 h-3.5" />;
      case 'agent': return <Settings className="w-3.5 h-3.5" />;
      default: return <Settings className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'security': return <Lock className="w-4 h-4 text-red-600" />;
      case 'compliance': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'advanced': return <Settings className="w-4 h-4 text-blue-600" />;
      case 'custom': return <Plus className="w-4 h-4 text-purple-600" />;
      default: return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPermissionStatus = (role: Role, permission: Permission) => {
    const hasPermission = localPermissions[role]?.includes(permission) || false;
    const isCustom = customPermissions.some(cp => cp.code === permission);
    
    return {
      hasPermission,
      isCustom,
      isRequired: permissionGroups.some(g => g.isRequired && g.permissions.includes(permission))
    };
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Permission Matrix</h2>
          <p className="text-sm text-slate-600">Configure role-based permissions for your team</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPermissions} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleReset} size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={loading} size="sm">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowCustomPermissions(!showCustomPermissions)}
              size="sm"
              className="h-10"
            >
              {showCustomPermissions ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showCustomPermissions ? 'Hide' : 'Show'} Custom
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-10">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Custom Permission</DialogTitle>
                  <DialogDescription>
                    Create a new custom permission that can be assigned to roles.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Permission Name</Label>
                    <Input
                      id="name"
                      value={customPermissionForm.name}
                      onChange={(e) => setCustomPermissionForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Manage Special Reports"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={customPermissionForm.description}
                      onChange={(e) => setCustomPermissionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this permission allows"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Permission Code</Label>
                    <Input
                      id="code"
                      value={customPermissionForm.code}
                      onChange={(e) => setCustomPermissionForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g., manage_special_reports"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={customPermissionForm.category} onValueChange={(value) => setCustomPermissionForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCustomPermission}>
                    Create Permission
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Group Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{group.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(group.category)}
                  {group.isRequired && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions List */}
            <div className="divide-y divide-gray-100">
              {group.permissions.map((permission) => {
                const permissionStatus = getPermissionStatus('admin', permission);
                
                return (
                  <div key={permission} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {permission.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Control access to {permission.replace(/_/g, ' ').toLowerCase()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {permissionStatus.isCustom && (
                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                              Custom
                            </Badge>
                          )}
                          {permissionStatus.isRequired && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                      {permissionStatus.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomPermission(customPermissions.find(cp => cp.code === permission) || null);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Role Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {rolePermissions.map((roleData) => {
                        const status = getPermissionStatus(roleData.role, permission);
                        
                        return (
                          <div 
                            key={roleData.role} 
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                              status.hasPermission 
                                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs font-medium ${getRoleBadgeColor(roleData.role)}`}>
                                {getRoleIcon(roleData.role)}
                                <span className="ml-1 capitalize">{roleData.role}</span>
                              </Badge>
                            </div>
                            <Switch
                              checked={status.hasPermission}
                              onCheckedChange={(checked) => handlePermissionToggle(roleData.role, permission, checked)}
                              disabled={status.isRequired}
                              className="data-[state=checked]:bg-blue-600"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Custom Permission Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Custom Permission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the custom permission "{selectedCustomPermission?.name}"? 
              This action cannot be undone and will remove this permission from all roles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomPermission}>
              Delete Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
