# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.10] - 2024-02-21

### Changed
- Updated message layout
  - Positioned assistant responses on the right side
  - Kept user messages on the left side
  - Improved message width and spacing
  - Right-aligned loading indicator and error messages
  - Enhanced visual distinction between user and assistant messages

## [1.3.9] - 2024-02-21

### Changed
- Updated content alignment
  - Center-aligned all messages and text
  - Centered input field text
  - Improved visual balance with centered layout
  - Enhanced readability with consistent alignment
  - Maintained 30% width and left offset

## [1.3.8] - 2024-02-21

### Changed
- Updated landing page layout
  - Positioned content at 30% from left edge
  - Improved message alignment and width
  - Enhanced visual balance
  - Adjusted text alignment for better readability
  - Optimized spacing for new layout

## [1.3.7] - 2024-02-21

### Fixed
- Improved rate limiting handling
  - Added client-side rate limit checks before API calls
  - Enhanced rate limit error messages with wait times
  - Added remaining requests counter
  - Reduced rate limit to 10 requests per minute
  - Added rate limiter utility improvements
  - Better error handling for 429 responses

### Changed
- Updated chat settings for better reliability
  - Adjusted rate limiting parameters
  - Added rate limit window configuration
  - Improved error message clarity

## [1.3.6] - 2024-02-21

### Fixed
- Resolved React hydration errors
  - Fixed server/client state mismatch in Chat component
  - Added proper client-side initialization for storage
  - Improved SSR compatibility for theme and accessibility settings
- Enhanced storage utility
  - Added proper TypeScript types for theme and accessibility
  - Added SSR safety checks for localStorage access
  - Improved error handling and default values
  - Added type safety for theme preferences

### Changed
- Improved state management in AppContext
  - Moved storage initialization to useEffect
  - Added default values matching SSR output
  - Enhanced type safety with proper interfaces
  - Better organization of side effects

## [1.3.5] - 2024-02-21

### Fixed
- Enhanced error handling and validation
  - Added response structure validation in API client
  - Improved error messages with more details
  - Added proper error logging
  - Preserved user messages on API errors
  - Added type guards for API responses
  - Improved retry mechanism error handling

## [1.3.4] - 2024-02-21

### Fixed
- Improved input field interactivity
  - Changed input to textarea for better text handling
  - Added proper styling for text input
  - Fixed focus and interaction issues
  - Maintained single-line appearance with overflow control

## [1.3.3] - 2024-02-21

### Changed
- Improved landing page experience
  - Input field always visible and ready for typing
  - Added autofocus to input field
  - Improved messages area layout with proper spacing
  - Added min-height and max-height constraints
  - Enhanced overall visual hierarchy

## [1.3.2] - 2024-02-21

### Enhanced
- Improved text input functionality
  - Added Enter key support for form submission
  - Converted microphone button to submit button
  - Added proper button states (disabled when input is empty)
  - Improved form submission handling

## [1.3.1] - 2024-02-21

### Changed
- Updated application tagline to "Intelligence at your fingertips"

## [1.3.0] - 2024-02-21

### Changed
- Complete UI redesign inspired by Perplexity's interface
  - New dark theme with teal accent color
  - Centered layout with logo and tagline
  - Modernized input field with microphone button
  - Added bottom toolbar with Focus, Attach, Voice, and Screen options
  - Enhanced image preview styling
  - Added GPT and Pro badge indicators
- Updated component styling for better dark mode support
- Improved accessibility in dark theme

### Added
- New logo SVG with geometric design
- Hero Icons for UI elements
- Bottom toolbar functionality
- Enhanced visual feedback on hover states

## [1.2.1] - 2024-02-21

### Fixed
- Added 'use client' directives to components using React hooks and browser APIs
  - Chat component
  - AppContext provider
  - ErrorBoundary component
- Resolved Next.js App Router client/server component issues
- Fixed configuration by replacing next.config.ts with next.config.js

