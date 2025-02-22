import { ChatCompletionRequest, ChatCompletionResponse } from '@/types/api';
import { ChatMessage, ChatRequestMessage } from '@/types/chat';
import { CHAT_SETTINGS } from '@/config/chat';

interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private static instance: ApiClient;
  private retryOptions: RetryOptions;
  private readonly baseUrl = '/api';

  private constructor(options: Partial<RetryOptions> = {}) {
    this.retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  }

  static getInstance(options?: Partial<RetryOptions>): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(options);
    }
    return ApiClient.instance;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRetryDelay(attempt: number): number {
    const delay = this.retryOptions.initialDelay * 
      Math.pow(this.retryOptions.backoffFactor, attempt);
    return Math.min(delay, this.retryOptions.maxDelay);
  }

  private isRetryableError(error: any): boolean {
    if (error instanceof ApiError) {
      // Retry on network errors and specific HTTP status codes
      return error.status >= 500 || error.status === 429;
    }
    return true; // Retry on network/unknown errors
  }

  private validateResponse(data: any): data is ChatCompletionResponse {
    return (
      data &&
      Array.isArray(data.choices) &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      typeof data.choices[0].message.content === 'string' &&
      typeof data.choices[0].message.role === 'string'
    );
  }

  async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    customRetryOptions?: Partial<RetryOptions>
  ): Promise<T> {
    const retryOpts = { ...this.retryOptions, ...customRetryOptions };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retryOpts.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = this.getRetryDelay(attempt - 1);
          await this.delay(delay);
          console.log(`Retry attempt ${attempt} after ${delay}ms`);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
          throw new ApiError(
            data.error?.message || `API request failed with status ${response.status}`,
            response.status,
            data
          );
        }

        // Validate response structure
        if (!this.validateResponse(data)) {
          throw new ApiError(
            'Invalid response format from API',
            500,
            data
          );
        }

        return data as T;
      } catch (error) {
        console.error(`API error (attempt ${attempt + 1}/${retryOpts.maxRetries + 1}):`, error);
        lastError = error as Error;
        
        if (!this.isRetryableError(error) || attempt === retryOpts.maxRetries) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  async sendChatRequest(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    return this.fetchWithRetry<ChatCompletionResponse>(
      '/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );
  }

  async sendChatMessage(messages: ChatMessage[], image?: string | null) {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        image,
        model: 'meta-llama/Llama-3.3-70b-instruct-turbo-free',
        max_tokens: CHAT_SETTINGS.maxTokens,
        temperature: CHAT_SETTINGS.temperature,
        top_p: CHAT_SETTINGS.topP,
        frequency_penalty: CHAT_SETTINGS.frequencyPenalty,
        presence_penalty: CHAT_SETTINGS.presencePenalty
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = ApiClient.getInstance(); 