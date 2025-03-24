/**
 * Application-wide configuration
 */

export const APP_CONFIG = {
  name: 'Web Chat',
  version: '1.15.8',
  lastUpdated: '2025-03-23',
  
  // Display settings
  display: {
    maxMessagesDisplayed: 50,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  // Default theme settings
  theme: {
    defaultDarkMode: true,
    defaultHighContrast: false,
    defaultReducedMotion: false,
  }
}; 