import { useState, useRef, FormEvent } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import Image from 'next/image';

export default function Chat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
      error: undefined,
    }));

    try {
      let imageUrl = null;
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...state.messages, newMessage],
          image: imageUrl,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      setState(prev => ({
        messages: [
          ...prev.messages,
          newMessage,
          { role: 'assistant', content: data.response }
        ],
        isLoading: false,
      }));

      setInput('');
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send message',
      }));
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {state.messages.map((message, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100'
            } max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
        {state.isLoading && (
          <div className="text-center text-gray-500">
            Thinking...
          </div>
        )}
        {state.error && (
          <div className="text-center text-red-500">
            {state.error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Upload Image
          </button>
          {imageFile && (
            <div className="relative w-12 h-12">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Uploaded"
                fill
                className="object-cover rounded"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={state.isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 