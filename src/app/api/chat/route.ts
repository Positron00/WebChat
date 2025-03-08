import { NextResponse } from 'next/server';
import { config } from '@/config/env';
import { SYSTEM_PROMPT, SYSTEM_PROMPTS, KNOWLEDGE_PROMPTS, CHAT_SETTINGS } from '@/config/chat';
import { ChatCompletionRequest, ChatRequestMessage, ChatCompletionResponse } from '@/types/api';
import { rateLimiter } from '@/utils/rateLimiter';

// Custom error class for API errors
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Validate request payload
function validateRequest(messages: any[]): messages is ChatRequestMessage[] {
  return Array.isArray(messages) && 
    messages.every(msg => 
      typeof msg === 'object' && 
      ('role' in msg) && 
      ('content' in msg) &&
      ['user', 'assistant', 'system'].includes(msg.role)
    );
}

export async function POST(req: Request) {
  try {
    // Check rate limit
    if (rateLimiter.isRateLimited()) {
      const timeUntilNext = rateLimiter.getTimeUntilNextAllowed();
      throw new ApiError(429, `Rate limit exceeded. Please try again in ${Math.ceil(timeUntilNext / 1000)} seconds`);
    }

    // Parse and validate request
    const body = await req.json();
    const { 
      messages, 
      image = null, 
      promptStyle = 'balanced',
      knowledgeFocus = 'general',
      citeSources = false
    } = body;

    if (!validateRequest(messages)) {
      throw new ApiError(400, 'Invalid message format');
    }

    // Get the appropriate system prompt based on the promptStyle
    const basePrompt = SYSTEM_PROMPTS[promptStyle as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPT;
    
    // Get the knowledge focus prompt
    let knowledgePrompt = KNOWLEDGE_PROMPTS[knowledgeFocus as keyof typeof KNOWLEDGE_PROMPTS] || KNOWLEDGE_PROMPTS.general;
    
    // If citeSources is set to false, remove citation instructions from the knowledge prompt
    if (!citeSources) {
      knowledgePrompt = knowledgePrompt.replace(/- Include sources of information as citations in your response similar to academic papers\n?/g, '');
    }
    
    // Combine the prompts
    const systemPrompt = `${basePrompt}\n\n${knowledgePrompt}`;

    // Ensure messages don't exceed the maximum
    const recentMessages = messages.slice(-CHAT_SETTINGS.maxMessages);

    // Format messages for Together AI's chat completion API
    const formattedMessages: ChatRequestMessage[] = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // If there's an image, add it to the last message
    if (image) {
      formattedMessages[formattedMessages.length - 1].content = [
        { type: 'text', text: formattedMessages[formattedMessages.length - 1].content as string },
        { type: 'image_url', image_url: image }
      ];
    }

    // Prepare API request
    const chatRequest: ChatCompletionRequest = {
      model: config.together.model,
      messages: formattedMessages,
      max_tokens: CHAT_SETTINGS.maxTokens,
      temperature: CHAT_SETTINGS.temperature,
      top_p: CHAT_SETTINGS.topP,
      frequency_penalty: CHAT_SETTINGS.frequencyPenalty,
      presence_penalty: CHAT_SETTINGS.presencePenalty
    };

    // Make API call
    const response = await fetch(config.together.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.together.apiKey}`
      },
      body: JSON.stringify(chatRequest)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error?.message || `API error: ${response.statusText}`
      );
    }

    const data = (await response.json()) as ChatCompletionResponse;
    
    if (!data.choices?.[0]?.message?.content) {
      throw new ApiError(500, 'Invalid response format from API');
    }

    return NextResponse.json({
      choices: [{
        message: {
          content: data.choices[0].message.content,
          role: 'assistant'
        },
        finish_reason: data.choices[0].finish_reason || 'stop'
      }],
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 