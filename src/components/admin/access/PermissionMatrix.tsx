
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">Permission Matrix</h2>
          <p className="text-sm text-gray-600">Configure role-based permissions for your team</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="h-9 px-4 text-sm font-medium">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Changes
          </Button>
          <Button onClick={handleSave} className="h-9 px-4 text-sm font-medium bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {permissionGroups.map((group) => (
          <Card key={group.id} className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">{group.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {group.permissions.map((permission) => (
                  <div key={permission} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {permission.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Control access to {permission.replace(/_/g, ' ').toLowerCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {rolePermissions.map((roleData) => (
                        <div key={roleData.role} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs font-medium ${getRoleBadgeColor(roleData.role)}`}>
                              {getRoleIcon(roleData.role)}
                              <span className="ml-1 capitalize">{roleData.role}</span>
                            </Badge>
                          </div>
                          <Switch
                            checked={localPermissions[roleData.role]?.includes(permission) || false}
                            onCheckedChange={(checked) => handlePermissionToggle(roleData.role, permission, checked)}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
