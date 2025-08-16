
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Shield, 
  Settings, 
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
  XCircle,
  Clock,
  UserPlus,
  UserMinus,
  Activity,
  History,
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccessManagement } from './useAccessManagement';
import { useUserManagement } from './hooks/useUserManagement';
import { User, Role, Permission, PermissionAuditLog } from './types';

export const RoleManagement = () => {
  const { toast } = useToast();
  const { 
    rolePermissions, 
    permissionGroups, 
    customPermissions,
    auditLogs,
    loading,
    hasPermission,
    updateRolePermissions,
    createCustomPermission,
    exportPermissions
  } = useAccessManagement();
  
  const { 
    users, 
    updateUserPermissions, 
    getUserPermissionCount 
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('users');

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // User statistics
  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<Role, number>);

    return { total, active, inactive, suspended, roleCounts };
  }, [users]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleSaveUser = (userId: number, customPermissions: Permission[]) => {
    updateUserPermissions(userId, customPermissions);
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleSuspendUser = (userId: number) => {
    // Implementation for suspending user
    toast({
      title: "User Suspended",
      description: "User has been suspended successfully.",
    });
  };

  const handleActivateUser = (userId: number) => {
    // Implementation for activating user
    toast({
      title: "User Activated",
      description: "User has been activated successfully.",
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Role Management</h2>
          <p className="text-sm text-slate-600">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAuditLogOpen(true)} size="sm">
            <History className="w-4 h-4 mr-2" />
            Audit Log
          </Button>
          <Button variant="outline" onClick={exportPermissions} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with specific role and permissions.
                </DialogDescription>
              </DialogHeader>
              {/* Add user form would go here */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateUserOpen(false)}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
                  <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.department || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getUserPermissionCount(user)} permissions
                          {user.customPermissions && user.customPermissions.length > 0 && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              +{user.customPermissions.length} custom
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserMinus className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivateUser(user.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserPlus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Role Overview</h3>
                  <p className="text-sm text-gray-600">Manage role permissions and templates</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolePermissions.map((rolePerm) => (
                  <div key={rolePerm.role} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 capitalize">{rolePerm.role}</h4>
                      <Badge variant="outline" className={getRoleBadgeColor(rolePerm.role)}>
                        {rolePerm.permissions.length} permissions
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{rolePerm.description}</p>
                    <div className="space-y-2">
                      {permissionGroups.slice(0, 3).map((group) => {
                        const groupPermissions = group.permissions.filter(p => 
                          rolePerm.permissions.includes(p)
                        );
                        return (
                          <div key={group.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{group.name}</span>
                            <span className="text-sm font-medium">{groupPermissions.length}</span>
                          </div>
                        );
                      })}
                      {rolePerm.permissions.length > 15 && (
                        <div className="text-sm text-gray-500">
                          +{rolePerm.permissions.length - 15} more permissions
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Permission Audit Trail</h3>
                  <p className="text-sm text-gray-600">Track all permission changes and user activities</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={
                          log.action === 'grant' ? 'default' :
                          log.action === 'revoke' ? 'destructive' :
                          'secondary'
                        }>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.permission}</TableCell>
                      <TableCell>
                        {log.targetUser ? (
                          <span className="text-sm">User: {log.targetUser}</span>
                        ) : (
                          <span className="text-sm">Role: {log.targetRole}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {log.reason || 'No reason provided'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-500">
                        {log.ipAddress || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Modify user permissions and settings
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={selectedUser.name} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={selectedUser.email} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select value={selectedUser.role} disabled>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedUser.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Custom Permissions */}
              <div>
                <label className="text-sm font-medium">Custom Permissions</label>
                <div className="mt-3 space-y-3">
                  {permissionGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">{group.name}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {group.permissions.filter(p => 
                            selectedUser.customPermissions?.includes(p)
                          ).length} selected
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2 bg-white p-2 rounded border">
                            <Switch
                              checked={selectedUser.customPermissions?.includes(permission) || false}
                              onCheckedChange={(checked) => {
                                const updatedPermissions = checked
                                  ? [...(selectedUser.customPermissions || []), permission]
                                  : (selectedUser.customPermissions || []).filter(p => p !== permission);
                                setSelectedUser({
                                  ...selectedUser,
                                  customPermissions: updatedPermissions
                                });
                              }}
                            />
                            <label className="text-xs text-gray-700 font-medium cursor-pointer flex-1">
                              {permission.replace(/_/g, ' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-6">
            <div className="flex gap-3 w-full justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsEditUserOpen(false)}
                className="min-w-[80px]"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (selectedUser) {
                    handleSaveUser(selectedUser.id, selectedUser.customPermissions || []);
                  }
                }}
                className="min-w-[120px]"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Log Dialog */}
      <Dialog open={isAuditLogOpen} onOpenChange={setIsAuditLogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permission Audit Log</DialogTitle>
            <DialogDescription>
              Complete audit trail of all permission changes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={
                    log.action === 'grant' ? 'default' :
                    log.action === 'revoke' ? 'destructive' :
                    'secondary'
                  }>
                    {log.action}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">Permission:</span> {log.permission}
                  </div>
                  {log.targetUser && (
                    <div className="text-sm">
                      <span className="font-medium">Target User:</span> {log.targetUser}
                    </div>
                  )}
                  {log.targetRole && (
                    <div className="text-sm">
                      <span className="font-medium">Target Role:</span> {log.targetRole}
                    </div>
                  )}
                  {log.reason && (
                    <div className="text-sm">
                      <span className="font-medium">Reason:</span> {log.reason}
                    </div>
                  )}
                  {log.ipAddress && (
                    <div className="text-sm">
                      <span className="font-medium">IP Address:</span> {log.ipAddress}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
