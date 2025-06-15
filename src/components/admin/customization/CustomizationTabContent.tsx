
import { TabsContent } from '@/components/ui/tabs';
import { CustomizationOverview } from './CustomizationOverview';
import { ThemeCustomizer } from './ThemeCustomizer';
import { FormBuilder } from './FormBuilder';
import { CustomObjectManager } from './CustomObjectManager';
import { CustomFieldsManager } from './CustomFieldsManager';
import { RuleEngine } from './RuleEngine';
import { WorkflowBuilder } from './WorkflowBuilder';
import { IntegrationManager } from './IntegrationManager';
import { CodeEditor } from './CodeEditor';
import { SandboxEnvironment } from './SandboxEnvironment';
import { ApiManagement } from './ApiManagement';

interface CustomizationTabContentProps {
  activeTab: string;
}

export const CustomizationTabContent = ({ activeTab }: CustomizationTabContentProps) => {
  return (
    <div className="p-6">
      <TabsContent value="overview" className="mt-0">
        <CustomizationOverview />
      </TabsContent>

      <TabsContent value="themes" className="mt-0">
        <ThemeCustomizer />
      </TabsContent>

      <TabsContent value="forms" className="mt-0">
        <FormBuilder />
      </TabsContent>

      <TabsContent value="objects" className="mt-0">
        <CustomObjectManager />
      </TabsContent>

      <TabsContent value="fields" className="mt-0">
        <CustomFieldsManager />
      </TabsContent>

      <TabsContent value="rules" className="mt-0">
        <RuleEngine />
      </TabsContent>

      <TabsContent value="workflows" className="mt-0">
        <WorkflowBuilder />
      </TabsContent>

      <TabsContent value="integrations" className="mt-0">
        <IntegrationManager />
      </TabsContent>

      <TabsContent value="code-editor" className="mt-0">
        <CodeEditor />
      </TabsContent>

      <TabsContent value="sandbox" className="mt-0">
        <SandboxEnvironment />
      </TabsContent>

      <TabsContent value="api-management" className="mt-0">
        <ApiManagement />
      </TabsContent>
    </div>
  );
};
