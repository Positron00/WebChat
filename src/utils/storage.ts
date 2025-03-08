import { ChatMessage } from '@/types/chat';

const STORAGE_KEYS = {
  MESSAGES: 'chat_messages',
  THEME: 'theme_preference',
  ACCESSIBILITY: 'accessibility_settings'
} as const;

const MAX_MESSAGES = 50;

const isClient = typeof window !== 'undefined';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large';
  promptStyle: 'balanced' | 'creative' | 'precise' | 'helpful' | 'verbose' | 'concise';
  knowledgeFocus: 'general' | 'medical' | 'legal' | 'science' | 'technology' | 'business' | 'history' | 'nature';
  citeSources: boolean;
  responseTextColor: string;
  queryTextColor: string;
  responseBackgroundColor: string;
  queryBackgroundColor: string;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal',
  promptStyle: 'balanced',
  knowledgeFocus: 'general',
  citeSources: true,
  responseTextColor: '#FFFFFF',
  queryTextColor: '#FFFFFF',
  responseBackgroundColor: '#111827',
  queryBackgroundColor: '#1E3A8A'
};

export type ThemePreference = 'light' | 'dark' | 'system';

export const storage = {
  getMessages(): ChatMessage[] {
    if (!isClient) return [];
    try {
      const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Error reading messages from storage:', error);
      return [];
    }
  },

  saveMessages(messages: ChatMessage[]): void {
    if (!isClient) return;
    try {
      const trimmedMessages = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(trimmedMessages));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  },

  getTheme(): ThemePreference {
    if (!isClient) return 'system';
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return (theme as ThemePreference) || 'system';
    } catch (error) {
      console.error('Error reading theme from storage:', error);
      return 'system';
    }
  },

  saveTheme(theme: ThemePreference): void {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  },

  getAccessibilitySettings(): AccessibilitySettings {
    if (!isClient) return DEFAULT_ACCESSIBILITY;
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
      return settings ? JSON.parse(settings) : DEFAULT_ACCESSIBILITY;
    } catch (error) {
      console.error('Error reading accessibility settings from storage:', error);
      return DEFAULT_ACCESSIBILITY;
    }
  },

  saveAccessibilitySettings(settings: AccessibilitySettings): void {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving accessibility settings to storage:', error);
    }
  },

  clearMessages(): void {
    if (!isClient) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    } catch (error) {
      console.error('Error clearing messages from storage:', error);
    }
  }
}; 