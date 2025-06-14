
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Users, Settings, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccessManagement } from './useAccessManagement';
import { Permission, Role } from './types';

export const PermissionMatrix = () => {
  const { toast } = useToast();
  const { rolePermissions, permissionGroups, updateRolePermissions, getRolePermissions } = useAccessManagement();
  const [localPermissions, setLocalPermissions] = useState<Record<Role, Permission[]>>(() => {
    const initial: Record<Role, Permission[]> = {} as Record<Role, Permission[]>;
    rolePermissions.forEach(rp => {
      initial[rp.role] = [...rp.permissions];
    });
    return initial;
  });

  const handlePermissionToggle = (role: Role, permission: Permission, checked: boolean) => {
    setLocalPermissions(prev => ({
      ...prev,
      [role]: checked 
        ? [...prev[role], permission]
        : prev[role].filter(p => p !== permission)
    }));
  };

  const handleSave = () => {
    Object.entries(localPermissions).forEach(([role, permissions]) => {
      updateRolePermissions(role as Role, permissions);
    });
    toast({
      title: "Permissions Updated",
      description: "Role permissions have been successfully updated.",
    });
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

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'supervisor': return <Users className="w-4 h-4" />;
      case 'agent': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permission Matrix</h2>
          <p className="text-gray-600">Configure role-based permissions for your team</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Changes
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Manage what each role can access and modify in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {permissionGroups.map((group) => (
              <div key={group.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  <Badge variant="outline">{group.description}</Badge>
                </div>
                
                <div className="grid gap-4">
                  {group.permissions.map((permission) => (
                    <div key={permission} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {permission.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Control access to {permission.replace(/_/g, ' ').toLowerCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {rolePermissions.map((roleData) => (
                          <div key={roleData.role} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(roleData.role)}
                              <Badge className={getRoleBadgeColor(roleData.role)}>
                                {roleData.role.charAt(0).toUpperCase() + roleData.role.slice(1)}
                              </Badge>
                            </div>
                            <Switch
                              checked={localPermissions[roleData.role]?.includes(permission) || false}
                              onCheckedChange={(checked) => handlePermissionToggle(roleData.role, permission, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {group.id !== permissionGroups[permissionGroups.length - 1].id && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
