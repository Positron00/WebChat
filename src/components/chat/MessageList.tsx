'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useApp } from '@/contexts/AppContext';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  const { accessibility } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages with respect to reduced motion preference
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    
    if (accessibility.reducedMotion) {
      messagesEndRef.current.scrollIntoView();
    } else {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Apply high contrast theme if enabled
  const getMessageClassName = (role: string) => {
    const baseClass = 'p-4 rounded-lg break-words max-w-[80%] text-center mx-auto';
    const colorClass = accessibility.highContrast
      ? role === 'user'
        ? 'bg-blue-700 text-white'
        : 'bg-gray-700 text-white'
      : role === 'user'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-gray-100 text-gray-800';
    
    return `${baseClass} ${colorClass}`;
  };

  return (
    <div className="w-full text-center mb-4">
      <div 
        className="w-full flex-1 min-h-[300px] max-h-[625px] bg-white/5 rounded-lg border border-white/10 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-label="Chat Messages"
        key={messages.length}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
            <span>Start a conversation...</span>
            <span>Responses will appear here</span>
          </div>
        ) : (
          <>
            {/* Group messages into pairs */}
            {Array.from({ length: Math.ceil(messages.length / 2) }, (_, index) => {
              const userMessage = messages[index * 2];
              const assistantMessage = messages[index * 2 + 1];
              return (
                <div key={index} className="mb-12 pb-12 border-b-2 border-white/10 last:border-b-0 last:mb-0 last:pb-0">
                  {/* User message */}
                  <div className="mb-8">
                    <div
                      className={getMessageClassName('user')}
                      role="note"
                      aria-label="user's message"
                    >
                      {userMessage.content}
                    </div>
                  </div>
                  {/* Assistant message */}
                  {assistantMessage && (
                    <div>
                      <div
                        className={getMessageClassName('assistant')}
                        role="article"
                        aria-label="assistant's message"
                      >
                        {assistantMessage.content}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
        {isLoading && (
          <div 
            className="flex items-center justify-center text-gray-300 space-x-2"
            role="status"
            aria-label="Loading response"
          >
            <div 
              className={`${
                accessibility.reducedMotion ? '' : 'animate-spin'
              } rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent`}
              aria-hidden="true"
            />
            <span>Thinking...</span>
          </div>
        )}
        {error && (
          <div 
            className="text-center text-red-400 p-2 bg-red-900/50 rounded w-full"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 