
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Users, Mail, Edit, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: string;
}

interface UserListProps {
  users: User[];
  onToggleUserStatus: (userId: number) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

export const UserList = ({ users, onToggleUserStatus, onEditUser, onDeleteUser }: UserListProps) => {
  return (
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
                  onCheckedChange={() => onToggleUserStatus(user.id)}
                />
                <Button size="sm" variant="outline" onClick={() => onEditUser(user)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDeleteUser(user.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
