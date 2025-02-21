import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, AccessibilitySettings, StorageData } from '@/utils/storage';

interface AppContextType {
  theme: StorageData['theme'];
  setTheme: (theme: StorageData['theme']) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: AccessibilitySettings) => void;
  isOffline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<StorageData['theme']>(storage.getTheme());
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(
    storage.getAccessibilitySettings()
  );
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Save theme preference
    storage.saveTheme(theme);
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  useEffect(() => {
    // Save accessibility settings
    storage.saveAccessibilitySettings(accessibility);
    
    // Apply accessibility settings
    document.documentElement.style.fontSize = 
      accessibility.fontSize === 'larger' ? '120%' : 
      accessibility.fontSize === 'large' ? '110%' : 
      '100%';
    
    document.documentElement.classList.toggle(
      'reduce-motion',
      accessibility.reducedMotion
    );
    
    document.documentElement.classList.toggle(
      'high-contrast',
      accessibility.highContrast
    );
  }, [accessibility]);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = {
    theme,
    setTheme,
    accessibility,
    setAccessibility,
    isOffline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 