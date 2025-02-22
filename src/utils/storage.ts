import { ChatMessage } from '@/types/chat';

const MESSAGES_KEY = 'chat_messages';
const MAX_MESSAGES = 50;

const isClient = typeof window !== 'undefined';

export const storage = {
  getMessages(): ChatMessage[] {
    if (!isClient) return [];
    try {
      const messages = localStorage.getItem(MESSAGES_KEY);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Error reading messages from storage:', error);
      return [];
    }
  },

  saveMessages(messages: ChatMessage[]): void {
    if (!isClient) return;
    try {
      // Keep only the last MAX_MESSAGES
      const trimmedMessages = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(trimmedMessages));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  },

  clearMessages(): void {
    if (!isClient) return;
    try {
      localStorage.removeItem(MESSAGES_KEY);
    } catch (error) {
      console.error('Error clearing messages from storage:', error);
    }
  }
}; 