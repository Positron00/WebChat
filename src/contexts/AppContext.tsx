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
    fontSize: 'normal',
    promptStyle: 'balanced',
    knowledgeFocus: 'general',
    citeSources: false
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
      accessibility.fontSize === 'small' ? '90%' : 
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

    // Initial active check
    const checkConnection = () => {
      // Use a tiny fetch request to verify actual connectivity
      fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' } 
      })
      .then(() => setIsOffline(false))
      .catch(() => {
        // If we can't reach our own API but browser says we're online,
        // do another check against a public endpoint
        if (navigator.onLine) {
          fetch('https://www.google.com/favicon.ico', { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Cache-Control': 'no-cache' }
          })
          .then(() => setIsOffline(false))
          .catch(() => setIsOffline(true));
        } else {
          setIsOffline(true);
        }
      });
    };

    // Run initial check
    checkConnection();
    
    // Set up periodic checking
    const connectionInterval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Also check when visibility changes (tab becomes active)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkConnection();
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', checkConnection);
      clearInterval(connectionInterval);
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