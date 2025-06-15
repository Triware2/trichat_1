
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditReport } from '@/components/audit/AuditReport';
import { SecurityAudit } from '@/components/audit/SecurityAudit';
import { PerformanceAudit } from '@/components/audit/PerformanceAudit';
import { NavigationHeader } from '@/components/NavigationHeader';
import { 
  ClipboardList, 
  Shield, 
  Zap, 
  Database, 
  Bell, 
  CreditCard,
  Eye,
  Settings
} from 'lucide-react';

const AuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Platform Audit Dashboard" 
        role="admin"
        userEmail="admin@trichat.com"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 bg-white border shadow-sm rounded-xl p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="performance" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="data" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="ui" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">UI/UX</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="billing" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="integrations" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AuditReport />
          </TabsContent>

          <TabsContent value="security">
            <SecurityAudit />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceAudit />
          </TabsContent>

          <TabsContent value="data">
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Integrity Audit</h3>
              <p className="text-gray-600">Database schema validation and foreign key analysis coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="ui">
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">UI/UX Audit</h3>
              <p className="text-gray-600">Accessibility and responsive design analysis in progress</p>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notification System Audit</h3>
              <p className="text-gray-600">Email, SMS, and in-app notification testing in progress</p>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Billing System Audit</h3>
              <p className="text-gray-600">Subscription management and payment processing validation</p>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Integration Audit</h3>
              <p className="text-gray-600">API endpoints and third-party service connectivity testing</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditDashboard;
