
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Key, 
  Mail, 
  Phone,
  Building,
  Calendar,
  Activity,
  Settings
} from 'lucide-react';

export const UserManagementCenter = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techcorp.com',
      role: 'Admin',
      organization: 'TechCorp Solutions',
      status: 'active',
      lastLogin: '2 hours ago',
      permissions: ['full_access', 'billing', 'user_management']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@startup.com',
      role: 'User',
      organization: 'StartupXYZ',
      status: 'active',
      lastLogin: '1 day ago',
      permissions: ['chat_access', 'analytics']
    }
  ]);

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleCreateUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'active',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setIsCreateUserOpen(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">User Management Center</h1>
          </div>
          <p className="text-gray-600 ml-12">Complete user lifecycle and permission management</p>
        </div>

        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <CreateUserForm onSubmit={handleCreateUser} onCancel={() => setIsCreateUserOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
            <p className="text-sm text-green-600 font-medium">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Users</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</div>
            <p className="text-sm text-green-600 font-medium">98.5% active rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Admins</CardTitle>
            <Shield className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'Admin').length}</div>
            <p className="text-sm text-orange-600 font-medium">Elevated access</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Organizations</CardTitle>
            <Building className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{new Set(users.map(u => u.organization)).size}</div>
            <p className="text-sm text-blue-600 font-medium">Unique organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={`${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </Badge>
                      <span className="text-sm text-gray-500">Role: {user.role}</span>
                      <span className="text-sm text-gray-500">{user.organization}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={user.status === 'active'}
                    onCheckedChange={() => handleToggleUserStatus(user.id)}
                  />
                  <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
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

const CreateUserForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    permissions: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="John Smith"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="john@company.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
          <Input 
            value={formData.organization}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
            placeholder="Company Name"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create User
        </Button>
      </div>
    </form>
  );
};
