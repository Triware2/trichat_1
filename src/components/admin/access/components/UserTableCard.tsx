
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UserTable } from './UserTable';
import { User } from '../types';

interface UserTableCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredUsers: User[];
  onEditUser: (user: User) => void;
  getUserPermissionCount: (user: User) => number;
}

export const UserTableCard = ({
  searchTerm,
  onSearchChange,
  filteredUsers,
  onEditUser,
  getUserPermissionCount
}: UserTableCardProps) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-72 h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <UserTable 
          users={filteredUsers}
          onEditUser={onEditUser}
          getUserPermissionCount={getUserPermissionCount}
        />
      </CardContent>
    </Card>
  );
};
