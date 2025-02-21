# AI Chatbot with Llama 3.3

A modern, full-stack chatbot application built with Next.js and Together AI's Llama 3.3 70B Instruct Turbo model. The chatbot supports both text and image inputs, providing a seamless conversational experience.

## Features

- 💬 Real-time chat interface
- 🖼️ Image upload and analysis
- 🎯 Type-safe implementation
- 🛡️ Comprehensive error handling
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Together AI API key

## Getting Started

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

- `TOGETHER_API_KEY`: Your Together AI API key (required)

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
