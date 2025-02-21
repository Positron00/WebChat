import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { messages, image } = await req.json();
    
    const input = {
      prompt: messages[messages.length - 1].content,
      image: image || null,
      system_prompt: "You are a helpful AI assistant that can understand both text and images. Respond concisely and accurately.",
      max_tokens: 500,
      temperature: 0.7,
    };

    const output = await replicate.run(
      "meta/llama-2-70b-chat-v2:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
      { input }
    );

    return NextResponse.json({ response: output });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 