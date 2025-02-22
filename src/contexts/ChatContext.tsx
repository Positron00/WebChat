'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import { storage } from '@/utils/storage';
import { CHAT_SETTINGS } from '@/config/chat';
import { apiClient } from '@/utils/apiClient';
import { rateLimiter } from '@/utils/rateLimiter';
import { logger } from '@/utils/logger';

interface ChatContextType {
  state: ChatState;
  sendMessage: (message: string, imageFile?: File | null) => Promise<void>;
  clearMessages: () => void;
  getMessageHistory: () => ChatMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChatState>(() => ({
    messages: [],
    isLoading: false,
  }));

  // Load messages from storage on client side
  useEffect(() => {
    try {
      setState(prev => ({
        ...prev,
        messages: storage.getMessages(),
      }));
      logger.info('Loaded messages from storage', { messageCount: state.messages.length });
    } catch (error) {
      logger.error('Failed to load messages from storage', error);
      // Fallback to empty messages array
      setState(prev => ({ ...prev, messages: [] }));
    }
  }, []);

  // Save messages to storage when they change
  useEffect(() => {
    try {
      storage.saveMessages(state.messages);
      logger.debug('Saved messages to storage', { messageCount: state.messages.length });
    } catch (error) {
      logger.error('Failed to save messages to storage', error);
    }
  }, [state.messages]);

  const handleError = useCallback((error: any, requestId: string) => {
    logger.error('Chat error occurred', { error, requestId });
    
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      error: errorMessage,
    }));
  }, []);

  const sendMessage = async (message: string, imageFile?: File | null) => {
    const requestId = `chat_${Date.now()}`;
    logger.info('Sending message', { message, hasImage: !!imageFile }, requestId);

    // Check rate limit
    if (rateLimiter.isRateLimited()) {
      const timeUntilNext = rateLimiter.getTimeUntilNextAllowed();
      const errorMessage = `Rate limit reached. Please wait ${Math.ceil(timeUntilNext / 1000)} seconds before sending another message. ${rateLimiter.getRemainingRequests()} requests remaining in current window.`;
      logger.warn('Rate limit exceeded', { timeUntilNext, remainingRequests: rateLimiter.getRemainingRequests() }, requestId);
      setState(prev => ({
        ...prev,
        error: errorMessage
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
        logger.debug('Image processed successfully', { imageSize: imageFile.size }, requestId);
      }

      // Add request to rate limiter before making API call
      rateLimiter.addRequest();

      const data = await apiClient.sendChatMessage([...state.messages, newMessage], imageUrl);
      logger.info('Received response from API', { 
        responseLength: data.choices[0].message.content.length 
      }, requestId);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
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

      // Log metrics after successful message
      const metrics = apiClient.getMetrics();
      logger.debug('API metrics after message', { metrics }, requestId);
    } catch (error) {
      // Handle rate limit errors specifically
      if (error instanceof Error && error.message.includes('429')) {
        rateLimiter.handleRateLimitError();
        const timeUntilNext = rateLimiter.getTimeUntilNextAllowed();
        const errorMessage = `Rate limit exceeded. Please wait ${Math.ceil(timeUntilNext / 1000)} seconds before trying again.`;
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      } else {
        handleError(error, requestId);
      }
    }
  };

  const clearMessages = useCallback(() => {
    try {
      setState(prev => ({
        ...prev,
        messages: [],
        error: undefined,
      }));
      storage.saveMessages([]);
      logger.info('Cleared all messages');
    } catch (error) {
      logger.error('Failed to clear messages', error);
      handleError(error, 'clear_messages');
    }
  }, [handleError]);

  const getMessageHistory = useCallback((): ChatMessage[] => {
    return state.messages;
  }, [state.messages]);

  const value = {
    state,
    sendMessage,
    clearMessages,
    getMessageHistory,
  };

  return (
    <ChatContext.Provider value={value}>
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