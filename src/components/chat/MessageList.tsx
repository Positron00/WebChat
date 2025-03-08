'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useApp } from '@/contexts/AppContext';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

// Format message content with double line breaks between sections
const formatMessageContent = (content: string): React.ReactNode => {
  // First, handle markdown-style formatting
  const processedContent = content
    // Handle markdown headings and bolded text with line breaks
    .replace(/\*\*(.*?)\*\*/g, (match, group) => {
      // If it's at the start of a line or after a newline, treat as a heading
      if (match.startsWith('**') && (content.indexOf(match) === 0 || content.charAt(content.indexOf(match) - 1) === '\n')) {
        return `\n\n${match}\n\n`;
      }
      return match;
    })
    // Add double line breaks between numbered lists
    .replace(/(\d+\.\s.*?)\n(\d+\.)/g, '$1\n\n$2')
    // Add double line breaks after section headings 
    .replace(/(.*:)\s*\n/g, '$1\n\n')
    // Add double line breaks between bullet points
    .replace(/([*\-•].*)\n([*\-•])/g, '$1\n\n$2')
    // Replace single line breaks between paragraphs with double line breaks
    .replace(/([^\s])\n([^\s])/g, '$1\n\n$2')
    // Make sure we don't have more than two consecutive newlines
    .replace(/\n{3,}/g, '\n\n');
  
  // Split by newlines and map to React elements to preserve formatting
  return processedContent.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < processedContent.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

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
    
    // Use high contrast setting to determine colors
    const colorClass = accessibility.highContrast
      ? (role === 'user' ? 'bg-blue-950 text-white' : 'bg-gray-800 text-white')
      : (role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white');
    
    return `${baseClass} ${colorClass}`;
  };

  return (
    <div className="w-full text-center mb-4">
      <div 
        className="w-full flex-1 min-h-[300px] max-h-[625px] bg-gray-900 text-white rounded-lg border border-gray-700 overflow-y-auto p-4 dark:bg-gray-900 dark:text-white dark:border-gray-700"
        style={{ backgroundColor: '#111827', color: 'white', borderColor: 'rgba(55, 65, 81, 0.5)' }}
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
                <div key={index} className="mb-12 pb-12 border-b-2 border-gray-700/50 last:border-b-0 last:mb-0 last:pb-0" 
                  style={{ borderColor: 'rgba(55, 65, 81, 0.5)' }}>
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
                        {formatMessageContent(assistantMessage.content)}
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