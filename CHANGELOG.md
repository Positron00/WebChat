# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.23] - 2024-02-22

### Changed
- Updated message bubbles to use high contrast dark theme by default
  - Changed user messages to deep navy background (bg-blue-950) with white text
  - Changed assistant messages to dark charcoal background (bg-gray-800) with white text
  - Removed dependency on accessibility.highContrast setting
  - Improved readability with darker color scheme for better contrast
  - Enhanced visual distinction between message bubbles and container background

## [1.5.22] - 2024-02-22

### Changed
- Made response field border more subtle
  - Changed border color from bright blue to semi-transparent dark gray
  - Updated border-color CSS property to use rgba(55, 65, 81, 0.5) for a softer appearance
  - Modified message dividers to match the new subtle border style
  - Improved visual harmony between the response container and page background
  - Enhanced overall focus on content by reducing visual distractions

## [1.5.21] - 2024-02-22

### Changed
- Re-implemented dark mode styling for response field
  - Changed background to dark gray (bg-gray-900) for better contrast
  - Updated text color to white for improved readability on dark background
  - Added blue highlight border (border-blue-500) for visual emphasis
  - Changed message dividers to blue (border-blue-500/50) for better visibility
  - Enhanced visual distinction between messages and background

## [1.5.20] - 2024-02-22

### Changed
- Reverted response field styling back to original appearance
  - Restored light background (bg-white/5) from dark gray
  - Changed text color back to gray-800 for light background compatibility
  - Reverted border to subtle white/10 border
  - Restored original message divider styling
  - Returned to the original visual design while maintaining increased size

## [1.5.19] - 2024-02-22

### Changed
- Enhanced response field styling with dark mode
  - Changed background to dark gray (bg-gray-900) for stronger contrast
  - Updated text color to pure white for maximum readability
  - Added blue highlight border (border-blue-500) for visual emphasis
  - Changed message dividers to blue (border-blue-500/50) for better visibility
  - Improved visual distinction between the response area and page background
  - Enhanced overall readability with high-contrast color scheme

## [1.5.18] - 2024-02-22

### Changed
- Increased response field height by 25%
  - Changed maximum height from 500px to 625px
  - Maintains minimum height of 300px
  - Provides more vertical space for viewing messages
  - Reduces need for scrolling with longer conversations
  - Enhances overall reading experience

## [1.5.17] - 2024-02-22

### Changed
- Increased width of message fields by 50%
  - Changed container max-width from max-w-2xl (672px) to max-w-5xl (1024px)
  - Both response and query fields maintain equal width
  - Provides more space for content display
  - Improves readability for longer messages
  - Enhances overall user experience with wider chat interface

## [1.5.16] - 2024-02-22

### Changed
- Modernized Submit button design
  - Replaced text label with paper airplane icon
  - Changed button shape from rounded rectangle to circular
  - Improved button positioning and spacing
  - Maintained hover effects and disabled states
  - Enhanced visual appearance while preserving functionality

## [1.5.15] - 2024-02-22

### Changed
- Doubled the input text padding area
  - Increased right padding from pr-24 (6rem) to pr-48 (12rem)
  - Created more space between typed text and Submit button
  - Further improved user experience with longer messages
  - Enhanced text visibility in the input field

## [1.5.14] - 2024-02-22

### Fixed
- Prevented text overlap with Submit button
  - Added proper right padding (pr-24) to input textarea
  - Ensured typed text remains visible and doesn't flow under the button
  - Maintained all input field functionality
  - Improved user experience when typing longer messages

## [1.5.13] - 2024-02-22

### Added
- New Chat button for easy conversation reset
  - Integrated directly into the toolbar alongside other tools
  - Positioned on the right side of the toolbar for better visual balance
  - Styled consistently with other toolbar buttons
  - Text vertically aligned with the Submit button text
  - Added proper hover effects for better user interaction

## [1.5.12] - 2024-02-22

### Changed
- Improved layout consistency across components
  - Added consistent fixed width (max-w-2xl) for both input and response fields
  - Centered both components in the page for better visual balance
  - Removed unnecessary horizontal padding for cleaner alignment
  - Added proper spacing between components
  - Enhanced overall UI symmetry and cohesion

## [1.5.11] - 2024-02-22

### Changed
- Updated input placeholder text
  - Changed from "Ask anything..." to "Just ask..."
  - More concise and direct user prompt
  - Maintained all existing input field functionality
  - Simplified user interface text

