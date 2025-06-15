
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Shield, Database } from 'lucide-react';
import { CreateUserForm } from './CreateUserForm';

interface UserManagementHeaderProps {
  isCreateUserOpen: boolean;
  setIsCreateUserOpen: (open: boolean) => void;
  onUserCreate: (userData: any) => void;
}

export const UserManagementHeader = ({ 
  isCreateUserOpen, 
  setIsCreateUserOpen, 
  onUserCreate 
}: UserManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Complete user lifecycle and permission management</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="sm">
          <Shield className="w-4 h-4 mr-2" />
          Bulk Actions
        </Button>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <CreateUserForm onSubmit={onUserCreate} onCancel={() => setIsCreateUserOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
