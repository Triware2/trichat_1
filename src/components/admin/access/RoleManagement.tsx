
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Search, Edit, Trash2, Shield, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccessManagement } from './useAccessManagement';
import { Role, Permission, User } from './types';

export const RoleManagement = () => {
  const { toast } = useToast();
  const { permissionGroups, getRolePermissions, getAllPermissions } = useAccessManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [customPermissions, setCustomPermissions] = useState<Permission[]>([]);

  // Mock users data - in real app this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Admin',
      email: 'john.admin@company.com',
      role: 'admin',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Supervisor',
      email: 'sarah.supervisor@company.com',
      role: 'supervisor',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Agent',
      email: 'mike.agent@company.com',
      role: 'agent',
      customPermissions: ['edit_customer_data'],
      status: 'active'
    },
    {
      id: 4,
      name: 'Lisa Agent',
      email: 'lisa.agent@company.com',
      role: 'agent',
      status: 'inactive'
    }
  ]);

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

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">Active</Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-medium">Inactive</Badge>
    );
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setCustomPermissions(user.customPermissions || []);
    setIsEditUserOpen(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;

    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id 
        ? { ...user, customPermissions: customPermissions.length > 0 ? customPermissions : undefined }
        : user
    ));

    toast({
      title: "User Updated",
      description: `${selectedUser.name}'s permissions have been updated.`,
    });

    setIsEditUserOpen(false);
    setSelectedUser(null);
    setCustomPermissions([]);
  };

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    setCustomPermissions(prev => 
      checked 
        ? [...prev, permission]
        : prev.filter(p => p !== permission)
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserPermissionCount = (user: User) => {
    const rolePermissions = getRolePermissions(user.role);
    const customCount = user.customPermissions?.length || 0;
    return rolePermissions.length + customCount;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Role Management</h2>
        <p className="text-sm text-gray-600 font-normal">Manage user roles and custom permissions</p>
      </div>

      <Card className="border-gray-200/60 shadow-sm bg-white">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-gray-900">User Roles & Permissions</CardTitle>
              <CardDescription className="text-sm text-gray-600 font-normal">
                {filteredUsers.length} users with role-based access control
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-72 h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border border-gray-200/60 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200/60 bg-gray-50/30">
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-3 px-4">User</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-3 px-4">Role</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-3 px-4">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-3 px-4">Permissions</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-3 px-4">Custom Access</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-3 px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id} className={`border-b border-gray-100/60 hover:bg-gray-50/30 transition-colors ${index === filteredUsers.length - 1 ? 'border-b-0' : ''}`}>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        {getUserPermissionCount(user)} permissions
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {user.customPermissions ? (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
                          +{user.customPermissions.length} custom
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">None</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditUser(user)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Edit User Permissions</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Customize permissions for {selectedUser?.name}. These will be added to their role-based permissions.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <div className="mt-2">
                    {getRoleBadge(selectedUser.role)}
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
                          const hasRolePermission = getRolePermissions(selectedUser.role).includes(permission);
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
                  onClick={() => setIsEditUserOpen(false)}
                  className="text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