## [1.5.10] - 2024-02-22

### Changed
- Removed "Responses" label above message container
  - Simplified user interface by removing redundant text label
  - Cleaner visual appearance with less clutter
  - Maintained all existing functionality and accessibility features
  - Improved UI minimalism while keeping intuitive design

## [1.5.9] - 2024-02-22

### Changed
- Reversed chat interface layout order
  - Moved query input field below the responses section
  - Enhanced chat flow to match traditional messaging interfaces
  - Improved user experience for reviewing conversation history
  - Maintained all existing functionality and styling

## [1.5.8] - 2024-02-22

### Changed
- Improved message container usability
  - Added scrollable message container with max height (500px)
  - Prevented page from extending indefinitely with many messages
  - Maintained minimum height of 300px for consistency
  - Enhanced user experience with scrollable content area
  - Improved overall page layout stability

## [1.5.7] - 2024-02-22

### Accessibility
- Improved text contrast throughout the application
  - Enhanced message card text contrast in light blue and white cards
  - Added explicit text colors for better readability: blue-800 text in blue cards, gray-800 text in white cards
  - Improved contrast of toolbar button text and icons from gray-400 to gray-300
  - Enhanced visibility of the "Responses" label and empty state text
  - Improved loading indicator contrast for better visibility

### Changed
- Updated UI elements for better readability
  - Changed placeholder text contrast
  - Enhanced button text visibility 
  - Improved overall text contrast across message cards
  - Maintained consistent styling while ensuring accessibility standards

## [1.5.6] - 2024-02-22

### Security
- Updated Next.js to version 14.2.24
  - Fixed multiple security vulnerabilities including:
  - Server-Side Request Forgery in Server Actions
  - Cache Poisoning vulnerability
  - Denial of Service in image optimization
  - Authorization bypass vulnerability

### Changed
- Updated project dependencies
  - Upgraded package versions to address deprecated dependencies
  - Resolved npm audit warnings
  - Improved application security and stability

## [1.5.5] - 2024-02-22

### Fixed
- Resolved TypeScript build error in API client
  - Fixed missing return type for sendChatMessage method in apiClient.ts
  - Corrected imports by removing duplicate type references
  - Ensured proper type checking for API responses

## [1.5.4] - 2024-02-22

### Fixed
- Resolved incorrect offline detection
  - Fixed false "You are currently offline" message display
  - Implemented active connectivity verification instead of relying on browser events
  - Added fallback checks to ensure accurate connection status detection
  - Improved user experience by preventing misleading status messages

### Added
- Enhanced offline detection system
  - Added active connectivity checks via fetch requests
  - Created new /api/ping API endpoint for connectivity verification
  - Implemented periodic connectivity checks (every 30 seconds)
  - Added automatic re-checking when browser tab becomes active
  - Added fallback to external endpoint checks when internal API is unreachable
  
### Changed
- Improved Submit button contrast
  - Enhanced visibility with brighter background color (emerald-400)
  - Changed text color to black for better contrast against the background
  - Added border highlight for improved visual prominence
  - Increased button size slightly for better usability
  - Enhanced disabled state visibility

## [1.5.3] - 2024-02-22

