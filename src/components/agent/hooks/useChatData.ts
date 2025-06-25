import { useState, useEffect } from 'react';
import { ChatMessage } from '@/components/admin/chatbot/types';

export const useChatData = (selectedChatId: string | null) => {
  const getMessagesForChat = (chatId: string | null): ChatMessage[] => {
    if (!chatId) return [];
    const messageMap: { [key: string]: ChatMessage[] } = {
      'd8b8a5a3-7b1f-4d2c-9b9a-1e2f3a4b5c6d': [
        {
          id: 1,
          sender: "customer",
          message: "Hi, I need help with my recent order #12345",
          time: "10:30 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "Hello! I'd be happy to help you with your order. Let me look that up for you.",
          time: "10:31 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "customer",
          message: "It was supposed to arrive yesterday but I haven't received it yet",
          time: "10:32 AM",
          type: "text"
        }
      ],
      'a1b2c3d4-e5f6-7890-1234-567890abcdef': [
        {
          id: 1,
          sender: "customer",
          message: "Thanks for your help earlier!",
          time: "10:45 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "You're welcome! Is there anything else I can help you with?",
          time: "10:46 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "customer",
          message: "No, that's all. Have a great day!",
          time: "10:47 AM",
          type: "text"
        }
      ],
      'b2c3d4e5-f6a7-8901-2345-67890abcdef1': [
        {
          id: 1,
          sender: "customer",
          message: "Still waiting for a response...",
          time: "11:00 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "I apologize for the delay. I'm here to help you now. What can I assist you with?",
          time: "11:05 AM",
          type: "text"
        }
      ],
      'c3d4e5f6-a7b8-9012-3456-7890abcdef12': [
        {
          id: 1,
          sender: "customer",
          message: "The product is not working as expected",
          time: "11:15 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "I'm sorry to hear that. Can you tell me more about the issue you're experiencing?",
          time: "11:16 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "customer",
          message: "When I try to use the main feature, it crashes immediately",
          time: "11:17 AM",
          type: "text"
        }
      ]
    };
    return messageMap[chatId] || [];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getMessagesForChat(selectedChatId));

  // Update messages when chat selection changes
  useEffect(() => {
    setMessages(getMessagesForChat(selectedChatId));
  }, [selectedChatId]);

  return {
    messages,
    setMessages
  };
};
