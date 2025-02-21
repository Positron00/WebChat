import { useState, useRef, FormEvent, useEffect } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import Image from 'next/image';
import { CHAT_SETTINGS } from '@/config/chat';
import { storage } from '@/utils/storage';
import { apiClient } from '@/utils/apiClient';
import { useApp } from '@/contexts/AppContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function Chat() {
  const { isOffline, accessibility } = useApp();
  const [state, setState] = useState<ChatState>(() => ({
    messages: storage.getMessages(),
    isLoading: false,
  }));
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
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
    <div 
      className="flex flex-col h-screen max-w-3xl mx-auto p-4"
      role="main"
      aria-label="Chat Interface"
    >
      <div 
        className="flex-1 overflow-y-auto space-y-4 mb-4"
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
            className="flex items-center justify-center text-gray-500 space-x-2"
            role="status"
            aria-label="Loading response"
          >
            <div 
              className={`${
                accessibility.reducedMotion ? '' : 'animate-spin'
              } rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent`}
              aria-hidden="true"
            />
            <span>Thinking...</span>
          </div>
        )}
        {state.error && (
          <div 
            className="text-center text-red-500 p-2 bg-red-50 rounded"
            role="alert"
            aria-live="assertive"
          >
            {state.error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-2"
        aria-label="Message Form"
      >
        <div className="flex gap-2">
          <input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload Image"
            disabled={isOffline}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
            aria-label="Upload Image Button"
            disabled={isOffline}
          >
            Upload Image
          </button>
          {imageFile && (
            <div 
              className="relative w-12 h-12 group"
              role="figure"
              aria-label="Uploaded Image Preview"
            >
              <Image
                src={URL.createObjectURL(imageFile)}
                alt={`Preview of ${imageFile.name}`}
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 
                           transition-opacity"
                aria-label="Remove Image"
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.isLoading || isOffline}
            aria-label="Message Input"
            aria-disabled={state.isLoading || isOffline}
          />
          <button
            type="submit"
            disabled={state.isLoading || (!input.trim() && !imageFile) || isOffline}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send Message"
            aria-disabled={state.isLoading || (!input.trim() && !imageFile) || isOffline}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 