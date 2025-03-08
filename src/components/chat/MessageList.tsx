'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useApp } from '@/contexts/AppContext';
import ReactMarkdown from 'react-markdown';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

// Format message content with double line breaks between sections
// Now returning a string as react-markdown will handle the rendering
const formatMessageContent = (content: string): string => {
  // Process markdown to improve spacing
  return content
    // Add double line breaks between numbered lists
    .replace(/(\d+\.\s.*?)\n(\d+\.)/g, '$1\n\n\n$2')
    // Add double line breaks after section headings 
    .replace(/(.*:)\s*\n/g, '$1\n\n\n')
    // Add double line breaks between bullet points
    .replace(/([*\-•].*)\n([*\-•])/g, '$1\n\n\n$2')
    // Replace single line breaks between paragraphs with double line breaks
    .replace(/([^\s])\n([^\s])/g, '$1\n\n\n$2')
    // Ensure consistent paragraph breaks (make double breaks the minimum)
    .replace(/\n\n/g, '\n\n\n')
    // Make sure we don't have more than three consecutive newlines
    .replace(/\n{4,}/g, '\n\n\n');
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
    const baseClass = role === 'user' 
      ? 'py-2 px-4 rounded-lg break-words max-w-[95%] text-center mx-auto'
      : 'py-3 px-6 rounded-lg break-words max-w-[95%] text-left mx-auto'; // Still slightly more padding for assistant messages
    
    // Use high contrast setting to determine colors
    const colorClass = accessibility.highContrast
      ? (role === 'user' ? 'bg-blue-950 text-white' : 'bg-gray-800 text-white')
      : (role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white');
    
    return `${baseClass} ${colorClass}`;
  };

  return (
    <div className="w-full text-center mb-4">
      <div 
        className="w-full flex-1 min-h-[300px] max-h-[625px] bg-gray-900 text-white rounded-lg border border-gray-700 overflow-y-auto px-[2px] py-1 dark:bg-gray-900 dark:text-white dark:border-gray-700"
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
                <div key={index} className="mb-4 pb-4 border-b border-gray-700/50 last:border-b-0 last:mb-0 last:pb-0" 
                  style={{ borderColor: 'rgba(55, 65, 81, 0.5)' }}>
                  {/* User message */}
                  <div className="mb-2">
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
                      <div className="relative">
                        <div
                          className={getMessageClassName('assistant')}
                          role="article"
                          aria-label="assistant's message"
                        >
                          <ReactMarkdown components={{
                            // Add proper spacing between paragraphs
                            p: ({node, ...props}) => <p className="text-left mb-4" {...props} />,
                            // Add spacing after headings
                            h1: ({node, ...props}) => <h1 className="text-left font-bold text-2xl mb-4 mt-6" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-left font-bold text-xl mb-3 mt-5" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-left font-bold text-lg mb-3 mt-4" {...props} />,
                            // Improve list spacing
                            ul: ({node, ...props}) => <ul className="text-left mb-4 ml-5 list-disc" {...props} />,
                            ol: ({node, ...props}) => <ol className="text-left mb-4 ml-5 list-decimal" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            // Add spacing for other elements
                            blockquote: ({node, ...props}) => <blockquote className="text-left border-l-4 border-gray-400 pl-3 italic mb-4" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />
                          }}>
                            {formatMessageContent(assistantMessage.content)}
                          </ReactMarkdown>
                          
                          {/* Source indicator badge */}
                          {assistantMessage.sources && assistantMessage.sources.length > 0 && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                              <InformationCircleIcon className="w-3 h-3 mr-1" />
                              {assistantMessage.sources.length} {assistantMessage.sources.length === 1 ? 'Source' : 'Sources'}
                            </div>
                          )}
                        </div>
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