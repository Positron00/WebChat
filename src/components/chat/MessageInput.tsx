'use client';

import React, { useRef } from 'react';
import { MicrophoneIcon, PaperClipIcon, ComputerDesktopIcon, SparklesIcon } from '@heroicons/react/24/outline';
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

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  isLoading,
  disabled = false,
  onNewChat
}: MessageInputProps) {
  const { isOffline } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
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
          className="w-full p-4 bg-white/5 text-white text-center rounded border border-white/10 focus:outline-none focus:border-[#00FFE0] focus:ring-1 focus:ring-[#00FFE0] placeholder-gray-400 resize-none"
          disabled={isLoading || isOffline || disabled}
          aria-label="Message Input"
          aria-disabled={isLoading || isOffline || disabled}
          autoFocus
        />
        <button
          type="submit"
          disabled={!value.trim()}
          onClick={onSubmit}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-400 text-black font-semibold px-5 py-2.5 rounded-lg border-2 border-emerald-300 hover:bg-emerald-500 transition-colors disabled:opacity-70 disabled:bg-gray-600 disabled:border-gray-500 disabled:text-white"
          aria-label="Send Message"
        >
          Submit
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