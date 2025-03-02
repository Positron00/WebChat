'use client';

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { MessageInput } from './chat/MessageInput';
import { MessageList } from './chat/MessageList';

export default function Chat() {
  const { state, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!input.trim() && !imageFile) return;
    await sendMessage(input, imageFile);
    setInput('');
    setImageFile(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
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
          onFileSelect={setImageFile}
          isLoading={state.isLoading}
          onNewChat={clearMessages}
        />
      </div>
    </div>
  );
} 