import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, mode } = body;

    const apiKey = process.env.AZUREOPENAI_API_KEY;
    const endpoint = process.env.AZUREOPENAI_API_BASE;
    const apiVersion = process.env.AZUREOPENAI_API_VERSION;
    const deployment = process.env.AZUREOPENAI_API_DEPLOYMENT;

    if (!apiKey || !endpoint || !apiVersion || !deployment) {
      return NextResponse.json(
        { error: 'Missing Azure OpenAI configuration' },
        { status: 500 }
      );
    }

    const client = new AzureOpenAI({
      apiKey,
      endpoint,
      apiVersion,
      deployment,
    });

    let systemMessageContent = '';
    if (mode === 'driver') {
      systemMessageContent =
        "You are a polite taxi driver in India. You are currently driving to pick up the user. Keep responses short (max 1 sentence), focused on traffic/location, and use casual, human language. Do not act like an AI.";
    } else {
      // Default to support
      systemMessageContent =
        "You are the RideShare Support Bot. Help users with account issues, payments, and booking questions. Be professional, polite, and concise.";
    }

    const response = await client.chat.completions.create({
      model: deployment,
      messages: [
        { role: 'system', content: systemMessageContent },
        ...messages,
      ],
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
