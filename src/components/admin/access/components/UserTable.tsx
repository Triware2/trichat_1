
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Shield, Users, Settings } from 'lucide-react';
import { User, Role } from '../types';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  getUserPermissionCount: (user: User) => number;
}

export const UserTable = ({ users, onEditUser, getUserPermissionCount }: UserTableProps) => {
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

  return (
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
          {users.map((user, index) => (
            <TableRow key={user.id} className={`border-b border-gray-100/60 hover:bg-gray-50/30 transition-colors ${index === users.length - 1 ? 'border-b-0' : ''}`}>
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
                    onClick={() => onEditUser(user)}
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
  );
};
