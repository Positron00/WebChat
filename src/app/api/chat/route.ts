import { NextResponse } from 'next/server';

const TOGETHER_API_ENDPOINT = 'https://api.together.xyz/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { messages, image } = await req.json();
    
    // Format messages for Together AI's chat completion API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // If there's an image, add it to the last message using Together AI's format
    if (image) {
      formattedMessages[formattedMessages.length - 1].content = [
        { type: 'text', text: formattedMessages[formattedMessages.length - 1].content },
        { type: 'image_url', image_url: image }
      ];
    }

    const response = await fetch(TOGETHER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70b-instruct-turbo-free',
        messages: formattedMessages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      throw new Error(`Together AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      response: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 