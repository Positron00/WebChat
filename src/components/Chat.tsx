'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { MessageInput } from './chat/MessageInput';
import { MessageList } from './chat/MessageList';
import { SourceCanvas } from './chat/SourceCanvas';
import { XMarkIcon, PaperClipIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Chat() {
  const { state, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [showSources, setShowSources] = useState(true);
  
  // Find the latest assistant message with sources
  const latestAssistantMessageWithSources = [...state.messages]
    .reverse()
    .find(msg => msg.role === 'assistant' && msg.sources && msg.sources.length > 0);

  // Create/clear preview URL when imageFile changes
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  const handleSubmit = async () => {
    if (!input.trim() && !imageFile) return;
    await sendMessage(input, imageFile);
    setInput('');
    setImageFile(null);
  };

  const handleFileSelect = (file: File) => {
    // If it's a screenshot, store it and create preview URL
    if (file.name.startsWith('screenshot-')) {
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
      setScreenshotFile(file);
      // Don't automatically set as imageFile anymore
    } else {
      // For non-screenshots, set as imageFile directly
      setImageFile(file);
    }
  };

  const clearScreenshotPreview = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview(null);
      setScreenshotFile(null);
    }
  };
  
  const attachScreenshotToQuery = () => {
    if (screenshotFile) {
      setImageFile(screenshotFile);
      clearScreenshotPreview();
    }
  };

  const toggleSourcesPanel = () => {
    setShowSources(!showSources);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sources Toggle Button */}
      <div className="w-full max-w-[84rem] mx-auto flex justify-end mb-2">
        <button
          onClick={toggleSourcesPanel}
          className="flex items-center text-sm text-gray-300 hover:text-white p-1 rounded"
          aria-label={showSources ? "Hide canvas" : "Show canvas"}
        >
          <InformationCircleIcon className="w-5 h-5 mr-1" />
          {showSources ? "Hide Canvas" : "Show Canvas"}
        </button>
      </div>
      
      {/* Main Chat Content with Responsive Layout */}
      <div className="w-full max-w-[84rem] mx-auto flex flex-col lg:flex-row gap-4">
        {/* Response Area - Now in a flex container */}
        <div className={`${showSources ? 'lg:w-[68%]' : 'w-full'} transition-all duration-300`}>
          <MessageList
            messages={state.messages}
            isLoading={state.isLoading}
            error={state.error}
          />
          <MessageInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onFileSelect={handleFileSelect}
            isLoading={state.isLoading}
            onNewChat={clearMessages}
            screenshotActive={!!imageFile && imageFile.name.startsWith('screenshot-')}
            onClearScreenshot={() => setImageFile(null)}
            imagePreviewUrl={imagePreviewUrl}
          />
        </div>
        
        {/* Source Canvas - Conditional Display */}
        {showSources && (
          <div className="lg:w-[32%] min-h-[300px] max-h-[625px] hidden lg:block">
            <SourceCanvas 
              sources={latestAssistantMessageWithSources?.sources || []}
              isVisible={true}
            />
          </div>
        )}
      </div>

      {/* Screenshot Preview Overlay */}
      {screenshotPreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Screenshot Preview</h3>
              <button
                onClick={clearScreenshotPreview}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-700"
                aria-label="Close screenshot preview"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-3 overflow-auto flex-grow">
              <img 
                src={screenshotPreview} 
                alt="Screenshot preview" 
                className="max-w-full h-auto rounded"
              />
            </div>
            <div className="flex justify-end gap-2 p-3 bg-gray-800 border-t border-gray-700">
              <button
                onClick={clearScreenshotPreview}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={attachScreenshotToQuery}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
              >
                <PaperClipIcon className="w-4 h-4 mr-1" />
                Attach to Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 