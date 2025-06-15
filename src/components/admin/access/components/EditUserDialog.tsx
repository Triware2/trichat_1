
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Shield, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccessManagement } from '../useAccessManagement';
import { Permission, User, Role } from '../types';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userId: number, customPermissions: Permission[]) => void;
}

export const EditUserDialog = ({ open, onOpenChange, user, onSave }: EditUserDialogProps) => {
  const { toast } = useToast();
  const { permissionGroups, getRolePermissions } = useAccessManagement();
  const [customPermissions, setCustomPermissions] = useState<Permission[]>([]);

  const getRoleBadge = (role: Role) => {
    const config = {
      admin: { color: 'bg-red-50 text-red-700 border-red-200', icon: Shield },
      supervisor: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Users },
      agent: { color: 'bg-green-50 text-green-700 border-green-200', icon: Settings }
    };
    
    const { color, icon: Icon } = config[role];
    return (
      <Badge variant="outline" className={`${color} font-medium`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    setCustomPermissions(prev => 
      checked 
        ? [...prev, permission]
        : prev.filter(p => p !== permission)
    );
  };

  const handleSave = () => {
    if (!user) return;
    onSave(user.id, customPermissions);
    onOpenChange(false);
    setCustomPermissions([]);
  };

  // Update custom permissions when user changes
  React.useEffect(() => {
    if (user) {
      setCustomPermissions(user.customPermissions || []);
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Edit User Permissions</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Customize permissions for {user?.name}. These will be added to their role-based permissions.
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="mt-2">
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Additional Permissions</h4>
              <div className="space-y-6">
                {permissionGroups.map((group) => (
                  <div key={group.id} className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">{group.name}</h5>
                    <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-gray-100">
                      {group.permissions.map((permission) => {
                        const hasRolePermission = getRolePermissions(user.role).includes(permission);
                        const hasCustomPermission = customPermissions.includes(permission);
                        
                        return (
                          <div key={permission} className="flex items-center gap-3">
                            <Checkbox
                              id={permission}
                              checked={hasCustomPermission}
                              disabled={hasRolePermission}
                              onCheckedChange={(checked) => handlePermissionToggle(permission, checked as boolean)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label htmlFor={permission} className="text-sm text-gray-700 font-normal capitalize cursor-pointer">
                              {permission.replace(/_/g, ' ')}
                              {hasRolePermission && (
                                <Badge variant="outline" className="ml-2 text-xs bg-gray-50 text-gray-600 border-gray-200">
                                  Role Permission
                                </Badge>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="text-gray-700 border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
