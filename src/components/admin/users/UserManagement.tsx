import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AddUserDialog } from './AddUserDialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  UserCheck,
  UserX,
  Shield,
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  phone?: string;
  department?: string;
  permissions: string[];
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setError('Failed to fetch users');
        setIsLoading(false);
        return;
      }
      const mappedUsers: User[] = (data || []).map((u: any) => ({
        id: u.id,
        name: u.full_name,
        email: u.email,
        role: u.role || 'agent',
        status: u.status || 'active',
        lastLogin: u.last_seen || '',
        createdAt: u.created_at || '',
        avatar: u.avatar_url || '',
        phone: u.phone || '',
        department: u.department || '',
        permissions: u.permissions || [],
      }));
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleCreateUser = () => {
    setIsAddUserOpen(true);
  };

  const handleUserAdded = async (newUser: User) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.from('profiles').insert({
      id: newUser.id,
      full_name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      avatar_url: newUser.avatar,
      phone: newUser.phone,
      department: newUser.department,
      permissions: newUser.permissions,
      created_at: new Date().toISOString(),
    });
    if (error) {
      setError('Failed to add user');
      setIsLoading(false);
      toast({ title: 'Error', description: 'Failed to add user.' });
      return;
    }
    toast({ title: 'User Added', description: 'The user has been successfully added.' });
    setIsAddUserOpen(false);
    // Refetch users
    const { data } = await supabase.from('profiles').select('*');
    const mappedUsers: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role || 'agent',
      status: u.status || 'active',
      lastLogin: u.last_seen || '',
      createdAt: u.created_at || '',
      avatar: u.avatar_url || '',
      phone: u.phone || '',
      department: u.department || '',
      permissions: u.permissions || [],
    }));
    setUsers(mappedUsers);
    setFilteredUsers(mappedUsers);
    setIsLoading(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleUserUpdated = async (updatedUser: User) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.from('profiles').update({
      full_name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      avatar_url: updatedUser.avatar,
      phone: updatedUser.phone,
      department: updatedUser.department,
      permissions: updatedUser.permissions,
    }).eq('id', updatedUser.id);
    if (error) {
      setError('Failed to update user');
      setIsLoading(false);
      toast({ title: 'Error', description: 'Failed to update user.' });
      return;
    }
    toast({ title: 'User Updated', description: 'The user has been successfully updated.' });
    setIsEditing(false);
    setSelectedUser(null);
    // Refetch users
    const { data } = await supabase.from('profiles').select('*');
    const mappedUsers: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role || 'agent',
      status: u.status || 'active',
      lastLogin: u.last_seen || '',
      createdAt: u.created_at || '',
      avatar: u.avatar_url || '',
      phone: u.phone || '',
      department: u.department || '',
      permissions: u.permissions || [],
    }));
    setUsers(mappedUsers);
    setFilteredUsers(mappedUsers);
    setIsLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      setError('Failed to delete user');
      setIsLoading(false);
      toast({ title: 'Error', description: 'Failed to delete user.' });
      return;
    }
    toast({ title: 'User Deleted', description: 'The user has been successfully removed.' });
    // Refetch users
    const { data } = await supabase.from('profiles').select('*');
    const mappedUsers: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role || 'agent',
      status: u.status || 'active',
      lastLogin: u.last_seen || '',
      createdAt: u.created_at || '',
      avatar: u.avatar_url || '',
      phone: u.phone || '',
      department: u.department || '',
      permissions: u.permissions || [],
    }));
    setUsers(mappedUsers);
    setFilteredUsers(mappedUsers);
    setIsLoading(false);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
    if (error) {
      setError('Failed to update status');
      setIsLoading(false);
      toast({ title: 'Error', description: 'Failed to update status.' });
      return;
    }
    toast({ title: 'Status Updated', description: `User status changed to ${newStatus}.` });
    // Refetch users
    const { data } = await supabase.from('profiles').select('*');
    const mappedUsers: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role || 'agent',
      status: u.status || 'active',
      lastLogin: u.last_seen || '',
      createdAt: u.created_at || '',
      avatar: u.avatar_url || '',
      phone: u.phone || '',
      department: u.department || '',
      permissions: u.permissions || [],
    }));
    setUsers(mappedUsers);
    setFilteredUsers(mappedUsers);
    setIsLoading(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button onClick={handleCreateUser} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</p>
                <p className="text-sm text-gray-600">Inactive Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                <p className="text-sm text-gray-600">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Select onValueChange={(value) => handleStatusChange(user.id, value)}>
                      <SelectTrigger className="w-24 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activate</SelectItem>
                        <SelectItem value="inactive">Deactivate</SelectItem>
                        <SelectItem value="suspended">Suspend</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};
