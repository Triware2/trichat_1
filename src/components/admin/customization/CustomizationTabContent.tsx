
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
    <>
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
    </>
  );
};
