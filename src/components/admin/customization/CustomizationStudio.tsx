
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Settings, 
  Workflow, 
  Plus, 
  Sparkles,
  Code,
  Database,
  Zap,
  FormInput,
  Puzzle,
  Link,
  Wrench,
  Terminal,
  Cloud,
  Key
} from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { CustomFieldsManager } from './CustomFieldsManager';
import { WorkflowBuilder } from './WorkflowBuilder';
import { CustomizationOverview } from './CustomizationOverview';
import { FormBuilder } from './FormBuilder';
import { CustomObjectManager } from './CustomObjectManager';
import { RuleEngine } from './RuleEngine';
import { IntegrationManager } from './IntegrationManager';
import { CodeEditor } from './CodeEditor';
import { SandboxEnvironment } from './SandboxEnvironment';
import { ApiManagement } from './ApiManagement';

export const CustomizationStudio = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Customization Studio
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Phase 3</Badge>
          </h1>
          <p className="text-gray-600 mt-2">
            Enterprise-grade customization platform with code editor, sandbox environments, and API management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Code className="w-4 h-4 mr-2" />
            Developer Mode
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Customization
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Themes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Palette className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Objects</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Scripts</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Code className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Endpoints</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Key className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sandbox Envs</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Cloud className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-11 bg-white border shadow-sm rounded-xl p-1 h-auto">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Sparkles className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="themes" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Palette className="w-4 h-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger 
            value="forms" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <FormInput className="w-4 h-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger 
            value="objects" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Database className="w-4 h-4" />
            Objects
          </TabsTrigger>
          <TabsTrigger 
            value="fields" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Wrench className="w-4 h-4" />
            Fields
          </TabsTrigger>
          <TabsTrigger 
            value="rules" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Zap className="w-4 h-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger 
            value="workflows" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Workflow className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger 
            value="integrations" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Link className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger 
            value="code-editor" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Terminal className="w-4 h-4" />
            Code
          </TabsTrigger>
          <TabsTrigger 
            value="sandbox" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Cloud className="w-4 h-4" />
            Sandbox
          </TabsTrigger>
          <TabsTrigger 
            value="api-management" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Key className="w-4 h-4" />
            APIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CustomizationOverview />
        </TabsContent>

        <TabsContent value="themes">
          <ThemeCustomizer />
        </TabsContent>

        <TabsContent value="forms">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="objects">
          <CustomObjectManager />
        </TabsContent>

        <TabsContent value="fields">
          <CustomFieldsManager />
        </TabsContent>

        <TabsContent value="rules">
          <RuleEngine />
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationManager />
        </TabsContent>

        <TabsContent value="code-editor">
          <CodeEditor />
        </TabsContent>

        <TabsContent value="sandbox">
          <SandboxEnvironment />
        </TabsContent>

        <TabsContent value="api-management">
          <ApiManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
