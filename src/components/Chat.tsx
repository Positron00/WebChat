'use client';

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { MessageInput } from './chat/MessageInput';
import { MessageList } from './chat/MessageList';
import { XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export default function Chat() {
  const { state, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Chat Content - Always Full Width */}
      <div className="w-full max-w-5xl mx-auto">
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
        />
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
                className="w-full h-auto object-contain rounded max-h-[80vh]"
              />
            </div>
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex justify-end">
              <button
                onClick={attachScreenshotToQuery}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md transition-colors"
                aria-label="Attach screenshot to your query"
              >
                <PaperClipIcon className="w-5 h-5" />
                Attach to Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 