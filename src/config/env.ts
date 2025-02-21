export const config = {
  together: {
    apiKey: process.env.TOGETHER_API_KEY,
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.3-70b-instruct-turbo-free',
  },
} as const;

// Validate environment variables
export function validateConfig() {
  if (!config.together.apiKey) {
    throw new Error('TOGETHER_API_KEY environment variable is not set');
  }
}

// Call validation on server startup
validateConfig(); 