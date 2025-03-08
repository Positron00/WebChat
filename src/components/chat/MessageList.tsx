'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useApp } from '@/contexts/AppContext';
import ReactMarkdown from 'react-markdown';
import { InformationCircleIcon, NewspaperIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

// Function to check if a message contains code blocks
export const hasCodeBlocks = (content: string): boolean => {
  // Check for markdown code blocks (```code```)
  const codeBlockRegex = /```[\s\S]*?```/g;
  return codeBlockRegex.test(content);
};

// Function to extract code blocks from a message
export const extractCodeBlocks = (content: string): { language: string, code: string }[] => {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const codeBlocks: { language: string, code: string }[] = [];
  
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
  }
  
  return codeBlocks;
};

// Add academic-style citation references to the text
const addCitationReferences = (content: string, sourcesCount: number): string => {
  if (sourcesCount === 0) return content;
  
  // Create array of available citation numbers
  const citationNumbers = Array.from({ length: sourcesCount }, (_, i) => i + 1);
  let modifiedContent = content;
  
  // Find sentences to cite
  const sentences = modifiedContent.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length === 0) {
    // If we couldn't parse sentences, just add a citation at the end
    return modifiedContent + ` [${citationNumbers[0]}]`;
  }
  
  // Always cite at least 3 sentences if possible, or all sentences if fewer than 3
  const sentencesToCite = Math.min(
    Math.max(3, Math.ceil(sentences.length * 0.4)), 
    sentences.length
  );
  
  // Select sentences to cite, prioritizing the final sentence
  // and then evenly distributed throughout the text
  const selectedIndices = new Set<number>();
  
  // Always cite the last sentence if available
  if (sentences.length > 0) {
    selectedIndices.add(sentences.length - 1);
  }
  
  // Distribute remaining citations throughout the text
  while (selectedIndices.size < sentencesToCite && selectedIndices.size < citationNumbers.length) {
    // Find an index that hasn't been selected yet
    const index = Math.floor(Math.random() * sentences.length);
    if (!selectedIndices.has(index)) {
      selectedIndices.add(index);
    }
  }
  
  // Apply citations
  const indices = Array.from(selectedIndices).sort((a, b) => a - b);
  for (let i = 0; i < indices.length && i < citationNumbers.length; i++) {
    const sentenceIndex = indices[i];
    const citation = citationNumbers[i];
    
    // Skip sentences that already have citations
    if (sentences[sentenceIndex] && !sentences[sentenceIndex].includes('[')) {
      const citedSentence = sentences[sentenceIndex].replace(/([.!?]+)$/, ` [${citation}]$1`);
      
      // Escape special regex characters in the original sentence
      const escapeRegex = (string: string): string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const originalSentenceEscaped = escapeRegex(sentences[sentenceIndex]);
      
      // Replace just this occurrence
      modifiedContent = modifiedContent.replace(
        new RegExp(`${originalSentenceEscaped}(?![^.!?]*\\[)`), 
        citedSentence
      );
      
      // Update our record of the sentence
      sentences[sentenceIndex] = citedSentence;
    }
  }
  
  // If we somehow didn't add any citations, add one to the last sentence
  if (!modifiedContent.includes('[')) {
    modifiedContent = modifiedContent.replace(/([.!?]+)$/, ` [${citationNumbers[0]}]$1`);
  }
  
  return modifiedContent;
};