### Added
- Comprehensive architectural documentation
  ```mermaid
  graph TD
      subgraph Frontend ["Frontend (Next.js App)"]
          Layout["/app/layout.tsx<br/>Root Layout + Providers"]
          Chat["/components/Chat.tsx<br/>Main Chat Component"]
          
          subgraph Components ["Components"]
              MessageInput["/components/chat/MessageInput.tsx<br/>Input + Toolbar"]
              MessageList["/components/chat/MessageList.tsx<br/>Message Display"]
          end
          
          subgraph Contexts ["Context Providers"]
              AppContext["/contexts/AppContext.tsx<br/>App Settings + Theme"]
              ChatContext["/contexts/ChatContext.tsx<br/>Chat State + Logic"]
          end
          
          subgraph Utils ["Utilities"]
              ApiClient["/utils/apiClient.ts<br/>API Communication"]
              RateLimiter["/utils/rateLimiter.ts<br/>Request Rate Control"]
              Logger["/utils/logger.ts<br/>Logging System"]
              Storage["/utils/storage.ts<br/>Local Storage"]
          end
      end
      
      subgraph Backend ["Backend (API Routes)"]
          ChatAPI["/app/api/chat/route.ts<br/>Chat Endpoint"]
      end
      
      subgraph External ["External Services"]
          TogetherAI["Together AI<br/>LLM API"]
      end

      %% Component Relationships
      Layout --> AppContext
      Layout --> ChatContext
      Layout --> Chat
      
      Chat --> MessageInput
      Chat --> MessageList
      
      %% Context Usage
      ChatContext --> ApiClient
      ChatContext --> RateLimiter
      ChatContext --> Logger
      ChatContext --> Storage
      
      %% API Flow
      ApiClient --> ChatAPI
      ChatAPI --> TogetherAI
      
      %% Data Flow
      MessageInput -.-> |"User Input"| ChatContext
      ChatContext -.-> |"Messages"| MessageList
      
      %% Utility Dependencies
      ApiClient --> Logger
      RateLimiter --> Logger

      classDef context fill:#f9f,stroke:#333,stroke-width:2px,color:#333
      classDef component fill:#bbf,stroke:#333,stroke-width:2px,color:#333
      classDef util fill:#dfd,stroke:#333,stroke-width:2px,color:#333
      classDef api fill:#fdd,stroke:#333,stroke-width:2px,color:#333
      classDef external fill:#ddd,stroke:#333,stroke-width:2px,color:#333
      
      class AppContext,ChatContext context
      class Chat,MessageInput,MessageList component
      class ApiClient,RateLimiter,Logger,Storage util
      class ChatAPI api
      class TogetherAI external
  ```

### Documentation
- Added detailed architecture diagram showing:
  - Frontend component hierarchy and relationships
  - State management and context providers
  - Utility layer organization
  - Backend API integration
  - External service connections
  - Data flow between components
  - System dependencies and interactions

## [1.5.2] - 2024-02-22

### Changed
- Enhanced message spacing and visual separation
  - Added 3rem margin and padding between message pairs
  - Increased spacing between user and assistant messages to 2rem
  - Added thicker bottom borders between conversation pairs
  - Improved visual hierarchy with consistent spacing
  - Removed last border and spacing from final message pair

## [1.5.1] - 2024-02-22

### Fixed
- Improved rate limiting implementation
  - Added dynamic backoff mechanism
  - Fixed timestamp handling in rate limiter
  - Added proper request tracking
  - Enhanced rate limit error handling
  - Added detailed rate limit logging
- Enhanced error messages
  - Added remaining requests information
  - Better wait time calculations
  - More informative rate limit messages
  - Improved error recovery

### Added
- Rate limiter improvements
  - Added backoff multiplier for frequent rate limits
  - Added request tracking before API calls
  - Added rate limit error specific handling
  - Enhanced logging for rate limit events
  - Added rate limit metrics

### Changed
- Rate limit handling in ChatContext
  - Better integration with rate limiter
  - Improved error state management
  - Enhanced user feedback
  - Better recovery from rate limit errors
  - More detailed logging

## [1.5.0] - 2024-02-22

### Added
- Comprehensive logging system
  - Added structured logging with levels (debug, info, warn, error)
  - Added request ID tracking for better traceability
  - Added log rotation to prevent memory issues
  - Added colored console output for better readability
  - Added error rate monitoring
- API metrics tracking
  - Added request count tracking
  - Added error rate monitoring
  - Added response time tracking
  - Added retry count monitoring
  - Added performance threshold warnings

### Enhanced
- Improved error handling
  - Added centralized error handling in ChatContext
  - Enhanced error messages with request IDs
  - Added error recovery mechanisms
  - Better error state management
  - Improved error reporting

### Changed
- Optimized API client
  - Added request ID tracking
  - Enhanced retry mechanism
  - Added metrics collection
  - Improved error handling
  - Better request/response logging
- Enhanced ChatContext implementation
  - Added message history management
  - Improved state updates
  - Better error recovery
  - Enhanced storage handling
  - Added performance monitoring

### Developer Experience
- Added comprehensive logging utilities
- Improved debugging capabilities
- Enhanced error traceability
- Better performance monitoring
- Added development tools for debugging

## [1.4.1] - 2024-02-22

### Fixed
- Resolved ChatContext provider error
  - Added ChatProvider to root layout
  - Implemented sendMessage functionality in ChatContext
  - Fixed context initialization and state management
  - Added proper error handling for chat operations
  - Integrated rate limiting in chat context

