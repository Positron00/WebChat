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

  // Function to format source as academic citation
  const formatAcademicCitation = (source: Source, index: number) => {
    const authors = source.title.split(' - ')[1] || 'Author';
    const title = source.title.split(' - ')[0] || source.title;
    const year = new Date().getFullYear();
    const journal = source.domain?.replace(/\.(org|com|edu|gov)$/, '') || 'Journal';
    
    return (
      <div className="text-white text-sm mb-4 pl-5 relative">
        <div className="absolute left-0 font-bold text-blue-400">[{index + 1}]</div>
        <div>
          <span className="font-medium">{authors}</span> ({year}). 
          <span className="italic"> {title}. </span>
          <span className="text-blue-300">{journal}</span>, 
          {source.url ? 
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
              {source.url.replace(/^https?:\/\//, '')}
            </a> : 
            <span className="text-gray-400 ml-1">pp. 1-15</span>
          }
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full overflow-y-auto">
      <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
        References
      </h3>
      
      <div className="grid grid-cols-1 gap-2">
        {sources.map((source, index) => (
          <div 
            key={source.id}
            className="hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            {formatAcademicCitation(source, index)}
          </div>
        ))}
      </div>
    </div>
  );
} 