import { ChatCompletionRequest, ChatCompletionResponse } from '@/types/api';

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
            data.error || 'API request failed',
            response.status,
            data
          );
        }

        return data as T;
      } catch (error) {
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
}

export const apiClient = ApiClient.getInstance(); 