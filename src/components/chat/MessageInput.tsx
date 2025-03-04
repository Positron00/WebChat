'use client';

import React, { useRef, useState } from 'react';
import { MicrophoneIcon, PaperClipIcon, ComputerDesktopIcon, SparklesIcon, PaperAirplaneIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import path from 'path';
import { saveAs } from 'file-saver';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
  onNewChat?: () => void;
  screenshotActive?: boolean;
  onClearScreenshot?: () => void;
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

// Define knowledge focus areas
const KNOWLEDGE_FOCUS = {
  general: 'General',
  medical: 'Medical',
  legal: 'Legal',
  physics: 'Physics',
  chemistry: 'Chemistry',
  technology: 'Technology',
  business: 'Business',
  history: 'History'
};

// Define colors for knowledge focus areas
const KNOWLEDGE_FOCUS_COLORS = {
  general: 'bg-gray-600 text-white',
  medical: 'bg-red-600 text-white',
  legal: 'bg-yellow-600 text-white',
  physics: 'bg-blue-800 text-white',
  chemistry: 'bg-green-800 text-white',
  technology: 'bg-cyan-700 text-white',
  business: 'bg-amber-700 text-white',
  history: 'bg-orange-700 text-white'
};

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  isLoading,
  disabled = false,
  onNewChat,
  screenshotActive = false,
  onClearScreenshot
}: MessageInputProps) {
  const { isOffline, accessibility, setAccessibility } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFocusDropdown, setShowFocusDropdown] = useState(false);
  const [isCapturingScreen, setIsCapturingScreen] = useState(false);

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

  const changeKnowledgeFocus = (focus: 'general' | 'medical' | 'legal' | 'physics' | 'chemistry' | 'technology' | 'business' | 'history') => {
    setAccessibility({
      ...accessibility,
      knowledgeFocus: focus
    });
    setShowFocusDropdown(false);
  };

  const captureScreen = async () => {
    try {
      setIsCapturingScreen(true);
      
      // Request screen capture permission and stream
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      
      // Create video element to capture the stream
      const video = document.createElement('video');
      video.srcObject = mediaStream;
      
      // Wait for video metadata to load
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      
      // Create canvas to draw the captured frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Stop all tracks in the stream
      mediaStream.getTracks().forEach(track => track.stop());
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create screenshot blob');
        }, 'image/png');
      });
      
      // Create file with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `screenshot-${timestamp}.png`;
      
      // Create a File object
      const file = new File([blob], fileName, { type: 'image/png' });
      
      // Save the file
      saveAs(blob, fileName);
      
      // Use the existing onFileSelect handler to add the screenshot to the chat
      onFileSelect(file);
      
    } catch (error) {
      console.error('Error capturing screen:', error);
      alert('Failed to capture screen. Please ensure you have granted screen capture permissions.');
    } finally {
      setIsCapturingScreen(false);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="relative">
        {/* Input field */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Just ask..."
          className="w-full py-3 pl-3 pr-48 bg-gray-950 border border-white/10 rounded-full outline-none text-white placeholder-gray-500 disabled:opacity-50 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !disabled) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={1}
          disabled={disabled}
        />

        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-full p-2 disabled:opacity-50 disabled:pointer-events-none"
          disabled={!value.trim() || isLoading || disabled}
          onClick={onSubmit}
          aria-label="Submit message"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-2">
          {/* Focus button and dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFocusDropdown(!showFocusDropdown)}
              className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
            >
              <SparklesIcon className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-300">Focus</span>
            </button>
            
            {/* Focus Dropdown */}
            {showFocusDropdown && (
              <div className="absolute bottom-8 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[200px] z-10">
                <h4 className="text-white text-sm font-medium mb-2">Knowledge Focus</h4>
                <div className="space-y-2">
                  {Object.entries(KNOWLEDGE_FOCUS).map(([focus, label]) => (
                    <div key={focus} className="flex items-center">
                      <input
                        type="radio"
                        id={`focus-${focus}`}
                        name="knowledgeFocus"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={accessibility.knowledgeFocus === focus}
                        onChange={() => changeKnowledgeFocus(focus as any)}
                      />
                      <label htmlFor={`focus-${focus}`} className="ml-2 text-xs font-medium text-gray-300">
                        {label}
                      </label>
                    </div>
                  ))}
                  <p className="text-gray-400 text-xs mt-2">
                    Select a knowledge domain for AI responses
                  </p>
                </div>
              </div>
            )}
          </div>

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
            className={`p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px] ${screenshotActive ? 'bg-white/10' : ''}`}
            onClick={screenshotActive ? onClearScreenshot : captureScreen}
            disabled={isCapturingScreen || isOffline}
            aria-label={screenshotActive ? "Clear screenshot" : "Capture screenshot"}
          >
            <ComputerDesktopIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">
              {isCapturingScreen ? 'Capturing...' : screenshotActive ? 'Clear Screen' : 'Screen'}
            </span>
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
          
          {/* Knowledge Focus Pill */}
          <div 
            className={`px-2 py-0.5 rounded-full text-xs ${KNOWLEDGE_FOCUS_COLORS[accessibility.knowledgeFocus]}`}
            aria-label={`Knowledge focus: ${KNOWLEDGE_FOCUS[accessibility.knowledgeFocus]}`}
          >
            {KNOWLEDGE_FOCUS[accessibility.knowledgeFocus]}
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