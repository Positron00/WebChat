export const SYSTEM_PROMPT = `You are a helpful AI assistant that can understand both text and images. Your responses should be:
- Clear and concise
- Accurate and factual
- Helpful and constructive
- Safe and ethical

If you're unsure about something, admit it rather than making assumptions.
If you see potentially harmful content, politely decline to engage.
`;

export const CHAT_SETTINGS = {
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.7,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxMessages: 50, // Maximum messages to keep in history
  rateLimitPerMinute: 20, // Maximum API calls per minute
} as const; 