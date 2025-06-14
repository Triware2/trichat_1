
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
      admin: { color: 'bg-red-100 text-red-800', icon: Shield },
      supervisor: { color: 'bg-blue-100 text-blue-800', icon: Users },
      agent: { color: 'bg-green-100 text-green-800', icon: Settings }
    };
    
    const { color, icon: Icon } = config[role];
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-600">Manage user roles and custom permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Roles & Permissions</CardTitle>
              <CardDescription>
                {filteredUsers.length} users with role-based access control
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Custom Access</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getUserPermissionCount(user)} permissions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.customPermissions ? (
                      <Badge className="bg-orange-100 text-orange-800">
                        +{user.customPermissions.length} custom
                      </Badge>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>
              Customize permissions for {selectedUser?.name}. These will be added to their role-based permissions.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Additional Permissions</h4>
                <div className="space-y-4">
                  {permissionGroups.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">{group.name}</h5>
                      <div className="grid grid-cols-1 gap-2 pl-4">
                        {group.permissions.map((permission) => {
                          const hasRolePermission = getRolePermissions(selectedUser.role).includes(permission);
                          const hasCustomPermission = customPermissions.includes(permission);
                          
                          return (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission}
                                checked={hasCustomPermission}
                                disabled={hasRolePermission}
                                onCheckedChange={(checked) => handlePermissionToggle(permission, checked as boolean)}
                              />
                              <Label htmlFor={permission} className="text-sm capitalize">
                                {permission.replace(/_/g, ' ')}
                                {hasRolePermission && (
                                  <Badge variant="outline" className="ml-2 text-xs">
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

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
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
