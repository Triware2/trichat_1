
import { useState, useCallback } from 'react';
import { ChatbotCreationWizard } from './ChatbotCreationWizard';
import { BotTrainingHeader } from './components/BotTrainingHeader';
import { BotStatistics } from './components/BotStatistics';
import { BotTrainingTabs } from './components/BotTrainingTabs';

export const BotTraining = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  // Mock data for demonstration
  const [stats] = useState({
    totalBots: 8,
    activeBots: 6,
    llmBots: 4,
    standardBots: 4,
    avgResolution: '94%',
    totalSOPs: 12
  });

  const handleCreateBot = () => {
    setIsWizardOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleOpenTraining = useCallback((botId: string, botType: 'standard' | 'llm') => {
    setSelectedBotId(botId);
    if (botType === 'standard') {
      setActiveTab('training');
    } else {
      setActiveTab('sop-upload');
    }
  }, []);

  const handleOpenConfiguration = useCallback((botId: string) => {
    setSelectedBotId(botId);
    setActiveTab('llm-settings');
  }, []);

  return (
    <div className="space-y-6">
      <BotTrainingHeader onCreateBot={handleCreateBot} />
      
      <BotStatistics stats={stats} />

      <BotTrainingTabs
        activeTab={activeTab}
        selectedBotId={selectedBotId}
        onTabChange={handleTabChange}
        onOpenTraining={handleOpenTraining}
        onOpenConfiguration={handleOpenConfiguration}
      />

      <ChatbotCreationWizard 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen}
      />
    </div>
  );
};
