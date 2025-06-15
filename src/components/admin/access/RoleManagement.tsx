
import { useState } from 'react';
import { RoleManagementHeader } from './components/RoleManagementHeader';
import { UserTableCard } from './components/UserTableCard';
import { EditUserDialog } from './components/EditUserDialog';
import { useUserManagement } from './hooks/useUserManagement';
import { User } from './types';

export const RoleManagement = () => {
  const { users, updateUserPermissions, getUserPermissionCount } = useUserManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleSaveUser = (userId: number, customPermissions: any[]) => {
    updateUserPermissions(userId, customPermissions);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <RoleManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredUsersCount={filteredUsers.length}
      />

      <UserTableCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredUsers={filteredUsers}
        onEditUser={handleEditUser}
        getUserPermissionCount={getUserPermissionCount}
      />

      <EditUserDialog
        open={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};
