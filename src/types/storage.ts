const STORAGE_KEYS = {
  MESSAGES: 'chat_messages',
  THEME: 'theme_preference',
  ACCESSIBILITY: 'accessibility_settings'
} as const;

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large';
  promptStyle: 'balanced' | 'creative' | 'precise' | 'helpful' | 'verbose' | 'concise';
  knowledgeFocus: 'general' | 'medical' | 'legal' | 'science' | 'technology' | 'business' | 'history';
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal',
  promptStyle: 'balanced',
  knowledgeFocus: 'general'
}; 