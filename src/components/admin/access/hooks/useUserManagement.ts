
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAccessManagement } from '../useAccessManagement';
import { User, Permission } from '../types';

const mockUsers: User[] = [
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
];

export const useUserManagement = () => {
  const { toast } = useToast();
  const { getRolePermissions } = useAccessManagement();
  const [users, setUsers] = useState<User[]>(mockUsers);

  const updateUserPermissions = (userId: number, customPermissions: Permission[]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, customPermissions: customPermissions.length > 0 ? customPermissions : undefined }
        : user
    ));

    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "User Updated",
        description: `${user.name}'s permissions have been updated.`,
      });
    }
  };

  const getUserPermissionCount = (user: User) => {
    const rolePermissions = getRolePermissions(user.role);
    const customCount = user.customPermissions?.length || 0;
    return rolePermissions.length + customCount;
  };

  return {
    users,
    updateUserPermissions,
    getUserPermissionCount
  };
};
