
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
        <TabsList className="grid w-full grid-cols-2 bg-white border shadow-sm rounded-xl p-1 h-auto">
          <TabsTrigger 
            value="matrix" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-4"
          >
            <Grid3X3 className="w-4 h-4" />
            Permission Matrix
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-4"
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
