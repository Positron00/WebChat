# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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