import { AgentSettings } from './AgentSettings';

interface OtherTabsContentProps {
  title: string;
}

export const OtherTabsContent = ({ title }: OtherTabsContentProps) => {
  if (title === 'Settings') {
    return <AgentSettings />;
  }
  return <div className="p-6">{title}</div>;
};
