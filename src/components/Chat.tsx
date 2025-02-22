'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import Image from 'next/image';
import { CHAT_SETTINGS } from '@/config/chat';
import { storage } from '@/utils/storage';
import { apiClient } from '@/utils/apiClient';
import { useApp } from '@/contexts/AppContext';
import { MicrophoneIcon, PaperClipIcon, ComputerDesktopIcon, SparklesIcon } from '@heroicons/react/24/outline';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function Chat() {
  const { isOffline, accessibility } = useApp();
  const [state, setState] = useState<ChatState>(() => ({
    messages: [],  // Initialize empty on server
    isLoading: false,
  }));
  const [input, setInput] = useState<string>('');  // Initialize empty on server
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from storage only on client side
  useEffect(() => {
    setState(prev => ({
      ...prev,
      messages: storage.getMessages(),
    }));
  }, []);

  // Save messages to storage when they change
  useEffect(() => {
    storage.saveMessages(state.messages);
  }, [state.messages]);

  // Scroll to bottom of messages with respect to reduced motion preference
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    
    if (accessibility.reducedMotion) {
      messagesEndRef.current.scrollIntoView();
    } else {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle file validation and setting
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setState(prev => ({
        ...prev,
        error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setState(prev => ({
        ...prev,
        error: 'File size must be less than 5MB'
      }));
      return;
    }

    setImageFile(file);
    setState(prev => ({ ...prev, error: undefined }));
  };

  // Clear form state
  const resetForm = () => {
    setInput('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if ((!input.trim() && !imageFile) || state.isLoading || isOffline) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage].slice(-CHAT_SETTINGS.maxMessages),
      isLoading: true,
      error: undefined,
    }));

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const response = await apiClient.sendChatRequest({
        messages: [...state.messages, newMessage],
        image: imageUrl,
        model: 'meta-llama/Llama-3.3-70b-instruct-turbo-free',
        max_tokens: CHAT_SETTINGS.maxTokens,
        temperature: CHAT_SETTINGS.temperature,
        top_p: CHAT_SETTINGS.topP,
        frequency_penalty: CHAT_SETTINGS.frequencyPenalty,
        presence_penalty: CHAT_SETTINGS.presencePenalty
      });

      // Validate response structure
      if (!response?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from API');
      }

      setState(prev => ({
        messages: [
          ...prev.messages,
          newMessage,
          { role: 'assistant', content: response.choices[0].message.content }
        ].slice(-CHAT_SETTINGS.maxMessages),
        isLoading: false,
        error: undefined,
      }));

      resetForm();
      scrollToBottom();
    } catch (error) {
      console.error('Chat error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        messages: [...prev.messages, newMessage].slice(-CHAT_SETTINGS.maxMessages), // Keep user message even on error
      }));
    }
  }

  // Apply high contrast theme if enabled
  const getMessageClassName = (role: string) => {
    const baseClass = 'p-4 rounded-lg max-w-[80%] break-words';
    const roleClass = role === 'user' ? 'ml-auto' : '';
    const colorClass = accessibility.highContrast
      ? role === 'user'
        ? 'bg-blue-700 text-white'
        : 'bg-gray-700 text-white'
      : role === 'user'
        ? 'bg-blue-100'
        : 'bg-gray-100';
    
    return `${baseClass} ${roleClass} ${colorClass}`;
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Messages Area */}
      <div 
        className="flex-1 space-y-4 min-h-[200px] max-h-[60vh] overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Chat Messages"
      >
        {state.messages.map((message, i) => (
          <div
            key={i}
            className={getMessageClassName(message.role)}
            role={message.role === 'assistant' ? 'article' : 'note'}
            aria-label={`${message.role}'s message`}
          >
            {message.content}
          </div>
        ))}
        {state.isLoading && (
          <div 
            className="flex items-center justify-center text-gray-400 space-x-2"
            role="status"
            aria-label="Loading response"
          >
            <div 
              className={`${
                accessibility.reducedMotion ? '' : 'animate-spin'
              } rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent`}
              aria-hidden="true"
            />
            <span>Thinking...</span>
          </div>
        )}
        {state.error && (
          <div 
            className="text-center text-red-400 p-2 bg-red-900/50 rounded"
            role="alert"
            aria-live="assertive"
          >
            {state.error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative w-full">
        <form 
          onSubmit={handleSubmit} 
          className="w-full"
          aria-label="Message Form"
        >
          {/* Main Input Field */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent);
                }
              }}
              placeholder="Ask anything..."
              rows={1}
              className="w-full p-4 pr-12 bg-[#2C2C2C] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-[#00FFE0] focus:ring-1 focus:ring-[#00FFE0] placeholder-gray-500 resize-none overflow-hidden"
              disabled={state.isLoading || isOffline}
              aria-label="Message Input"
              aria-disabled={state.isLoading || isOffline}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() && !imageFile}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00FFE0] transition-colors disabled:opacity-50 disabled:hover:text-gray-400"
              aria-label="Send Message"
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-gray-400 hover:text-[#00FFE0] transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="text-sm">Focus</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-[#00FFE0] transition-colors flex items-center gap-2"
                disabled={isOffline}
              >
                <PaperClipIcon className="w-5 h-5" />
                <span className="text-sm">Attach</span>
              </button>

              <button
                type="button"
                className="text-gray-400 hover:text-[#00FFE0] transition-colors flex items-center gap-2"
              >
                <MicrophoneIcon className="w-5 h-5" />
                <span className="text-sm">Voice</span>
              </button>

              <button
                type="button"
                className="text-gray-400 hover:text-[#00FFE0] transition-colors flex items-center gap-2"
              >
                <ComputerDesktopIcon className="w-5 h-5" />
                <span className="text-sm">Screen</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-gray-400 text-sm">GPT</div>
              <button
                type="button"
                className="bg-gray-700 text-white text-sm px-3 py-1 rounded hover:bg-gray-600 transition-colors"
              >
                Pro
              </button>
            </div>
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

          {/* Image Preview */}
          {imageFile && (
            <div 
              className="mt-2 relative w-20 h-20 group"
              role="figure"
              aria-label="Uploaded Image Preview"
            >
              <Image
                src={URL.createObjectURL(imageFile)}
                alt={`Preview of ${imageFile.name}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                         flex items-center justify-center opacity-0 group-hover:opacity-100 
                         transition-opacity"
                aria-label="Remove Image"
              >
                ×
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 