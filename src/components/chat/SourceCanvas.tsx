'use client';

import React from 'react';
import { Source } from '@/types/chat';
import { LinkIcon, DocumentTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface SourceCanvasProps {
  sources: Source[];
  isVisible: boolean;
}

export function SourceCanvas({ sources, isVisible }: SourceCanvasProps) {
  if (!isVisible || !sources || sources.length === 0) {
    // Display placeholder when no sources are available
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full overflow-y-auto">
        <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
          Source Canvas
        </h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <DocumentTextIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-center">No sources to display</p>
          <p className="text-center text-sm mt-2">Sources will appear here when available</p>
        </div>
      </div>
    );
  }

  // Get a color based on domain
  const getDomainColor = (domain: string = '') => {
    const colors = {
      'wikipedia': 'bg-blue-500',
      'research': 'bg-purple-500',
      'science': 'bg-green-500',
      'national': 'bg-yellow-500',
      'tech': 'bg-cyan-500',
      'nature': 'bg-emerald-500',
      'arx': 'bg-rose-500',
      'medical': 'bg-red-500',
      'history': 'bg-amber-500'
    };
    
    for (const [key, color] of Object.entries(colors)) {
      if (domain.includes(key)) return color;
    }
    
    return 'bg-gray-500';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full overflow-y-auto">
      <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
        Source Canvas
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {sources.map((source, index) => {
          const domainColor = getDomainColor(source.domain);
          
          return (
            <div 
              key={source.id}
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Domain Color Banner */}
              <div className={`h-2 w-full ${domainColor}`}></div>
              
              {/* Content Section */}
              <div className="p-4">
                {/* Title with Icon */}
                <div className="flex items-start mb-3">
                  <div className={`${domainColor} p-2 rounded mr-3 text-white`}>
                    {source.url ? (
                      <LinkIcon className="w-5 h-5" />
                    ) : (
                      <DocumentTextIcon className="w-5 h-5" />
                    )}
                  </div>
                  <h4 className="text-white font-medium text-sm flex-1">
                    {source.title}
                  </h4>
                </div>
                
                {/* Snippet Preview */}
                {source.snippet && (
                  <div className="bg-gray-900/50 rounded p-3 mb-3">
                    <p className="text-gray-300 text-xs line-clamp-3">
                      "{source.snippet}"
                    </p>
                  </div>
                )}
                
                {/* Footer with Domain & Relevance */}
                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                  <div className="flex items-center">
                    <GlobeAltIcon className="w-3 h-3 mr-1" />
                    <span>{source.domain || 'unknown source'}</span>
                  </div>
                  
                  {source.relevance !== undefined && (
                    <span className={`${domainColor} px-2 py-0.5 rounded-full text-white`}>
                      {Math.round(source.relevance * 100)}%
                    </span>
                  )}
                </div>
              </div>
              
              {/* Link Section */}
              {source.url && (
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-gray-700 hover:bg-gray-600 p-2 text-xs text-center text-gray-300 hover:text-white transition-colors"
                >
                  Visit Source →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 