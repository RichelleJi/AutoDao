import { OpenAIStream, StreamingTextResponse } from 'ai';
import {getPrompt} from "../../../lib/prompts";
import OpenAI from 'openai';

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
  const proposal = messages[messages.length - 1].content

  console.log('proposal first entered', proposal)

    //when the records are clean and ready to be saved

  // @ts-ignore
  const gptStreamRes = await getGptStreamRes(
    getPrompt.prompt,
    getPrompt.version,
    proposal
  )
  return new StreamingTextResponse(gptStreamRes);
}

function gptReqBody(prompt: string, proposal: string, stream=false): ApiPayload {
  return {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: proposal
      },
    ],
    temperature: 1,
    stream: stream,
  };
}


async function getGptStreamRes(prompt: string, promptVersion: string, hand: string) {
  let chatCompletionRequest = gptReqBody(prompt, hand, true);
  const response = await openai.chat.completions.create(chatCompletionRequest);

  // @ts-ignore
  return OpenAIStream(response);
}