### Changed
- Development server now uses port 3001 when 3000 is occupied
- Enhanced error handling in chat operations
- Improved message state management
- Better integration with rate limiter

## [1.4.0] - 2024-02-22

### Added
- Environment configuration with Together AI API key
- Comprehensive component testing
  - Added MessageInput component tests
  - Added MessageList component tests
  - Added test coverage for accessibility features
- New ChatContext for centralized state management
- Dedicated API client with retry mechanism

### Changed
- Refactored Chat component into smaller, focused components
  - Extracted MessageInput component
  - Extracted MessageList component
  - Improved component organization
- Enhanced state management with ChatContext
- Improved error handling in API client
- Better separation of concerns in components
- Enhanced accessibility implementation

### Developer Experience
- Added detailed component documentation
- Improved test coverage
- Better type safety with TypeScript
- Enhanced code organization
- Cleaner component structure

## [1.3.24] - 2024-02-21

### Changed
- Increased input field width
  - Expanded container width from 30% to 50%
  - Improved overall layout proportions
  - Enhanced readability with wider text area
  - Better use of screen space
  - Maintained centered alignment 

## [1.3.23] - 2024-02-21

### Changed
- Increased input field height
  - Changed textarea from 1 row to 3 rows
  - Adjusted padding for better text visibility
  - Improved overall input field appearance
  - Removed overflow restriction
  - Enhanced text input experience 

## [1.3.22] - 2024-02-21

### Changed
- Reordered chat interface layout
  - Moved input field above response field
  - Adjusted spacing between components
  - Improved visual flow from input to responses
  - Enhanced overall user experience
  - Maintained consistent styling 

## [1.3.21] - 2024-02-21

### Changed
- Enhanced response field visibility and appearance
  - Made response field always visible with consistent styling
  - Added background and border to response area
  - Increased minimum height to 300px
  - Improved empty state appearance
  - Better spacing and padding for messages

## [1.3.20] - 2024-02-21

### Changed
- Improved text alignment consistency
  - Centered all messages in the chat
  - Added proper padding for message container
  - Centered form elements and toolbar
  - Improved overall visual balance
  - Enhanced spacing and alignment

## [1.3.19] - 2024-02-21

### Changed
- Updated package name
  - Changed package name to "web-chat-app"
  - Updated package.json configuration
  - Maintained version number and other settings
  - Improved project identification
  - Better package naming convention

## [1.3.18] - 2024-02-21

### Changed
- Increased input field width
  - Expanded container width from 30% to 50%
  - Improved overall layout proportions
  - Enhanced readability with wider text area
  - Better use of screen space
  - Maintained centered alignment 

## [1.3.17] - 2024-02-21

### Changed
- Increased input field height
  - Changed textarea from 1 row to 3 rows
  - Adjusted padding for better text visibility
  - Improved overall input field appearance
  - Removed overflow restriction
  - Enhanced text input experience 

## [1.3.16] - 2024-02-21

### Changed
- Reordered chat interface layout
  - Moved input field above response field
  - Adjusted spacing between components
  - Improved visual flow from input to responses
  - Enhanced overall user experience
  - Maintained consistent styling 

## [1.3.15] - 2024-02-21

### Changed
- Enhanced response field visibility and appearance
  - Made response field always visible with consistent styling
  - Added background and border to response area
  - Increased minimum height to 300px
  - Improved empty state appearance
  - Better spacing and padding for messages

## [1.3.14] - 2024-02-21

### Changed
- Improved text alignment consistency
  - Centered all messages in the chat
  - Added proper padding for message container
  - Centered form elements and toolbar
  - Improved overall visual balance
  - Enhanced spacing and alignment

## [1.3.13] - 2024-02-21

### Changed
- Reverted tagline back to "Intelligence at your fingertips"
- Maintained centered layout and styling

## [1.3.12] - 2024-02-21

### Changed
- Updated layout to match Perplexity design
  - Centered all content including logo and tagline
  - Changed tagline to "Where knowledge begins"
  - Centered input field text and placeholder
  - Centered toolbar items with proper spacing
  - Improved overall visual alignment
  - Maintained 30% width with auto margins

## [1.3.11] - 2024-02-21

### Changed
- Improved overall layout spacing and proportions
- Reduced logo size to 32x32 for better balance
- Adjusted vertical spacing between sections
- Left-aligned logo and tagline for cleaner look
- Simplified container structure for better organization
- Removed unnecessary padding and margins

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