// Enhanced message formatting for article-like appearance
const formatArticleContent = (content: string): string => {
  // Check if this is a longer, more structured response that needs an introduction
  const needsIntroduction = content.length > 250 && 
                          (content.includes('# ') || content.includes('## ') || 
                           content.includes('1. ') || content.includes('2. ') ||
                           content.split('\n\n').length > 3);

  // Process markdown to improve article structure
  return content
    // Ensure headings are properly formatted
    .replace(/^(?!#)(.+?):\s*$/gm, '## $1\n')
    // Add proper newlines after headings
    .replace(/^(#+\s.*?)$/gm, '$1\n\n')
    // Format lists with proper spacing
    .replace(/(\d+\.\s.*?)\n(\d+\.)/g, '$1\n\n$2')
    .replace(/([*\-•].*)\n([*\-•])/g, '$1\n\n$2')
    // Ensure paragraphs have proper spacing
    .replace(/([^\s])\n([^\s])/g, '$1\n\n$2')
    // Add introduction section only if needed and not already present
    .replace(/^(?!#)(.+?)(?:\n\n|\n(?=#))/m, (match, p1) => {
      // Only add Introduction if needed and if it doesn't already contain "introduction"
      if (needsIntroduction && 
          !content.toLowerCase().includes('# introduction') && 
          !content.toLowerCase().includes('## introduction') &&
          !p1.toLowerCase().includes('introduction')) {
        return `## Introduction\n\n${p1}\n\n`;
      }
      return match;
    })
    // Add conclusion if there isn't one and content is long enough
    .replace(/(.+)$/m, (match) => {
      if (content.length > 200 && !content.includes('# Conclusion') && !content.includes('## Conclusion')) {
        // Find the last paragraph that might be a conclusion
        const lastParagraphs = content.split('\n\n').slice(-2);
        if (lastParagraphs.some((p: string) => p.toLowerCase().includes('conclusion') || 
                                     p.toLowerCase().includes('summary') || 
                                     p.toLowerCase().includes('in sum'))) {
          // If there's a paragraph that looks like a conclusion, format it properly
          return match.replace(/(.+?\n\n)(.+)$/m, '$1## Conclusion\n\n$2');
        }
      }
      return match;
    })
    // Make sure there are not too many consecutive newlines
    .replace(/\n{3,}/g, '\n\n');
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

  // Apply custom colors or high contrast theme if enabled
  const getMessageClassName = (role: string) => {
    if (role === 'user') {
      const baseClass = 'py-2 px-4 rounded-lg break-words max-w-[95%] text-center mx-auto';
      const colorClass = accessibility.highContrast
        ? 'bg-blue-950 text-white'
        : 'bg-blue-800 text-white';
      return `${baseClass} ${colorClass}`;
    } else {
      // Special styling for assistant messages to make them look like articles
      return 'py-6 px-8 rounded-lg break-words max-w-[95%] mx-auto font-serif text-left border-l-4 border-blue-500 article-content';
    }
  };

  // Get styles for messages based on accessibility settings
  const getMessageStyles = (role: string) => {
    // If high contrast is enabled, use those colors instead of custom colors
    if (accessibility.highContrast) {
      if (role === 'user') {
        return { 
          backgroundColor: '#0c1944', // Darker than bg-blue-950
          color: '#FFFFFF'
        };
      } else {
        return { 
          backgroundColor: '#111827', // Darker than bg-gray-800
          color: '#FFFFFF'
        };
      }
    }
    
    // Otherwise use custom colors
    if (role === 'user') {
      return { 
        backgroundColor: accessibility.queryBackgroundColor,
        color: accessibility.queryTextColor
      };
    } else {
      // For assistant messages
      return { 
        backgroundColor: accessibility.responseBackgroundColor,
        color: accessibility.responseTextColor
      };
    }
  };

  // Render article-formatted assistant messages
  const renderArticleContent = (content: string, hasSources: boolean) => {
    // Format content as an article
    const articleContent = formatArticleContent(content);
    
    return (
      <div className="article-container relative">
        {/* Article header with icon */}
        <div className="flex items-center mb-4 text-blue-400">
          <NewspaperIcon className="w-5 h-5 mr-2" />
        </div>
        
        {/* Article content with enhanced typography */}
        <ReactMarkdown components={{
          // Enhanced paragraph styling
          p: ({node, ...props}) => <p className="text-left mb-4 leading-relaxed" {...props} />,
          // Improved heading hierarchy
          h1: ({node, ...props}) => <h1 className="text-center font-bold text-2xl mb-6 mt-2 text-blue-300" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-left font-bold text-xl mb-4 mt-6 text-blue-400 border-b border-gray-700 pb-1" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-left font-bold text-lg mb-3 mt-5 text-blue-500" {...props} />,
          h4: ({node, ...props}) => <h4 className="text-left font-bold text-base mb-2 mt-4 text-blue-600" {...props} />,
          // Enhanced list styling
          ul: ({node, ...props}) => <ul className="text-left mb-4 ml-6 list-disc" {...props} />,
          ol: ({node, ...props}) => <ol className="text-left mb-4 ml-6 list-decimal" {...props} />,
          li: ({node, ...props}) => <li className="mb-2 leading-relaxed" {...props} />,
          // Better blockquote styling
          blockquote: ({node, ...props}) => <blockquote className="text-left border-l-4 border-blue-500 pl-4 italic mb-4 text-gray-300 bg-gray-700/30 py-2 pr-2 rounded-r" {...props} />,
          // Enhanced emphasis
          strong: ({node, ...props}) => <strong className="font-bold text-blue-200" {...props} />,
          em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
          // Add proper table styling
          table: ({node, ...props}) => <table className="w-full mb-4 border-collapse border border-gray-700" {...props} />,
          th: ({node, ...props}) => <th className="border border-gray-700 p-2 bg-gray-700 text-left" {...props} />,
          td: ({node, ...props}) => <td className="border border-gray-700 p-2" {...props} />,
          // Code formatting without inline prop
          code: ({node, className, ...props}) => {
            const isInline = !className || !className.includes('language-');
            return isInline ? 
              <code className="bg-gray-900 px-1 rounded text-blue-300 font-mono text-sm" {...props} /> : 
              <code className="block bg-gray-900 p-3 rounded text-blue-300 font-mono text-sm my-4 overflow-x-auto" {...props} />;
          }
        }}>
          {articleContent}
        </ReactMarkdown>
        
        {/* Source badge - only show if hasSources AND citeSources is enabled */}
        {hasSources && accessibility.citeSources && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <InformationCircleIcon className="w-3 h-3 mr-1" />
            <span>Cited Sources</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full text-center mb-4">
      <div 
        className="w-full flex-1 min-h-[50vh] max-h-[70vh] bg-gray-900 text-white rounded-lg border border-gray-700 overflow-y-auto px-[2px] py-1 dark:bg-gray-900 dark:text-white dark:border-gray-700"
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
              
              // Add citation references to assistant messages that have sources
              let processedContent = assistantMessage?.content;
              const hasSources = !!(assistantMessage?.sources && assistantMessage.sources.length > 0);
              if (hasSources && assistantMessage && assistantMessage.sources) {
                processedContent = addCitationReferences(
                  assistantMessage.content, 
                  assistantMessage.sources.length
                );
              }
              
              return (
                <div key={index} className="mb-4 pb-4 border-b border-gray-700/50 last:border-b-0 last:mb-0 last:pb-0" 
                  style={{ borderColor: 'rgba(55, 65, 81, 0.5)' }}>
                  {/* User message */}
                  <div className="mb-2">
                    <div
                      className={getMessageClassName('user')}
                      role="note"
                      aria-label="user's message"
                      style={getMessageStyles('user')}
                    >
                      {userMessage.content}
                    </div>
                  </div>
                  {/* Assistant message as article */}
                  {assistantMessage && (
                    <div>
                      <div className="relative">
                        <div
                          className={getMessageClassName('assistant')}
                          role="article"
                          aria-label="assistant's article response"
                          style={getMessageStyles('assistant')}
                        >
                          {processedContent && renderArticleContent(processedContent, hasSources)}
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
          <div className="flex flex-col items-center">
            <div 
              className="text-center text-red-400 p-2 bg-red-900/50 rounded w-full mb-2"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
            <button
              onClick={() => {
                console.log("Diagnostic information:");
                console.log("- Navigator online:", navigator.onLine);
                console.log("- User Agent:", navigator.userAgent);
                console.log("- Current error:", error);
                
                // Check local storage for API key (don't log the actual key)
                const hasApiKey = localStorage.getItem('TOGETHER_API_KEY') !== null;
                console.log("- API key present in localStorage:", hasApiKey);
                
                // Check if we can reach the API ping endpoint
                fetch('/api/ping')
                  .then(response => {
                    console.log("- API ping response:", response.status, response.statusText);
                    return response.text();
                  })
                  .then(text => console.log("- API ping response body:", text))
                  .catch(err => console.log("- API ping error:", err));
                
                // Try a direct test of chat API to isolate the issue
                fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Hello! This is a diagnostic test.' }],
                    promptStyle: 'balanced',
                    knowledgeFocus: 'general',
                    citeSources: false
                  })
                })
                .then(response => {
                  console.log("- Direct API test response status:", response.status, response.statusText);
                  console.log("- Direct API test response headers:", Object.fromEntries([...response.headers.entries()]));
                  if (!response.ok) return response.text().then(text => { throw new Error(text) });
                  return response.json();
                })
                .then(data => console.log("- Direct API test successful:", data))
                .catch(err => console.log("- Direct API test failed:", err.toString()));
                
                // Try to get logs from console
                try {
                  // Access recent console logs
                  console.log("- Check browser console for all recent error logs");
                } catch (err) {
                  console.log("- Error accessing logs:", err);
                }
                
                alert("Diagnostic information has been logged to the console. Please open the browser developer tools to view it.");
              }}
              className="text-xs bg-blue-800 hover:bg-blue-700 text-white py-1 px-2 rounded transition-colors"
            >
              Run Diagnostics
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 