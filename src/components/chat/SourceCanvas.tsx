'use client';

import React from 'react';
import { Source } from '@/types/chat';
import { LinkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface SourceCanvasProps {
  sources: Source[];
  isVisible: boolean;
}

export function SourceCanvas({ sources, isVisible }: SourceCanvasProps) {
  if (!isVisible || !sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full overflow-y-auto">
      <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
        Sources ({sources.length})
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {sources.map((source) => (
          <div 
            key={source.id}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <div className="flex items-start mb-2">
              <div className="bg-blue-600 text-white p-1 rounded mr-2">
                {source.url ? (
                  <LinkIcon className="w-4 h-4" />
                ) : (
                  <DocumentTextIcon className="w-4 h-4" />
                )}
              </div>
              <h4 className="text-white font-medium text-sm line-clamp-2">
                {source.title}
              </h4>
            </div>
            
            {source.snippet && (
              <p className="text-gray-300 text-xs mt-1 line-clamp-3">
                {source.snippet}
              </p>
            )}
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
              {source.domain && <span>{source.domain}</span>}
              {source.relevance !== undefined && (
                <span className="bg-gray-700 px-2 py-0.5 rounded">
                  {Math.round(source.relevance * 100)}% relevant
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 