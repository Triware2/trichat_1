
import { AgentSettings } from './AgentSettings';

interface OtherTabsContentProps {
  customer: any;
}

export const OtherTabsContent = ({ customer }: OtherTabsContentProps) => {
  return <AgentSettings />;
};
