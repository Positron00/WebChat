# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.15.8] - 2025-03-23

### Fixed
- Improved font consistency in response texts
  - Standardized all text elements to use the same base font size
  - Updated heading hierarchy with consistent sizing and spacing
  - Added consistent padding and margin for better readability
  - Improved visual hierarchy between headings and paragraphs
  - Fixed inconsistent sizing in lists, blockquotes, and code blocks
  - Enhanced overall article-style formatting

### Changed
- Enhanced article formatting logic
  - Only add "Introduction" section when there are multiple sections
  - Improved detection of content structure to determine when headers are needed
  - Refined spacing between different content elements

## [1.15.7] - 2025-03-08

### Changed
- Removed blue background from the logo icon
  - Created new transparent version of the neural network icon
  - Updated background color to match the browser window (#1C1C1C)
  - Improved visual integration with the dark theme
  - Enhanced overall appearance with seamless background transition

## [1.15.6] - 2025-03-08

### Changed
- Increased logo size by 3x (from 48px to 144px) for better visibility and impact
- Maintained transparent background for proper integration with the dark theme

## [1.15.5] - 2025-03-08

### Changed
- Updated the app logo to use the new custom-designed icon
- Increased logo size for better visibility

## [1.15.4] - 2025-03-08

### Fixed
- Fixed tagline typography issues:
  - Improved letter spacing for better readability
  - Added vertical padding to prevent text cutoff
  - Adjusted line height for better text display
  - Enhanced overall text appearance
  - Fixed alignment with copyright symbol

## [1.15.3] - 2025-03-08

### Changed
- Enhanced tagline design for more visual impact
  - Added elegant Playfair Display font for the tagline
  - Applied bold weight and tighter letter spacing for modern appeal
  - Created gradient text effect with blue to teal color transition
  - Added standard copyright symbol (©) in matching teal color
  - Implemented proper font configuration with Next.js font system
  - Updated Tailwind configuration to support custom font families
  - Enhanced overall branding with more professional typography

## [1.15.2] - 2025-03-08

### Changed
- Enhanced message container height responsiveness
  - Changed message container from fixed pixel heights to viewport-relative units
  - Increased minimum height from 300px to 50% of viewport height (50vh)
  - Set maximum height to 70% of viewport height (70vh)
  - Updated both message container and canvas container for consistency
  - Improved responsiveness on different screen sizes
  - Better utilization of available vertical space in the browser window

## [1.15.1] - 2025-03-08

### Documentation
- Updated architecture documentation with latest features
  - **Component Architecture:**
    - Main Chat component orchestrates all interactions and UI layout
    - MessageList handles rendering of conversation content
    - Conditional canvas system for Sources and Code display
    - Color-themed UI with customizable appearances
    - Accessible design with high contrast options
  
  - **Feature Organization:**
    - Input features: text input, voice recognition, file uploads
    - Output features: formatted messages, code blocks, source citations
    - Settings system: appearance, citations, AI response styles
    - Canvas system: interchangeable code and source canvases
  
  - **Data Flow:**
    - User inputs flow from MessageInput to Chat component
    - Messages processed through the ChatContext system
    - Response formatting handled by MessageList component
    - Canvas visibility controlled by message content detection
    - Style settings propagated through context providers
  
  - **Enhanced Architecture Diagram:**
    ```mermaid
    graph TD
        subgraph FrontendComponents["Frontend Components"]
            Chat["Chat.tsx<br/>Main Component"]
            
            subgraph InputComponents["Input Components"]
                MessageInput["MessageInput.tsx<br/>User Input"]
                VoiceRecognition["Voice Recognition"]
                ScreenshotCapture["Screenshot Capture"]
                FileUpload["File Upload"]
            end
            
            subgraph OutputComponents["Output Components"]
                MessageList["MessageList.tsx<br/>Messages Display"]
                SourceCanvas["SourceCanvas.tsx<br/>Citation Display"]
                CodeCanvas["CodeCanvas.tsx<br/>Code Display"]
            end
            
            subgraph SettingsSystem["Settings"]
                SettingsDropdown["Settings UI"]
                StyleOptions["Style Dropdown"]
                FocusOptions["Focus Dropdown"]
                ColorCustomization["Advanced Color Controls"]
            end
        end
        
        subgraph ContextProviders["Context Providers"]
            AppContext["AppContext.tsx<br/>App Settings"]
            ChatContext["ChatContext.tsx<br/>Message State"]
        end
        
        subgraph UtilityLayer["Utilities"]
            ApiClient["apiClient.ts"]
            Storage["storage.ts"]
            ContentProcessing["Content Processors<br/>Code & Citation Detection"]
        end
        
        subgraph BackendServices["Backend"]
            ApiRoutes["API Routes"]
            TogetherAI["Together AI<br/>Llama 3.3"]
        end
        
        %% Component Relationships
        Chat --> MessageInput
        Chat --> MessageList
        Chat --> SourceCanvas
        Chat --> CodeCanvas
        
        MessageInput --> VoiceRecognition
        MessageInput --> ScreenshotCapture
        MessageInput --> FileUpload
        MessageInput --> SettingsDropdown
        SettingsDropdown --> StyleOptions
        SettingsDropdown --> FocusOptions
        SettingsDropdown --> ColorCustomization
        
        %% Context Connections
        Chat --> AppContext
        Chat --> ChatContext
        MessageInput --> AppContext
        MessageList --> AppContext
        SourceCanvas --> AppContext
        CodeCanvas --> AppContext
        
        %% Utility Connections
        ChatContext --> ApiClient
        MessageList --> ContentProcessing
        AppContext --> Storage
        
        %% Backend Connections
        ApiClient --> ApiRoutes
        ApiRoutes --> TogetherAI
        
        %% Data Flow
        MessageInput -.-> |"User Input"| Chat
        Chat -.-> |"Send Message"| ChatContext
        ChatContext -.-> |"API Request"| ApiClient
        ApiClient -.-> |"Response"| ChatContext
        ChatContext -.-> |"Messages"| Chat
        Chat -.-> |"Render"| MessageList
        Chat -.-> |"Code Detection"| CodeCanvas
        Chat -.-> |"Source Detection"| SourceCanvas
        MessageList -.-> |"Code Block Detection"| ContentProcessing
        
        classDef component fill:#bbf,stroke:#333,stroke-width:1px,color:#000
        classDef context fill:#f9f,stroke:#333,stroke-width:1px,color:#000
        classDef utility fill:#dfd,stroke:#333,stroke-width:1px,color:#000
        classDef backend fill:#fdd,stroke:#333,stroke-width:1px,color:#000
        
        class Chat,MessageInput,MessageList,SourceCanvas,CodeCanvas,VoiceRecognition,ScreenshotCapture,FileUpload,SettingsDropdown,StyleOptions,FocusOptions,ColorCustomization component
        class AppContext,ChatContext context
        class ApiClient,Storage,ContentProcessing utility
        class ApiRoutes,TogetherAI backend
    ```

## [1.15.0] - 2025-03-08

### Added
- Code Canvas for displaying code blocks
  - Added automatic detection of code blocks in AI responses
  - Created dedicated Code Canvas view for easy code reading
  - Implemented language-specific highlighting with color coding
  - Added one-click copy button for each code block
  - The "Show Canvas" button now dynamically changes to "Show Code" when code blocks are present
  - Enhanced code display with syntax formatting and proper spacing
  - Preserved existing Source Canvas functionality when citations are present instead of code

## [1.14.16] - 2025-03-08

### Changed
- Renamed "Darker Background" setting to "High Contrast"
  - Updated label in settings dropdown for better clarity
  - Made high contrast background colors even darker for better accessibility
  - Enhanced the contrast ratio between text and background
  - Improved accessibility for users with visual impairments

### Fixed
- "Darker Background" toggle not changing message contrast
  - Modified style application to prioritize high contrast setting over custom colors
  - Ensured toggle properly changes background colors for both user and assistant messages
  - Fixed interaction between custom color settings and high contrast mode
  - Restored expected behavior of the contrast toggle

## [1.14.15] - 2025-03-08

### Added
- Color customization through Advanced settings
  - Implemented new Advanced dropdown in the Appearance settings section
  - Added color pickers for response text, response background, query text, and query background
  - Created live preview of selected colors in the chat interface
  - Added "Reset to Default" button for quick restoration of default colors
  - Saved color preferences in application settings for persistence
- Advanced button in Appearance settings section
  - Added a new "Advanced" button at the bottom of the Appearance section
  - Placed within the Settings dropdown for easy access
  - Styled consistently with application design language
  - Toggles visibility of the color customization controls

### Fixed
- TypeScript error in AppContext initialization
  - Updated AccessibilitySettings initialization to include new color properties
  - Ensured consistent default values between storage utility and context provider
  - Fixed build process by resolving type compatibility issues

## [1.14.14] - 2025-03-08

### Changed
- Enhanced UI layout and visibility
  - Increased main container width from 50% to 75% of browser window for better space utilization
  - Doubled the size of the tagline text for improved visual hierarchy
  - Better readability for AI responses with expanded display area
  - Optimized overall chat interface proportions for modern wide screens

## [1.14.13] - 2025-03-08

### Added
- Enhanced error diagnostics
  - Added "Run Diagnostics" button that appears when API errors occur
  - Improved ping endpoint with detailed API configuration information
  - Added direct API test to help identify specific failure points
  - Included system diagnostics like network status and browser information
  - Implemented comprehensive logging in browser console for troubleshooting

## [1.14.12] - 2025-03-08

### Changed
- Smarter "Introduction" heading insertion
  - No longer automatically adds "Introduction" heading to short or simple responses
  - Only adds Introduction section for longer, more structured content (>250 characters)
  - Checks for existing headings, numbered lists, or multiple paragraphs before adding
  - Prevents duplicate Introduction headings in AI-generated content
  - Improved overall readability for both simple and complex responses

## [1.14.11] - 2025-03-08

### Changed
- Improved Source Canvas display behavior
  - Changed "Show Canvas" toggle to default to hidden for a cleaner initial UI
  - Source Canvas now only displays when both "Show Canvas" is toggled on AND "Cite Sources" is enabled
  - Toggle button for Source Canvas only appears when citations are enabled
  - Enhanced responsive layout to adjust based on combined canvas visibility conditions
  - Better integration between citation settings and UI display

## [1.14.10] - 2025-03-08

### Fixed
- "Cite Sources" toggle functionality
  - Fixed the "Cited Sources" badge to respect the current citeSources setting
  - Standardized default value of citeSources to true across all components
  - Updated API route to maintain consistent defaults
  - Enhanced logging for better debugging of citation control flow
  - Fixed disconnect between UI badge and accessibility settings

## [1.14.9] - 2025-03-08

### Added
- Real API integration when citations are disabled
  - Added conditional logic to make real TogetherAI API calls when citeSources is off
  - Kept mock response generation with sources when citeSources is on
  - Improved logging for both real and mock response paths
  - No "Cited Sources" badge shown for real API responses
  - Enhanced citeSources toggle to control both API behavior and UI display

### Changed
- Enhanced source citation control
  - Better integration between UI and backend for citation settings
  - More consistent behavior when toggling citation mode
  - Improved user experience with clearer source/no-source modes
  - Added proper logging for API request decisions

## [1.14.8] - 2025-03-08

### Changed
- Removed the "Article" text from the response header
  - Kept the newspaper icon for visual indicator
  - Simplified the header area for cleaner appearance
  - Maintained all article formatting and styling
  - Improved visual design with less redundant text

## [1.14.7] - 2025-03-08

### Added
- New "Cite Sources" toggle in settings
  - Added user control for enabling/disabling source citations in AI responses
  - Created toggle switch in the settings dropdown with clear labeling
  - Set to enabled by default for academic-style citations
  - Implemented dynamic system prompt modification to include/exclude citation instructions
  - Extended accessibility settings with citeSources flag
  - Added proper API integration for toggling citation behavior

### Changed
- Enhanced settings dropdown organization
  - Added dedicated "Sources" section in settings panel
  - Improved toggle styling and descriptive text
  - Better separation between appearance settings and content settings

## [1.14.6] - 2025-03-08

### Added
- New dedicated "Style" button in the toolbar next to the "Focus" button
- Moved AI response style options from settings to a dedicated dropdown

### Changed
- Improved UI organization by grouping related controls - Style and Focus buttons are now adjacent
- Simplified settings panel by moving style options to the toolbar for easier access

## [1.14.5] - 2025-03-08

### Added
- Enhanced article formatting for responses
  - Implemented professional article layout for AI responses
  - Added article header with newspaper icon and title
  - Improved typography with serif font for better readability
  - Enhanced headings with color hierarchy and proper spacing
  - Automatically structured content with introduction and conclusion sections
  - Added enhanced styling for lists, tables, blockquotes, and code blocks
  - Improved paragraph formatting with better line height
  - Added visual accents like colored headings and blue border
  - Maintained source citation system with badge indicator

## [1.14.4] - 2025-03-08

### Changed
- Significantly expanded chat interface width
  - Increased content width from 75% to 95% of viewport width
  - Maximized usable screen space for content display
  - Enhanced visibility of longer text content
  - Reduced unnecessary margins on larger screens
  - Further improved space utilization for modern high-resolution displays
  - Maintained proportional layout with source canvas

## [1.14.3] - 2025-03-08

### Changed
- Modified chat interface to use percentage-based width
  - Changed fixed width containers (84rem) to responsive 75% width
  - Enhanced adaptability to different screen sizes
  - Improved space utilization on larger displays
  - Maintained proportional layout with source canvas
  - Better alignment with modern responsive design principles
  - Ensured consistent user experience across various device widths

## [1.14.2] - 2025-03-08

### Changed
- Enhanced source display with visual tile interface
  - Renamed "Sources" panel to "Canvas" for better representation
  - Redesigned source display with modern tile-based interface
  - Added color-coded banners based on source domain
  - Included snippet previews with quotation styling
  - Enhanced visual feedback with hover effects and animations
  - Added direct links to source content when available
  - Improved empty state with helpful placeholder
  - Enhanced relevance indicators with percentage badges

## [1.14.1] - 2025-03-08

### Added
- Academic publication-style formatting with citation references
- Included in Knowledge Focus prompts: "Include sources of information as citations in your response similar to academic papers"

## [1.14.0] - 2025-03-08

### Added
- Academic publication-style formatting with citation references
  - Implemented numbered citation system with superscript references in text
  - Redesigned source canvas to display academic-style citations
  - Created bibliography format with proper citation structure
  - Added author, title, publication, and URL formatting for sources
  - Enhanced source information display with proper academic styling
  - Modified text processing to intelligently place citations within content
  - Improved AI responses to resemble scholarly publications
  - Enhanced visual presentation with superscript citation numbers

## [1.13.7] - 2025-03-08

### Changed
- Enhanced section spacing in response content
  - Added triple line breaks between content sections
  - Increased paragraph bottom margin from 6px to 16px
  - Restored original heading spacing with proper vertical rhythm
  - Expanded list margins from 6px to 16px for better separation
  - Improved blockquote spacing for clearer content organization
  - Optimized spacing between list items for better readability
  - Enhanced text processing to ensure consistent section breaks
  - Balanced content density with proper visual separation

## [1.13.6] - 2025-03-08

### Changed
- Doubled horizontal padding inside message bubbles
  - Increased user message horizontal padding from 8px to 16px
  - Expanded assistant message horizontal padding from 12px to 24px
  - Maintained existing vertical padding (8px for user, 12px for assistant)
  - Improved readability with better text margins
  - Enhanced visual separation between text and bubble edges
  - Created better balance between content density and readability
  - Added more breathing room for message content

## [1.13.5] - 2025-03-08

### Changed
- Halved vertical margins throughout the content container
  - Reduced top/bottom container padding from 8px to 4px
  - Decreased spacing between message pairs from 32px to 16px
  - Reduced gap between user and assistant messages from 16px to 8px
  - Halved all markdown element vertical margins
  - Decreased paragraph spacing from 12px to 6px
  - Reduced heading margins by 50%
  - Minimized list and blockquote spacing
  - Created ultra-compact layout with maximum content density

## [1.13.4] - 2025-03-08

### Changed
- Minimized horizontal margins to bare minimum
  - Further reduced horizontal padding from 4px to 2px
  - Kept vertical padding unchanged at 8px for readability
  - Increased maximum message width from 90% to 95%
  - Decreased message bubble padding for ultra-compact layout
  - Reduced user message padding from 12px to 8px
  - Reduced assistant message padding from 16px to 12px
  - Created almost borderless appearance for maximum content space

## [1.13.3] - 2025-03-08

### Changed
- Further reduced horizontal margins in content container
  - Halved the left and right padding from 8px to 4px
  - Maintained vertical padding at 8px for proper spacing
  - Increased maximum message width from 85% to 90%
  - Optimized horizontal space utilization in chat interface
  - Reduced empty space between content and container edges
  - Enhanced content density while preserving readability
  - Maximized available screen real estate for conversations

## [1.13.2] - 2025-03-08

### Changed
- Reduced margins around content in response container
  - Decreased outer container padding from 16px to 8px
  - Reduced message bubble padding for a more compact appearance
  - Decreased spacing between message pairs for better content density
  - Optimized markdown element spacing while maintaining readability
  - Adjusted vertical spacing between user and assistant messages
  - Increased maximum message width from 80% to 85% for better space utilization
  - Created a more streamlined visual experience with thinner borders

## [1.13.1] - 2025-03-08

### Changed
- Increased response and query fields width by 20%
  - Expanded max-width from 7xl to 84rem for better content display
  - Adjusted layout proportions for source panel integration
  - Improved space utilization for conversation interfaces
  - Enhanced readability of longer messages
  - Optimized container sizes for different screen resolutions
  - Maintained responsive behavior across all device sizes

## [1.13.0] - 2025-03-08

### Added
- Source canvas with information tiles
  - Added right-side panel showing sources used in AI responses
  - Implemented collapsible source display with toggle button
  - Created source tiles with domain information and relevance scores
  - Added badges to indicate when a message has sources available
  - Included source snippets with preview of content
  - Developed responsive layout that adapts to screen sizes
  - Created consistent styling for source information display
  - Added support for clickable source URLs when available

### Changed
- Restructured main chat layout to support source information
  - Expanded maximum container width from 5xl to 7xl to accommodate sources
  - Improved responsive behavior for different screen sizes
  - Added smooth transitions between source panel states
  - Enhanced message display with source count indicators
  - Preserved all existing chat functionality while adding sources
  - Added flexible layout that adapts when source panel is toggled
  - Maintained visual consistency with the application's design language

## [1.12.2] - 2025-03-08

### Added
- New "Nature" knowledge focus option
  - Added dedicated prompt for nature-related queries
  - Implemented with a green indicator for easy identification
  - Covers ecological, environmental, and biodiversity topics
  - Provides guidance on natural processes and conservation awareness
  - Enhances AI responses for questions about flora, fauna, and ecosystems
  - Includes specialized knowledge about environmental conservation

## [1.12.1] - 2025-03-08

### Changed
- Combined "Physics" and "Chemistry" knowledge focus areas into a single "Science" category
  - Simplified knowledge domain selection in the Focus dropdown
  - Created a unified science prompt that covers both physics and chemistry topics
  - Updated knowledge focus types throughout the application
  - Applied a new teal color for the Science knowledge focus indicator
  - Improved knowledge prompt with comprehensive scientific guidance

## [1.12.0] - 2025-03-07

### Changed
- Improved toolbar layout for better user experience
  - Moved "Focus" and "Settings" buttons to the right side of the toolbar
  - Positioned these controls next to the "New Chat" button
  - Created more balanced visual distribution of UI elements
  - Grouped related functionality together for better usability
  - Adjusted dropdown positioning to open from right edge
  - Maintained consistent styling and behavior for all toolbar elements

## [1.11.6] - 2025-03-07

### Changed
- Enhanced spacing in formatted message content
  - Added proper vertical spacing between paragraphs (16px margin)
  - Improved formatting for headings with appropriate margins
  - Enhanced list display with proper indentation and bullet points
  - Increased padding in assistant message bubbles for better readability
  - Added consistent spacing for blockquotes and other markdown elements
  - Made text consistently left-aligned for better readability

## [1.11.5] - 2025-03-07

### Added
- Markdown rendering for message content
  - Integrated react-markdown library for proper formatting
  - Added support for bold text with double asterisks (**text**)
  - Enabled proper rendering of headings, lists, and other markdown elements
  - Maintained improved spacing between sections
  - Left-aligned text within message bubbles for better readability
  - Created a more polished and professional response display

## [1.11.4] - 2025-03-07

### Fixed
- Enhanced message formatting in response field
  - Fixed spacing issues with markdown-style formatting
  - Improved handling of bold text and headings with asterisks
  - Added proper line breaks for numbered lists and bullet points
  - Enhanced rendering of section headings and content separation
  - Implemented React Fragment-based rendering for consistent spacing
  - Prevented excessive line breaks by limiting consecutive newlines

## [1.11.3] - 2025-03-07

### Changed
- Improved message formatting in response field
  - Added double line breaks between sections for better readability
  - Enhanced spacing after headings and before new sections
  - Improved formatting for lists and bullet points
  - Made long responses easier to scan with clear section separation
  - Added intelligent whitespace management for better text layout
  - Maintained compatibility with existing message content

## [1.11.2] - 2025-03-07

### Added
- New "Concise" prompt style option
  - Added as a sixth style option for generating shorter responses
  - Created new system prompt focused on brevity and directness
  - Added rose/pink color indicator for the Concise style in the UI
  - Extended type definitions to include the new prompt style
  - Designed for users who prefer minimal, straight-to-the-point answers
  - Programmed to limit responses to 3 sentences when possible

## [1.11.1] - 2025-03-07

### Added
- New "Verbose" prompt style option
  - Added as a fifth style option alongside Balanced, Creative, Precise, and Helpful
  - Created new thorough system prompt focused on comprehensive responses
  - Added amber color indicator for the Verbose style in the UI
  - Extended type definitions to include the new prompt style
  - Updated all related components to support the new option

### Changed
- Reverted previous changes that renamed "Helpful" to "Verbose"
  - Restored the original "Helpful" style and its green color indicator
  - Kept all existing functionality for the Helpful style
  - Added "Verbose" as a completely separate new option

## [1.11.0] - 2025-03-06

### Documentation
- Complete current architecture documentation
  - **Component Structure:**
    - Single-page application with centralized Chat component
    - Modular MessageInput component with voice input, screenshot capture, and file upload
    - MessageList component for rendering conversation history
    - Clean separation between UI components and business logic
  
  - **State Management:**
    - ChatContext for conversation state and message operations
    - AppContext for application settings and preferences
    - Local storage integration for persistence across sessions
    - Efficient state updates with React hooks
  
  - **API Integration:**
    - Clean API client abstraction with rate limiting and retries
    - Together AI integration with Llama 3.3 model
    - Structured request/response handling with TypeScript typing
    - Proper error handling and recovery mechanisms
  
  - **Enhanced Input Features:**
    - Web Speech API integration for voice input
    - Screenshot capture with preview and attachment control
    - File upload with preview and validation
    - Knowledge domain selection (Medical, Legal, Physics, etc.)
    - Prompt style customization (Balanced, Creative, Precise, Helpful)
  
  - **Progressive Web App:**
    - Full PWA support with installable capability
    - Custom animated neural network icons (192px and 512px)
    - Offline detection and fallback behavior
    - Manifest configuration for home screen installation
  
  - **Accessibility:**
    - Contrast controls and dark theme support
    - Screen reader compatibility with ARIA attributes
    - Responsive design for all device sizes
    - Keyboard navigation support

  - **Architectural Diagram:**
    ```mermaid
    graph TD
        subgraph Frontend ["Frontend (Next.js App)"]
            subgraph Components ["UI Components"]
                Chat["Chat.tsx<br/>Main Chat Component"]
                MessageInput["MessageInput.tsx<br/>Input + Controls"]
                MessageList["MessageList.tsx<br/>Messages Display"]
                ScreenshotModal["ScreenshotModal<br/>Image Preview"]
                SettingsDropdown["Settings UI<br/>User Preferences"]
            end
            
            subgraph Contexts ["Context Providers"]
                AppContext["AppContext.tsx<br/>App Settings & Theme"]
                ChatContext["ChatContext.tsx<br/>Message State & API"]
            end
            
            subgraph Utils ["Utilities"]
                ApiClient["apiClient.ts<br/>API Communication"]
                RateLimiter["rateLimiter.ts<br/>Request Throttling"]
                Storage["storage.ts<br/>Local Storage"]
                Logger["logger.ts<br/>Logging System"]
            end
            
            subgraph InputFeatures ["Input Features"]
                SpeechRecognition["Web Speech API<br/>Voice Input"]
                ScreenCapture["Screen Capture API<br/>Screenshots"]
                FileUpload["File Upload<br/>Image Input"]
                KnowledgeFocus["Knowledge Domain<br/>Selection"]
                PromptStyles["Prompt Style<br/>Customization"]
            end
            
            subgraph PWA ["Progressive Web App"]
                Manifest["manifest.json<br/>App Installation"]
                Icons["SVG Icons<br/>Neural Network Design"]
                OfflineSupport["Offline Detection<br/>Connectivity Checks"]
            end
        end
        
        subgraph Backend ["Backend"]
            APIRoutes["API Routes<br/>NextJS App Router"]
            ChatRoute["chat/route.ts<br/>LLM API Handler"]
            TogetherAI["Together AI<br/>Llama 3.3 Model"]
        end
        
        %% Component Relationships
        Chat --> MessageInput
        Chat --> MessageList
        Chat --> ScreenshotModal
        MessageInput --> SettingsDropdown
        
        %% Context Connections
        Chat --> AppContext
        Chat --> ChatContext
        MessageInput --> AppContext
        MessageList --> ChatContext
        
        %% Utility Connections
        ChatContext --> ApiClient
        ApiClient --> RateLimiter
        ApiClient --> Logger
        AppContext --> Storage
        
        %% Input Features Connections
        MessageInput --> SpeechRecognition
        MessageInput --> ScreenCapture
        MessageInput --> FileUpload
        MessageInput --> KnowledgeFocus
        MessageInput --> PromptStyles
        
        %% PWA Connections
        Frontend --> PWA
        
        %% Backend Connections
        ApiClient --> APIRoutes
        APIRoutes --> ChatRoute
        ChatRoute --> TogetherAI
        
        %% Data Flow
        MessageInput -.-> |"User Input"| ChatContext
        ChatContext -.-> |"API Request"| ApiClient
        ApiClient -.-> |"LLM Request"| TogetherAI
        TogetherAI -.-> |"LLM Response"| ApiClient
        ApiClient -.-> |"API Response"| ChatContext
        ChatContext -.-> |"Messages"| MessageList
        
        classDef component fill:#bbf,stroke:#333,stroke-width:1px,color:#000
        classDef context fill:#f9f,stroke:#333,stroke-width:1px,color:#000
        classDef utility fill:#dfd,stroke:#333,stroke-width:1px,color:#000
        classDef feature fill:#ffd,stroke:#333,stroke-width:1px,color:#000
        classDef pwa fill:#dff,stroke:#333,stroke-width:1px,color:#000
        classDef api fill:#fdd,stroke:#333,stroke-width:1px,color:#000
        
        class Chat,MessageInput,MessageList,ScreenshotModal,SettingsDropdown component
        class AppContext,ChatContext context
        class ApiClient,RateLimiter,Storage,Logger utility
        class SpeechRecognition,ScreenCapture,FileUpload,KnowledgeFocus,PromptStyles feature
        class Manifest,Icons,OfflineSupport pwa
        class APIRoutes,ChatRoute,TogetherAI api
    ```

## [1.10.1] - 2025-03-06

### Changed
- Enhanced PWA icons with animated 3D design
  - Replaced static geometric icons with dynamic neural network design
  - Added SVG animations with pulsing nodes and connections
  - Implemented rotating elements for 3D effect
  - Created visual representation of "Intelligence at your fingertips"
  - Enhanced visual appeal with subtle gradients and lighting effects
  - Maintained teal/aqua brand color scheme
  - Generated optimized PNG versions for PWA installation

## [1.10.0] - 2025-03-06

### Fixed
- PWA icon loading errors
  - Added missing icon files (icon-192.png and icon-512.png) for PWA functionality
  - Created stylized SVG and PNG icons matching the application design
  - Added icon generation script for easier maintenance
  - Fixed 404 errors in browser console related to missing icons
  - Improved PWA installation experience with proper icons

## [1.9.2] - 2025-02-22

### Fixed
- Persistent voice input transcription issues
  - Implemented Web Speech API SpeechRecognition with proper event typing
  - Added detailed debugging information to help diagnose browser-specific issues
  - Fixed transcript processing to ensure text appears in input field
  - Separated recognition initialization from event handling for better clarity
  - Updated result processing to correctly extract final transcripts
  - Improved error handling for browser compatibility issues
  - Enhanced cleanup processes to prevent memory leaks
  - Added proper logging throughout speech recognition lifecycle

## [1.9.1] - 2025-02-22

### Fixed
- Voice input not transcribing text to input field
  - Completely refactored speech recognition implementation
  - Separated initialization and event listener setup into distinct useEffect hooks
  - Improved transcript handling with better logic for final results
  - Added comprehensive debug logging throughout voice recognition process
  - Fixed stale closure issues by properly managing dependencies
  - Enhanced handling of speech recognition results for more reliable text updates
  - Improved whitespace handling when appending new transcripts
  - Added more robust error detection and recovery

## [1.9.0] - 2025-02-22

### Added
- Voice input functionality through computer microphone
  - Implemented speech recognition using the Web Speech API
  - Added voice recording toggle with the Voice button in toolbar
  - Included visual feedback during recording with animated microphone icon
  - Added red background highlight to indicate active recording state
  - Implemented automatic transcription of speech to text input
  - Added browser compatibility detection with helpful error messages
  - Included proper cleanup of speech recognition resources
  - Enhanced accessibility with appropriate ARIA labels

## [1.8.5] - 2025-02-22

### Added
- Mini-preview for attached screenshots in input field
  - Added thumbnail preview to the left side of text input when screenshot is attached
  - Included remove button on the preview for easy detachment
  - Adjusted input field padding to accommodate the preview
  - Improved visual feedback when a screenshot is attached to a message
  - Enhanced user experience by providing clear indication of attachment status
  - Maintained consistent button styling and interaction patterns

## [1.8.4] - 2025-02-22

### Added
- Explicit screenshot attachment control
  - Added "Attach to Query" button to screenshot preview modal
  - Modified screenshot flow to allow preview before attaching
  - Separated screenshot preview from attachment decision
  - Improved user control over when screenshots are included in messages
  - Added visual confirmation with prominent button in modal footer
  - Enhanced workflow for screenshot sharing in conversations

## [1.8.3] - 2025-02-22

### Changed
- Enhanced screenshot preview UI
  - Changed preview to fullscreen modal overlay for better visibility
  - Increased maximum size to utilize more screen space (up to 90% of viewport)
  - Added semi-transparent dark background to focus attention on screenshot
  - Improved close button with hover effects
  - Maintained chat layout integrity without displacing content
  - Enhanced scrolling behavior for very large screenshots
  - Improved responsive design for all screen sizes

## [1.8.2] - 2025-02-22

### Changed
- Redesigned screenshot preview experience
  - Added larger screenshot preview panel to the left side of the chat interface
  - Replaced small thumbnail with dedicated preview pane for better visibility
  - Implemented responsive layout that adapts to screen size
  - Enhanced the Screen button to toggle between capture and clear functions
  - Improved visual hierarchy with proper panel styling and header
  - Added clear screenshot functionality directly from toolbar
  - Optimized layout for better use of screen space

## [1.8.1] - 2025-02-22

### Enhanced
- Improved screenshot functionality
  - Enhanced thumbnail display with better positioning
  - Optimized image preview with proper aspect ratio handling
  - Improved UI responsiveness when screenshots are added
  - Better memory management for screenshot object URLs
  - Added visual feedback for clearer user interaction

## [1.8.0] - 2025-02-22

### Added
- Screen capture functionality
  - Connected the Screen button in toolbar to screenshot capability
  - Added browser's native screen capture API integration
  - Implemented automatic file saving with timestamps
  - Created seamless upload to conversation after capture
  - Added loading state during screen capture process
  - Included error handling with user-friendly messages
  - Displays thumbnail preview of captured screenshot next to input field
  - Added ability to dismiss the thumbnail with a hover-reveal close button
  - Implemented proper thumbnail cleanup when removed or component unmounts

## [1.7.1] - 2025-02-22

### Changed
- Made the "General" knowledge focus area visible in the UI
  - Removed conditional rendering to always show the knowledge focus pill
  - "General" knowledge focus now has its own pill indicator like other domains
  - Improved consistency in the UI for all knowledge focus options
  - Enhanced user awareness of the current knowledge focus setting
  - Maintained gray color scheme for the "General" pill

## [1.7.0] - 2025-02-22

### Added
- Knowledge domain focus feature
  - Added domain-specific knowledge focus options: Medical, Legal, Physics, Chemistry, Technology, Business, and History
  - Implemented focus dropdown menu through the Focus button in toolbar
  - Created specialized system prompts for each knowledge domain
  - Added colored pill indicator for active knowledge focus
  - Maintained "General" as the default knowledge domain
  - Combined knowledge focus with prompt style for more specialized responses

### Changed
- Enhanced Focus button functionality
  - Transformed decorative Focus button into an interactive dropdown menu
  - Added radio button selection for knowledge domains
  - Implemented visual feedback through color-coded pills
  - Created logical combination of prompt style and knowledge focus
  - Improved system prompts with domain-specific knowledge guidance

## [1.6.2] - 2025-02-22

### Added
- Prompt style pill indicator in toolbar
  - Added color-coded pill showing the current prompt style
  - Positioned next to Settings button for easy reference
  - Each style has its own distinct color: indigo for Balanced, purple for Creative, blue for Precise, green for Helpful
  - Enhances visibility of the active prompt style without needing to open settings
  - Provides visual feedback about the current AI response mode

## [1.6.1] - 2025-02-22

### Fixed
- Ensured consistent interface definitions across the codebase
  - Fixed AccessibilitySettings interface in storage utility to include promptStyle
  - Synchronized type definitions between different modules
  - Maintained all existing prompt style selection functionality
  - Ensured system prompts remain hidden from UI while allowing style selection
  - Fixed potential type errors when accessing promptStyle property

## [1.6.0] - 2025-02-22

### Added
- AI response style customization
  - Added four distinct prompt styles: Balanced, Creative, Precise, and Helpful
  - Implemented radio button selection in the settings dropdown
  - Created unique system prompts for each style to guide AI responses
  - Added storage for user's preferred prompt style
  - Integrated prompt style selection with API requests
  - Enhanced user control over AI conversation tone and style

### Changed
- Extended settings dropdown with new AI style section
  - Organized settings into separate sections with clear headings
  - Added descriptive text explaining the purpose of each style option
  - Maintained consistent UI design with existing settings controls

## [1.5.25] - 2025-02-22

### Changed
- Renamed settings toggle option for better clarity
  - Changed label from "High Contrast Bubbles" to "Darker Background"
  - Updated description text to reference background color
  - Changed accessibility label to match new terminology
  - Maintained the same toggle functionality
  - Improved user understanding of the setting's purpose

## [1.5.24] - 2025-02-22

### Added
- Settings button in toolbar with dropdown menu 
  - Added gear icon and "Settings" label in the toolbar
  - Created dropdown panel with accessibility controls
  - Positioned menu with proper styling and z-index
  - Implemented toggle switch with visual feedback
  - Added descriptive text for better usability

### Changed
- Made message bubble contrast adjustable through UI
  - Restored functionality of highContrast accessibility setting
  - Added toggle switch to control contrast of message bubbles
  - Lower contrast: blue-600 for user and gray-600 for assistant messages
  - High contrast: blue-950 for user and gray-800 for assistant messages
  - Enhanced user control over visual appearance

## [1.5.23] - 2025-02-22

### Changed
- Updated message bubbles to use high contrast dark theme by default
  - Changed user messages to deep navy background (bg-blue-950) with white text
  - Changed assistant messages to dark charcoal background (bg-gray-800) with white text
  - Removed dependency on accessibility.highContrast setting
  - Improved readability with darker color scheme for better contrast
  - Enhanced visual distinction between message bubbles and container background

## [1.5.22] - 2025-02-22

### Changed
- Made response field border more subtle
  - Changed border color from bright blue to semi-transparent dark gray
  - Updated border-color CSS property to use rgba(55, 65, 81, 0.5) for a softer appearance
  - Modified message dividers to match the new subtle border style
  - Improved visual harmony between the response container and page background
  - Enhanced overall focus on content by reducing visual distractions

## [1.5.21] - 2025-02-22

### Changed
- Re-implemented dark mode styling for response field
  - Changed background to dark gray (bg-gray-900) for better contrast
  - Updated text color to white for improved readability on dark background
  - Added blue highlight border (border-blue-500) for visual emphasis
  - Changed message dividers to blue (border-blue-500/50) for better visibility
  - Enhanced visual distinction between messages and background

## [1.5.20] - 2025-02-22

### Changed
- Reverted response field styling back to original appearance
  - Restored light background (bg-white/5) from dark gray
  - Changed text color back to gray-800 for light background compatibility
  - Reverted border to subtle white/10 border
  - Restored original message divider styling
  - Returned to the original visual design while maintaining increased size

## [1.5.19] - 2025-02-22

### Changed
- Enhanced response field styling with dark mode
  - Changed background to dark gray (bg-gray-900) for stronger contrast
  - Updated text color to pure white for maximum readability
  - Added blue highlight border (border-blue-500) for visual emphasis
  - Changed message dividers to blue (border-blue-500/50) for better visibility
  - Improved visual distinction between the response area and page background
  - Enhanced overall readability with high-contrast color scheme

## [1.5.18] - 2025-02-22

### Changed
- Increased response field height by 25%
  - Changed maximum height from 500px to 625px
  - Maintains minimum height of 300px
  - Provides more vertical space for viewing messages
  - Reduces need for scrolling with longer conversations
  - Enhances overall reading experience

## [1.5.17] - 2025-02-22

### Changed
- Increased width of message fields by 50%
  - Changed container max-width from max-w-2xl (672px) to max-w-5xl (1024px)
  - Both response and query fields maintain equal width
  - Provides more space for content display
  - Improves readability for longer messages
  - Enhances overall user experience with wider chat interface

## [1.5.16] - 2025-02-22

### Changed
- Modernized Submit button design
  - Replaced text label with paper airplane icon
  - Changed button shape from rounded rectangle to circular
  - Improved button positioning and spacing
  - Maintained hover effects and disabled states
  - Enhanced visual appearance while preserving functionality

## [1.5.15] - 2025-02-22

### Changed
- Doubled the input text padding area
  - Increased right padding from pr-24 (6rem) to pr-48 (12rem)
  - Created more space between typed text and Submit button
  - Further improved user experience with longer messages
  - Enhanced text visibility in the input field

## [1.5.14] - 2025-02-22

### Fixed
- Prevented text overlap with Submit button
  - Added proper right padding (pr-24) to input textarea
  - Ensured typed text remains visible and doesn't flow under the button
  - Maintained all input field functionality
  - Improved user experience when typing longer messages

## [1.5.13] - 2025-02-22

### Added
- New Chat button for easy conversation reset
  - Integrated directly into the toolbar alongside other tools
  - Positioned on the right side of the toolbar for better visual balance
  - Styled consistently with other toolbar buttons
  - Text vertically aligned with the Submit button text
  - Added proper hover effects for better user interaction

## [1.5.12] - 2025-02-22

### Changed
- Improved layout consistency across components
  - Added consistent fixed width (max-w-2xl) for both input and response fields
  - Centered both components in the page for better visual balance
  - Removed unnecessary horizontal padding for cleaner alignment
  - Added proper spacing between components
  - Enhanced overall UI symmetry and cohesion

## [1.5.11] - 2025-02-22

### Changed
- Updated input placeholder text
  - Changed from "Ask anything..." to "Just ask..."
  - More concise and direct user prompt
  - Maintained all existing input field functionality
  - Simplified user interface text

## [1.5.10] - 2025-02-22

### Changed
- Removed "Responses" label above message container
  - Simplified user interface by removing redundant text label
  - Cleaner visual appearance with less clutter
  - Maintained all existing functionality and accessibility features
  - Improved UI minimalism while keeping intuitive design

## [1.5.9] - 2025-02-22

### Changed
- Reversed chat interface layout order
  - Moved query input field below the responses section
  - Enhanced chat flow to match traditional messaging interfaces
  - Improved user experience for reviewing conversation history
  - Maintained all existing functionality and styling

## [1.5.8] - 2025-02-22

### Changed
- Improved message container usability
  - Added scrollable message container with max height (500px)
  - Prevented page from extending indefinitely with many messages
  - Maintained minimum height of 300px for consistency
  - Enhanced user experience with scrollable content area
  - Improved overall page layout stability

## [1.5.7] - 2025-02-22

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

## [1.5.6] - 2025-02-22

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

## [1.5.5] - 2025-02-22

### Fixed
- Resolved TypeScript build error in API client
  - Fixed missing return type for sendChatMessage method in apiClient.ts
  - Corrected imports by removing duplicate type references
  - Ensured proper type checking for API responses

## [1.5.4] - 2025-02-22

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

## [1.5.3] - 2025-02-22

### Added
- Comprehensive architectural documentation

### Documentation
- Added detailed architecture diagram showing:
  - Frontend component hierarchy and relationships
  - State management and context providers
  - Utility layer organization
  - Backend API integration
  - External service connections
  - Data flow between components
  - System dependencies and interactions

## [1.5.2] - 2025-02-22

### Changed
- Enhanced message spacing and visual separation
  - Added 3rem margin and padding between message pairs
  - Increased spacing between user and assistant messages to 2rem
  - Added thicker bottom borders between conversation pairs
  - Improved visual hierarchy with consistent spacing
  - Removed last border and spacing from final message pair

## [1.5.1] - 2025-02-22

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

## [1.5.0] - 2025-02-22

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

## [1.4.1] - 2025-02-22

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

## [1.4.0] - 2025-02-22

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

## [1.3.24] - 2025-02-21

### Changed
- Increased input field width
  - Expanded container width from 30% to 50%
  - Improved overall layout proportions
  - Enhanced readability with wider text area
  - Better use of screen space
  - Maintained centered alignment 

## [1.3.23] - 2025-02-21

### Changed
- Increased input field height
  - Changed textarea from 1 row to 3 rows
  - Adjusted padding for better text visibility
  - Improved overall input field appearance
  - Removed overflow restriction
  - Enhanced text input experience 

## [1.3.22] - 2025-02-21

### Changed
- Reordered chat interface layout
  - Moved input field above response field
  - Adjusted spacing between components
  - Improved visual flow from input to responses
  - Enhanced overall user experience
  - Maintained consistent styling 

## [1.3.21] - 2025-02-21

### Changed
- Enhanced response field visibility and appearance
  - Made response field always visible with consistent styling
  - Added background and border to response area
  - Increased minimum height to 300px
  - Improved empty state appearance
  - Better spacing and padding for messages

## [1.3.20] - 2025-02-21

### Changed
- Improved text alignment consistency
  - Centered all messages in the chat
  - Added proper padding for message container
  - Centered form elements and toolbar
  - Improved overall visual balance
  - Enhanced spacing and alignment

## [1.3.19] - 2025-02-21

### Changed
- Updated package name
  - Changed package name to "web-chat-app"
  - Updated package.json configuration
  - Maintained version number and other settings
  - Improved project identification
  - Better package naming convention

## [1.3.18] - 2025-02-21

### Changed
- Increased input field width
  - Expanded container width from 30% to 50%
  - Improved overall layout proportions
  - Enhanced readability with wider text area
  - Better use of screen space
  - Maintained centered alignment 

## [1.3.17] - 2025-02-21

### Changed
- Increased input field height
  - Changed textarea from 1 row to 3 rows
  - Adjusted padding for better text visibility
  - Improved overall input field appearance
  - Removed overflow restriction
  - Enhanced text input experience 

## [1.3.16] - 2025-02-21

### Changed
- Reordered chat interface layout
  - Moved input field above response field
  - Adjusted spacing between components
  - Improved visual flow from input to responses
  - Enhanced overall user experience
  - Maintained consistent styling 

## [1.3.15] - 2025-02-21

### Changed
- Enhanced response field visibility and appearance
  - Made response field always visible with consistent styling
  - Added background and border to response area
  - Increased minimum height to 300px
  - Improved empty state appearance
  - Better spacing and padding for messages

## [1.3.14] - 2025-02-21

### Changed
- Improved text alignment consistency
  - Centered all messages in the chat
  - Added proper padding for message container
  - Centered form elements and toolbar
  - Improved overall visual balance
  - Enhanced spacing and alignment

## [1.3.13] - 2025-02-21

### Changed
- Reverted tagline back to "Intelligence at your fingertips"
- Maintained centered layout and styling

## [1.3.12] - 2025-02-21

### Changed
- Updated layout to match Perplexity design
  - Centered all content including logo and tagline
  - Changed tagline to "Where knowledge begins"
  - Centered input field text and placeholder
  - Centered toolbar items with proper spacing
  - Improved overall visual alignment
  - Maintained 30% width with auto margins

## [1.3.11] - 2025-02-21

### Changed
- Improved overall layout spacing and proportions
- Reduced logo size to 32x32 for better balance
- Adjusted vertical spacing between sections
- Left-aligned logo and tagline for cleaner look
- Simplified container structure for better organization
- Removed unnecessary padding and margins

## [1.3.10] - 2025-02-21

### Changed
- Updated message layout
  - Positioned assistant responses on the right side
  - Kept user messages on the left side
  - Improved message width and spacing
  - Right-aligned loading indicator and error messages
  - Enhanced visual distinction between user and assistant messages

## [1.3.9] - 2025-02-21

### Changed
- Updated content alignment
  - Center-aligned all messages and text
  - Centered input field text
  - Improved visual balance with centered layout
  - Enhanced readability with consistent alignment
  - Maintained 30% width and left offset

## [1.3.8] - 2025-02-21

### Changed
- Updated landing page layout
  - Positioned content at 30% from left edge
  - Improved message alignment and width
  - Enhanced visual balance
  - Adjusted text alignment for better readability
  - Optimized spacing for new layout

## [1.3.7] - 2025-02-21

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

## [1.3.6] - 2025-02-21

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

## [1.3.5] - 2025-02-21

### Fixed
- Enhanced error handling and validation
  - Added response structure validation in API client
  - Improved error messages with more details
  - Added proper error logging
  - Preserved user messages on API errors
  - Added type guards for API responses
  - Improved retry mechanism error handling

## [1.3.4] - 2025-02-21

### Fixed
- Improved input field interactivity
  - Changed input to textarea for better text handling
  - Added proper styling for text input
  - Fixed focus and interaction issues
  - Maintained single-line appearance with overflow control

## [1.3.3] - 2025-02-21

### Changed
- Improved landing page experience
  - Input field always visible and ready for typing
  - Added autofocus to input field
  - Improved messages area layout with proper spacing
  - Added min-height and max-height constraints
  - Enhanced overall visual hierarchy

## [1.3.2] - 2025-02-21

### Enhanced
- Improved text input functionality
  - Added Enter key support for form submission
  - Converted microphone button to submit button
  - Added proper button states (disabled when input is empty)
  - Improved form submission handling

## [1.3.1] - 2025-02-21

### Changed
- Updated application tagline to "Intelligence at your fingertips"

## [1.3.0] - 2025-02-21

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

## [1.2.1] - 2025-02-21

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

## [1.2.0] - 2025-02-21

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

## [1.1.0] - 2025-02-21

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

## [1.0.0] - 2025-02-21

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