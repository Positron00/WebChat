export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: string;
}

export interface ChatRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatRequestMessage[];
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 