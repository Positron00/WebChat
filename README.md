# AI Chatbot with Llama 3.3

A modern, full-stack chatbot application built with Next.js and Together AI's Llama 3.3 70B Instruct Turbo model. The chatbot supports both text and image inputs, providing a seamless conversational experience.

## Features

- 💬 Real-time chat interface
- 🖼️ Image upload and analysis
- 🎯 Type-safe implementation
- 🛡️ Comprehensive error handling
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## User Guide

### Getting Started

1. Visit the application at [your-deployed-url.com](https://your-deployed-url.com)
   - Or run locally following the installation instructions below

2. The interface consists of:
   - Chat history area (top)
   - Message input field (bottom)
   - Image upload button (bottom left)

### Basic Usage

1. **Text Chat**:
   - Type your message in the input field
   - Press Enter or click "Send"
   - Wait for the AI's response
   - Messages are automatically saved and persist between sessions

2. **Image Analysis**:
   - Click "Upload Image" button
   - Select an image (JPEG, PNG, GIF, or WebP, max 5MB)
   - Add optional text description
   - Send to get AI's analysis
   - Preview thumbnail appears with option to remove

3. **Accessibility Features**:
   - Toggle dark/light mode
   - Adjust font size (normal/large/larger)
   - Enable high contrast mode
   - Enable reduced motion
   - Full keyboard navigation support
   - Screen reader optimized

4. **Offline Support**:
   - App works offline with limited functionality
   - Previous conversations are available
   - Banner appears when offline
   - Auto-reconnects when back online

### Tips & Tricks

- **Long Conversations**: The app keeps the last 50 messages for context
- **Image Upload**: For best results, use clear images under 5MB
- **Mobile Use**: Fully responsive design works on all devices
- **Keyboard Navigation**: 
  - Tab: Navigate between elements
  - Enter: Send message
  - Space: Select buttons
  - Esc: Clear image selection

### Troubleshooting

1. **Message Not Sending**:
   - Check internet connection
   - Ensure message isn't empty
   - Check for error messages
   - Try refreshing the page

2. **Image Upload Issues**:
   - Verify file format (JPEG, PNG, GIF, WebP)
   - Ensure file is under 5MB
   - Try a different image
   - Clear browser cache

3. **Display Issues**:
   - Try toggling dark/light mode
   - Adjust font size settings
   - Clear browser cache
   - Update your browser

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Together AI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
TOGETHER_API_KEY=your_together_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Setting Up Environment Variables

1. **Local Development**:
   Create a `.env.local` file in the root directory:
   ```bash
   # Create .env.local file
   touch .env.local
   ```

2. **Add Required Variables**:
   ```env
   # Together AI API Configuration
   # Get your API key from: https://api.together.xyz/settings/api-keys
   TOGETHER_API_KEY=your_together_api_key_here
   ```

3. **Get Your API Key**:
   - Visit [Together AI Dashboard](https://api.together.xyz/settings/api-keys)
   - Sign up or log in
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key

4. **Security Notes**:
   - Never commit `.env.local` to version control
   - Keep your API key secret
   - Rotate keys periodically
   - Use different keys for development and production

### Production Deployment

For production deployment, set environment variables in your hosting platform:

- **Vercel**:
  - Go to Project Settings → Environment Variables
  - Add `TOGETHER_API_KEY` with your production API key

- **Other Platforms**:
  - Follow platform-specific instructions for setting environment variables
  - Ensure variables are encrypted at rest

### Accessing Environment Variables

The API key is automatically loaded and used in the application. You can verify it's working by:

1. Starting the development server
2. Sending a test message in the chat
3. Checking the network tab for successful API calls

If you get authentication errors, verify that:
- `.env.local` file exists in project root
- API key is correctly copied
- No extra spaces or quotes in the key
- Server was restarted after adding the key

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Chat.tsx          # Chat interface
│   └── ErrorBoundary.tsx # Error handling
├── config/               # Configuration
│   └── env.ts           # Environment config
└── types/               # TypeScript types
    ├── api.ts          # API types
    └── chat.ts         # Chat types
```

## API Integration

The application uses Together AI's API for:
- Text chat completion
- Image analysis
- Multi-modal conversations

## Error Handling

- Custom ApiError class for API errors
- Error Boundary for React component errors
- Form validation
- File upload validation
- Environment variable validation

## Security

- File type validation
- File size limits (5MB max)
- Environment variable protection
- Input sanitization
- API error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Together AI](https://www.together.ai/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
