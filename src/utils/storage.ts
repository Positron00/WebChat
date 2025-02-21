import { ChatMessage } from '@/types/chat';

const STORAGE_KEYS = {
  MESSAGES: 'chat_messages',
  THEME: 'theme_preference',
  ACCESSIBILITY: 'accessibility_settings'
} as const;

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'larger';
}

export interface StorageData {
  messages: ChatMessage[];
  theme: 'light' | 'dark' | 'system';
  accessibility: AccessibilitySettings;
  lastUpdated: number;
}

const DEFAULT_SETTINGS: StorageData = {
  messages: [],
  theme: 'system',
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal'
  },
  lastUpdated: Date.now()
};

class StorageManager {
  private isLocalStorageAvailable(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  private getData(): StorageData {
    if (!this.isLocalStorageAvailable()) return DEFAULT_SETTINGS;

    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return DEFAULT_SETTINGS;
    }
  }

  private saveData(data: Partial<StorageData>): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      const currentData = this.getData();
      const newData = {
        ...currentData,
        ...data,
        lastUpdated: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  getMessages(): ChatMessage[] {
    return this.getData().messages;
  }

  saveMessages(messages: ChatMessage[]): void {
    this.saveData({ messages });
  }

  getTheme(): StorageData['theme'] {
    return this.getData().theme;
  }

  saveTheme(theme: StorageData['theme']): void {
    this.saveData({ theme });
  }

  getAccessibilitySettings(): AccessibilitySettings {
    return this.getData().accessibility;
  }

  saveAccessibilitySettings(settings: AccessibilitySettings): void {
    this.saveData({ accessibility: settings });
  }

  clearMessages(): void {
    const data = this.getData();
    data.messages = [];
    this.saveData(data);
  }
}

export const storage = new StorageManager(); 