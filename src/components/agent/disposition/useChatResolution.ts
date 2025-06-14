
import { useState } from 'react';
import { ChatResolution } from './types';

export const useChatResolution = () => {
  const [resolutions, setResolutions] = useState<ChatResolution[]>([]);
  const [isResolving, setIsResolving] = useState(false);

  const resolveChat = async (resolution: ChatResolution) => {
    setIsResolving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResolutions(prev => [...prev, resolution]);
      
      console.log('Chat resolved:', resolution);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to resolve chat:', error);
      return { success: false, error: 'Failed to resolve chat' };
    } finally {
      setIsResolving(false);
    }
  };

  const getChatResolution = (chatId: number) => {
    return resolutions.find(r => r.chatId === chatId);
  };

  const isChatResolved = (chatId: number) => {
    return resolutions.some(r => r.chatId === chatId);
  };

  return {
    resolutions,
    isResolving,
    resolveChat,
    getChatResolution,
    isChatResolved
  };
};
