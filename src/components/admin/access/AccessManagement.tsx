
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
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="matrix" 
                className="flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors border-b-2 border-transparent rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 bg-transparent shadow-none"
              >
                <Grid3X3 className="w-4 h-4" />
                Permission Matrix
              </TabsTrigger>
              <TabsTrigger 
                value="roles" 
                className="flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors border-b-2 border-transparent rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 bg-transparent shadow-none ml-8"
              >
                <Users className="w-4 h-4" />
                Role Management
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

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
