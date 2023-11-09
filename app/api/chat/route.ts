import { OpenAIStream, StreamingTextResponse } from 'ai';
import {getPrompt} from "../../../lib/prompts";
import OpenAI from 'openai';
import { NextResponse } from 'next/server'

interface Message {
    role: 'system' | 'user';
    content: string;
}

interface ApiPayload {
    model: string;
    messages: Message[];
    temperature: number;
    stream?: boolean;
}

const openai = new OpenAI();
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const hand = messages[messages.length - 1].content

  console.log('hand first entered', hand)

  getGptTextRes(getPrompt.prompt, hand)
    //when the records are clean and ready to be saved


  // @ts-ignore
  const preflopeFinalPrompt = getPreflopeFinalPrompt(data, collectVarRes);

  const gptStreamRes = await getGptStreamRes(
    preflopeFinalPrompt,
    phaseTwoPreflopPrompt.version,
    hand
  )
  return new StreamingTextResponse(gptStreamRes);
}

function gptReqBody(prompt: string, hand: string, stream=false): ApiPayload {
  return {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: hand
      },
    ],
    temperature: 1,
    stream: stream,
  };
}

// @ts-ignore
async function getGptTextRes(prompt: string, hand: string): string {
  // @ts-ignore
  const response  = await openai.chat.completions.create(gptReqBody(prompt, hand));

  // @ts-ignore
  return response!.choices[0].message.content;

}

async function getGptStreamRes(prompt: string, promptVersion: string, hand: string) {
  let chatCompletionRequest = gptReqBody(prompt, hand, true);
  const response = await openai.chat.completions.create(chatCompletionRequest);

  // @ts-ignore
  return OpenAIStream(response);
}



