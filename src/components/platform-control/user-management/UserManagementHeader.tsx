
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus } from 'lucide-react';
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
          <CreateUserForm onSubmit={onUserCreate} onCancel={() => setIsCreateUserOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
