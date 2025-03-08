'use client';

import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

interface CodeBlock {
  language: string;
  code: string;
}

interface CodeCanvasProps {
  codeBlocks: CodeBlock[];
  isVisible: boolean;
}

export function CodeCanvas({ codeBlocks, isVisible }: CodeCanvasProps) {
  if (!isVisible || !codeBlocks || codeBlocks.length === 0) {
    // Display placeholder when no code blocks are available
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full overflow-y-auto">
        <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
          Code Canvas
        </h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <CodeBracketIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-center">No code blocks to display</p>
          <p className="text-center text-sm mt-2">Code will appear here when available</p>
        </div>
      </div>
    );
  }

  // Get a color for the code language
  const getLanguageColor = (language: string = '') => {
    const colors: Record<string, string> = {
      'javascript': 'bg-yellow-500',
      'typescript': 'bg-blue-500',
      'python': 'bg-green-500',
      'java': 'bg-orange-500',
      'c': 'bg-blue-700',
      'cpp': 'bg-blue-600',
      'csharp': 'bg-purple-600',
      'go': 'bg-cyan-500',
      'rust': 'bg-red-500',
      'php': 'bg-indigo-500',
      'ruby': 'bg-red-600',
      'html': 'bg-orange-600',
      'css': 'bg-blue-400',
      'json': 'bg-amber-500',
      'xml': 'bg-gray-500',
      'sql': 'bg-pink-500',
      'bash': 'bg-gray-600',
      'shell': 'bg-gray-600',
      'text': 'bg-gray-500'
    };
    
    return colors[language.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full overflow-y-auto">
      <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
        Code Canvas
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {codeBlocks.map((block, index) => {
          const languageColor = getLanguageColor(block.language);
          
          return (
            <div 
              key={index}
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Language Color Banner */}
              <div className={`h-2 w-full ${languageColor}`}></div>
              
              {/* Header Section */}
              <div className="flex items-center px-4 py-2 border-b border-gray-700">
                <div className={`${languageColor} p-1.5 rounded mr-3 text-white`}>
                  <CodeBracketIcon className="w-4 h-4" />
                </div>
                <h4 className="text-white font-medium text-sm flex-1">
                  {block.language || 'text'}
                </h4>
                <button
                  onClick={() => navigator.clipboard.writeText(block.code)}
                  className="text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              
              {/* Code Section */}
              <pre className="p-4 overflow-x-auto bg-gray-900 text-blue-300 font-mono text-sm">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
} 