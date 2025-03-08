import { NextResponse } from 'next/server';
import { config } from '@/config/env';

// Simple ping endpoint for connectivity checks
export async function GET() {
  const diagnostics = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    api: {
      togetherApiConfigured: !!config.together.apiKey,
      apiKeyLength: config.together.apiKey ? config.together.apiKey.length : 0,
      model: config.together.model
    }
  };

  return NextResponse.json(diagnostics);
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 