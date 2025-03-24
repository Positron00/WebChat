const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable ${key} is not set.\n` +
      `Make sure to create a .env.local file with ${key}=your_key_here\n` +
      `If you don't have an API key, get one from https://api.together.xyz/settings/api-keys`
    );
  }
  return value;
};

export const config = {
  app: {
    version: '1.15.8',
    lastUpdated: '2025-03-23',
  },
  together: {
    apiKey: getEnvVar('TOGETHER_API_KEY'),
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.3-70b-instruct-turbo-free',
  },
} as const;

// Validate environment variables
export function validateConfig() {
  try {
    // Validate API key format (basic check)
    const apiKey = config.together.apiKey;
    if (apiKey.length < 32) {
      throw new Error('TOGETHER_API_KEY appears to be invalid (too short)');
    }

    // Validate API endpoint
    const endpoint = new URL(config.together.endpoint);
    if (!endpoint.hostname.includes('together.xyz')) {
      throw new Error('Invalid API endpoint');
    }

    // Additional checks can be added here
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
    throw error;
  }
}

// Call validation on server startup
validateConfig(); 