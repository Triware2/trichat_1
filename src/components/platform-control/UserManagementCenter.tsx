
import { useState } from 'react';
import { UserManagementHeader } from './user-management/UserManagementHeader';
import { UserStatsCards } from './user-management/UserStatsCards';
import { UserList } from './user-management/UserList';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: string;
}

export const UserManagementCenter = () => {
  const { toast } = useToast();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      role: "Admin",
      organization: "TechCorp Inc",
      status: "active"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@innovate.co",
      role: "User",
      organization: "Innovate Co",
      status: "active"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@startup.io",
      role: "User",
      organization: "Startup IO",
      status: "inactive"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david@enterprise.com",
      role: "Admin",
      organization: "Enterprise Corp",
      status: "active"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa@bigtech.net",
      role: "Viewer",
      organization: "BigTech Net",
      status: "active"
    }
  ]);

  const handleUserCreate = (userData: any) => {
    const newUser: User = {
      id: users.length + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      organization: userData.organization,
      status: 'active'
    };
    
    setUsers([...users, newUser]);
    setIsCreateUserOpen(false);
    
    toast({
      title: "User Created",
      description: `${userData.name} has been successfully added to the system.`,
    });
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Status Updated",
      description: `${user?.name} is now ${user?.status === 'active' ? 'inactive' : 'active'}.`,
    });
  };

  const handleEditUser = (user: User) => {
    toast({
      title: "Edit User",
      description: `Edit functionality for ${user.name} would open here.`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <UserManagementHeader 
          isCreateUserOpen={isCreateUserOpen}
          setIsCreateUserOpen={setIsCreateUserOpen}
          onUserCreate={handleUserCreate}
        />
        
        <UserStatsCards users={users} />
        
        <UserList 
          users={users}
          onToggleUserStatus={handleToggleUserStatus}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
};
