
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Grid3X3, Settings } from 'lucide-react';
import { PermissionMatrix } from './PermissionMatrix';
import { RoleManagement } from './RoleManagement';

export const AccessManagement = () => {
  const [activeTab, setActiveTab] = useState('matrix');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Access Management</h1>
          <p className="text-gray-600 mt-1">Control user permissions and role-based access across the system</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 h-auto p-0">
          <TabsTrigger 
            value="matrix" 
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-medium py-3 px-6 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 data-[state=inactive]:shadow-none transition-all"
          >
            <Grid3X3 className="w-4 h-4" />
            Permission Matrix
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-medium py-3 px-6 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 data-[state=inactive]:shadow-none transition-all"
          >
            <Users className="w-4 h-4" />
            Role Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <PermissionMatrix />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
