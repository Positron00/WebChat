'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import { storage } from '@/utils/storage';
import { CHAT_SETTINGS } from '@/config/chat';
import { apiClient } from '@/utils/apiClient';
import { rateLimiter } from '@/utils/rateLimiter';

interface ChatContextType {
  state: ChatState;
  sendMessage: (message: string, imageFile?: File | null) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChatState>(() => ({
    messages: [],
    isLoading: false,
  }));

  // Load messages from storage on client side
  useEffect(() => {
    setState(prev => ({
      ...prev,
      messages: storage.getMessages(),
    }));
  }, []);

  // Save messages to storage when they change
  useEffect(() => {
    storage.saveMessages(state.messages);
  }, [state.messages]);

  const sendMessage = async (message: string, imageFile?: File | null) => {
    // Check rate limit
    if (rateLimiter.isRateLimited()) {
      const timeUntilNext = rateLimiter.getTimeUntilNextAllowed();
      setState(prev => ({
        ...prev,
        error: `Please wait ${Math.ceil(timeUntilNext / 1000)} seconds before sending another message.`
      }));
      return;
    }

    const newMessage: ChatMessage = {
      role: 'user',
      content: message,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage].slice(-CHAT_SETTINGS.maxMessages),
      isLoading: true,
      error: undefined,
    }));

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const data = await apiClient.sendChatMessage([...state.messages, newMessage], imageUrl);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response
      };

      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          newMessage,
          assistantMessage
        ].slice(-CHAT_SETTINGS.maxMessages),
        isLoading: false,
        error: undefined,
      }));
    } catch (error) {
      console.error('Chat error:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        messages: [...prev.messages, newMessage].slice(-CHAT_SETTINGS.maxMessages),
      }));
    }
  };

  const clearMessages = () => {
    setState(prev => ({
      ...prev,
      messages: [],
    }));
    storage.saveMessages([]);
  };

  return (
    <ChatContext.Provider value={{ state, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 