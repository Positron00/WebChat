'use client';

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { MessageInput } from './chat/MessageInput';
import { MessageList } from './chat/MessageList';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Chat() {
  const { state, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim() && !imageFile) return;
    await sendMessage(input, imageFile);
    setInput('');
    setImageFile(null);
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    
    // If it's a screenshot, create preview URL
    if (file.name.startsWith('screenshot-')) {
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
    }
  };

  const clearScreenshotPreview = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-screen-xl mx-auto flex">
        {/* Screenshot Preview Pane */}
        {screenshotPreview ? (
          <div className="hidden md:block w-1/3 p-4 mr-4 relative">
            <div className="sticky top-4 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-2 bg-gray-800">
                <h3 className="text-sm font-medium text-white">Screenshot Preview</h3>
                <button
                  onClick={clearScreenshotPreview}
                  className="text-gray-300 hover:text-white"
                  aria-label="Close screenshot preview"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2">
                <img 
                  src={screenshotPreview} 
                  alt="Screenshot preview" 
                  className="w-full h-auto object-contain rounded"
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Chat Content */}
        <div className={`w-full ${screenshotPreview ? 'md:w-2/3' : 'w-full'}`}>
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
            screenshotActive={!!screenshotPreview}
            onClearScreenshot={clearScreenshotPreview}
          />
        </div>
      </div>
    </div>
  );
} 