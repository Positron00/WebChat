'use client';

import React, { useRef, useState } from 'react';
import { MicrophoneIcon, PaperClipIcon, ComputerDesktopIcon, SparklesIcon, PaperAirplaneIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
  onNewChat?: () => void;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const PROMPT_STYLES = {
  balanced: 'Balanced',
  creative: 'Creative',
  precise: 'Precise',
  helpful: 'Helpful'
};

// Define colors for each prompt style
const PROMPT_STYLE_COLORS = {
  balanced: 'bg-indigo-600 text-white',
  creative: 'bg-purple-600 text-white',
  precise: 'bg-blue-600 text-white',
  helpful: 'bg-green-600 text-white'
};

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  isLoading,
  disabled = false,
  onNewChat
}: MessageInputProps) {
  const { isOffline, accessibility, setAccessibility } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  const toggleHighContrast = () => {
    setAccessibility({
      ...accessibility,
      highContrast: !accessibility.highContrast
    });
  };

  const changePromptStyle = (style: 'balanced' | 'creative' | 'precise' | 'helpful') => {
    setAccessibility({
      ...accessibility,
      promptStyle: style
    });
  };

  return (
    <div className="w-full mb-4">
      <div className="relative w-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Just ask..."
          rows={3}
          className="w-full p-4 pr-48 bg-white/5 text-white text-center rounded border border-white/10 focus:outline-none focus:border-[#00FFE0] focus:ring-1 focus:ring-[#00FFE0] placeholder-gray-400 resize-none"
          disabled={isLoading || isOffline || disabled}
          aria-label="Message Input"
          aria-disabled={isLoading || isOffline || disabled}
          autoFocus
        />
        <button
          type="submit"
          disabled={!value.trim()}
          onClick={onSubmit}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-400 text-black font-semibold p-3 rounded-full border-2 border-emerald-300 hover:bg-emerald-500 transition-colors disabled:opacity-70 disabled:bg-gray-600 disabled:border-gray-500 disabled:text-white"
          aria-label="Send Message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
          >
            <SparklesIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">Focus</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
            disabled={isOffline}
          >
            <PaperClipIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">Attach</span>
          </button>

          <button
            type="button"
            className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
          >
            <MicrophoneIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">Voice</span>
          </button>

          <button
            type="button"
            className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
          >
            <ComputerDesktopIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">Screen</span>
          </button>
          
          {/* Settings Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
              aria-expanded={showSettings}
              aria-haspopup="true"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-300">Settings</span>
            </button>
            
            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute bottom-8 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[200px] z-10">
                {/* High Contrast Setting */}
                <div className="p-2 border-b border-gray-700">
                  <h4 className="text-white text-sm font-medium mb-2">Appearance</h4>
                  <div className="flex items-center justify-between">
                    <label htmlFor="high-contrast-toggle" className="text-gray-300 text-xs">
                      Darker Background
                    </label>
                    <button
                      id="high-contrast-toggle"
                      onClick={toggleHighContrast}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full ${
                        accessibility.highContrast ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                      aria-pressed={accessibility.highContrast}
                      aria-label="Toggle darker background mode"
                    >
                      <span
                        className={`${
                          accessibility.highContrast ? 'translate-x-5' : 'translate-x-1'
                        } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Changes the background color of message bubbles for better readability
                  </p>
                </div>
                
                {/* Prompt Style Setting */}
                <div className="p-2">
                  <h4 className="text-white text-sm font-medium mb-2">AI Response Style</h4>
                  <div className="space-y-2">
                    {Object.entries(PROMPT_STYLES).map(([style, label]) => (
                      <div key={style} className="flex items-center">
                        <input
                          type="radio"
                          id={`style-${style}`}
                          name="promptStyle"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={accessibility.promptStyle === style}
                          onChange={() => changePromptStyle(style as any)}
                        />
                        <label htmlFor={`style-${style}`} className="ml-2 text-xs font-medium text-gray-300">
                          {label}
                        </label>
                      </div>
                    ))}
                    <p className="text-gray-400 text-xs mt-2">
                      Select how you want the AI to respond to your messages
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Prompt Style Pill */}
          <div 
            className={`px-2 py-0.5 rounded-full text-xs ${PROMPT_STYLE_COLORS[accessibility.promptStyle]}`}
            aria-label={`Current AI style: ${PROMPT_STYLES[accessibility.promptStyle]}`}
          >
            {PROMPT_STYLES[accessibility.promptStyle]}
          </div>
        </div>
        
        {onNewChat && (
          <button
            type="button"
            onClick={onNewChat}
            className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
            aria-label="Start a new chat"
          >
            <span className="text-xs text-gray-300">New Chat</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept={ALLOWED_FILE_TYPES.join(',')}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload Image"
        disabled={isOffline}
      />
    </div>
  );
} 