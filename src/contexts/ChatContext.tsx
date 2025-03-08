'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ChatMessage, ChatState, Source } from '@/types/chat';
import { storage } from '@/utils/storage';
import { CHAT_SETTINGS } from '@/config/chat';
import { apiClient } from '@/utils/apiClient';
import { rateLimiter } from '@/utils/rateLimiter';
import { logger } from '@/utils/logger';
import { useApp } from '@/contexts/AppContext';

interface ChatContextType {
  state: ChatState;
  sendMessage: (message: string, imageFile?: File | null) => Promise<void>;
  clearMessages: () => void;
  getMessageHistory: () => ChatMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Function to generate mock sources based on message content
const generateMockSources = (content: string): Source[] => {
  // Only generate sources for certain types of content
  const shouldHaveSources = content.length > 100 && !content.includes("I don't know");
  
  if (!shouldHaveSources) {
    return [];
  }
  
  // Generate 1-5 mock sources
  const sourceCount = Math.floor(Math.random() * 5) + 1;
  
  const mockDomains = [
    'wikipedia.org', 
    'research.edu', 
    'science.gov', 
    'academic-journal.com',
    'nationalgeographic.com',
    'techreview.mit.edu',
    'nature.com',
    'arxiv.org',
    'medicalnews.org',
    'historyarchive.org'
  ];
  
  return Array.from({ length: sourceCount }, (_, i) => {
    // Extract some words from the content to create a realistic title
    const words = content.split(' ');
    const startIndex = Math.floor(Math.random() * (words.length - 10));
    const titleWords = words.slice(startIndex, startIndex + 8 + Math.floor(Math.random() * 5));
    const title = titleWords.join(' ').replace(/[.,;:!?]$/, '') + (Math.random() > 0.5 ? '' : ' - Research');
    
    // Extract a snippet from a different part of the content
    const snippetStart = Math.floor(Math.random() * Math.max(1, content.length - 200));
    const snippetLength = 100 + Math.floor(Math.random() * 100);
    const snippet = content.substring(snippetStart, snippetStart + snippetLength);
    
    // Pick a random domain
    const domain = mockDomains[Math.floor(Math.random() * mockDomains.length)];
    
    return {
      id: `source-${Date.now()}-${i}`,
      title,
      url: Math.random() > 0.2 ? `https://${domain}/article/${Date.now()}${i}` : undefined,
      snippet,
      relevance: 0.5 + (Math.random() * 0.5), // 0.5-1.0 relevance
      domain
    };
  });
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { accessibility } = useApp();
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

  const sendMessage = useCallback(
    async (message: string, imageFile?: File | null) => {
      if (!message.trim() && !imageFile) return;

      try {
        // Check if we can make this request
        if (rateLimiter.isRateLimited()) {
          const timeUntilNext = rateLimiter.getTimeUntilNextAllowed();
          const remainingSeconds = Math.ceil(timeUntilNext / 1000);
          const remainingRequests = rateLimiter.getRemainingRequests();
          setState(prev => ({
            ...prev,
            error: `Too many requests. Please try again in ${remainingSeconds} seconds (${remainingRequests} requests remaining).`
          }));
          return;
        }

        // Create a request ID for tracking
        const requestId = `req_${Date.now()}`;
        logger.info('Sending message to chat API', { requestId, messageLength: message.length, hasImage: !!imageFile });

        // Add this request to the rate limiter
        rateLimiter.addRequest();

        // Update state to show loading and new message
        const userMessage: ChatMessage = {
          role: 'user',
          content: message.trim(),
        };

        setState(prev => ({
          ...prev,
          isLoading: true,
          error: undefined,
          messages: [...prev.messages, userMessage],
        }));

        // Handle image file upload if present
        let imageUrl: string | undefined;
        if (imageFile) {
          try {
            // TODO: Implement actual image upload to a storage service
            // For now, we'll just mock it
            imageUrl = URL.createObjectURL(imageFile);
            logger.info('Image prepared for upload', { requestId, fileSize: imageFile.size });
          } catch (error) {
            logger.error('Failed to prepare image for upload', { requestId, error });
            throw new Error('Failed to upload image');
          }
        }

        // Send message to API
        // Ideally we'd make an actual API call, but for demo with sources we'll mock the response
        // const response = await apiClient.sendChatMessage({
        //   messages: [...state.messages, userMessage].map(msg => ({
        //     role: msg.role,
        //     content: msg.content,
        //   })),
        //   imageUrl,
        //   settings: {
        //     promptStyle: accessibility.promptStyle,
        //     knowledgeFocus: accessibility.knowledgeFocus
        //   }
        // });

        // For demo purposes, mock a response with sources
        const mockResponse = {
          content: `Here is a response to your question about ${message.substring(0, 30)}... with detailed information and a thorough analysis. The data suggests multiple interesting findings related to this topic.

As research has shown, this particular area has seen significant advancements in recent years. According to several studies, the implications are far-reaching and impact various sectors.

In conclusion, the evidence points to several key insights that help us better understand this phenomenon.`,
          role: 'assistant'
        };

        // Add a short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create assistant message with mock sources
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: mockResponse.content,
          sources: generateMockSources(mockResponse.content)
        };

        // Update state with the new message
        setState(prev => ({
          ...prev,
          isLoading: false,
          messages: [...prev.messages, assistantMessage],
        }));

        logger.info('Received response from chat API', { 
          requestId,
          responseLength: assistantMessage.content.length,
          sourceCount: assistantMessage.sources?.length || 0
        });
      } catch (error) {
        logger.error('Error sending message to chat API', error);
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to send message',
        }));
      }
    },
    [state.messages, accessibility.promptStyle, accessibility.knowledgeFocus]
  );

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