### Changed
- Updated Next.js configuration for better image optimization and strict mode
- Added proper TypeScript type annotations in next.config.js

## [1.2.0] - 2024-02-21

### Added
- Local storage for messages and user preferences
- PWA support with web manifest and offline capabilities
- Theme support (light/dark/system)
- Accessibility settings (font size, reduced motion, high contrast)
- Offline mode detection and handling
- API retry mechanism with exponential backoff
- Singleton API client with retry logic
- Storage manager for persistent data
- App context for global state management

### Changed
- Enhanced Chat component with accessibility features
- Improved message persistence and retrieval
- Better error handling with custom ApiError class
- Optimized API calls with retry mechanism
- Updated UI for better accessibility
- Enhanced theme handling with system preference support

### Performance
- Added local storage caching
- Implemented singleton pattern for API client
- Added message pruning
- Optimized re-renders with context
- Added offline-first capabilities

### Accessibility
- Added font size controls
- Added reduced motion support
- Added high contrast mode
- Enhanced ARIA attributes
- Added keyboard navigation improvements
- Added screen reader optimizations

### Developer Experience
- Added storage utilities
- Added API client abstraction
- Added context providers
- Added type safety improvements
- Added better error handling
- Added configuration management

### Security
- Added storage availability checks
- Added API retry limits
- Added error boundary improvements
- Added input sanitization
- Added offline mode handling

## [1.1.0] - 2024-02-21

### Added
- Comprehensive test suite with Jest and React Testing Library
- Rate limiting system for API calls
- Message history limit and auto-pruning
- Auto-scroll to latest messages
- Accessibility improvements (ARIA labels, roles, keyboard navigation)
- System prompt configuration
- Chat settings configuration

### Changed
- Improved error handling with custom ApiError class
- Enhanced file validation
- Better TypeScript type safety
- Improved loading states and indicators
- Better message formatting

### Security
- Added rate limiting to prevent API abuse
- Enhanced input validation
- Added message sanitization
- Added file type and size validation

### Developer Experience
- Added Jest configuration
- Added test coverage reporting
- Added test watch mode
- Added proper TypeScript configuration
- Added code documentation
- Improved error handling and debugging

### Accessibility
- Added ARIA labels and roles
- Added keyboard navigation support
- Added screen reader support
- Added proper focus management
- Added proper alt text for images
- Added loading state announcements

### Performance
- Added message history limit
- Added efficient message pruning
- Added smooth scrolling
- Added optimized re-renders

## [1.0.0] - 2024-02-21

### Added
- Initial release of the chatbot application
- Integration with Together AI's Llama 3.3 70B Instruct Turbo model
- Support for both text and image inputs
- Real-time chat interface with message history
- File upload functionality with preview
- Environment configuration management
- Comprehensive error handling system
- TypeScript type definitions for API requests/responses

### Features
- Modern UI with Tailwind CSS styling
- Image upload support with preview and remove functionality
- Real-time loading states with spinner animation
- Error boundary for graceful error handling
- Form validation and error messaging
- Responsive design for all screen sizes

### Technical Improvements
- Type-safe implementation with TypeScript
- Custom error handling with ApiError class
- File validation (size and type)
- Environment variable validation
- Proper error states and loading indicators
- Clean code organization with separate type definitions
- Modular component architecture

### Security
- File type validation
- File size limits (5MB max)
- Environment variable protection
- API error handling
- Input sanitization

### UI/UX
- Loading spinner for API calls
- Error messages with red background
- Hover effects on buttons
- Focus states for inputs
- Disabled states during loading
- Image preview with remove button
- Word break for long messages
- Responsive layout

### Developer Experience
- TypeScript support
- Error boundary for debugging
- Comprehensive type definitions
- Clean code structure
- Environment variable validation
- Proper error logging

### Dependencies
- Next.js with App Router
- TypeScript
- Tailwind CSS
- React 18
- Together AI API integration 