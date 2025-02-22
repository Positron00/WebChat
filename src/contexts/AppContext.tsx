'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, AccessibilitySettings, ThemePreference } from '@/utils/storage';

interface AppContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: AccessibilitySettings) => void;
  isOffline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default values that match server-side rendering
  const [theme, setTheme] = useState<ThemePreference>('system');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal'
  });
  const [isOffline, setIsOffline] = useState(false);

  // Load settings from storage on client-side only
  useEffect(() => {
    setTheme(storage.getTheme());
    setAccessibility(storage.getAccessibilitySettings());
    setIsOffline(!navigator.onLine);
  }, []);

  // Save theme changes to storage and apply them
  useEffect(() => {
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

  // Save and apply accessibility settings
  useEffect(() => {
    storage.saveAccessibilitySettings(accessibility);
    
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

  // Handle online/offline status
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