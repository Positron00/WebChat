const STORAGE_KEYS = {
  MESSAGES: 'chat_messages',
  THEME: 'theme_preference',
  ACCESSIBILITY: 'accessibility_settings'
} as const;

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  promptStyle: 'balanced' | 'creative' | 'precise' | 'helpful';
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal',
  promptStyle: 'balanced'
}; 