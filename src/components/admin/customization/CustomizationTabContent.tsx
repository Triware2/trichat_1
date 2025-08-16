
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
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { DispositionsManager } from './DispositionsManager';

interface CustomizationTabContentProps {
  activeTab: string;
}

export const CustomizationTabContent = ({ activeTab }: CustomizationTabContentProps) => {
  return (
    <div className="p-6">
      <TabsContent value="overview" className="mt-0">
        <ErrorBoundary>
        <CustomizationOverview />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="themes" className="mt-0">
        <ErrorBoundary>
        <ThemeCustomizer />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="forms" className="mt-0">
        <ErrorBoundary>
        <FormBuilder />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="objects" className="mt-0">
        <ErrorBoundary>
        <CustomObjectManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="fields" className="mt-0">
        <ErrorBoundary>
        <CustomFieldsManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="dispositions" className="mt-0">
        <ErrorBoundary>
          <DispositionsManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="rules" className="mt-0">
        <ErrorBoundary>
        <RuleEngine />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="workflows" className="mt-0">
        <ErrorBoundary>
        <WorkflowBuilder />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="integrations" className="mt-0">
        <ErrorBoundary>
        <IntegrationManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="code-editor" className="mt-0">
        <ErrorBoundary>
        <CodeEditor />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="sandbox" className="mt-0">
        <ErrorBoundary>
        <SandboxEnvironment />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="api-management" className="mt-0">
        <ErrorBoundary>
        <ApiManagement />
        </ErrorBoundary>
      </TabsContent>
    </div>
  );
};
