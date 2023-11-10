import { OpenAIStream, StreamingTextResponse } from 'ai';
import {getPrompt} from "../../../lib/prompts";
import OpenAI from 'openai';
import {AIDAOPromptAbi} from "../../../AIDAOPrompt";
import {config} from "../../../config";
const { ethers, JsonRpcProvider} = require("ethers");


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
const CONTRACT_ADDRESS = '0x23d3B7aFfD6D7dC228007F1C6A15fE332E21baBc';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const proposal = messages[messages.length - 1].content

  console.log('proposal first entered', proposal)
  const provider = new JsonRpcProvider(config.rpcProvider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, AIDAOPromptAbi, provider);

  const promptValue = await contract.prompt();
  console.log('Prompt:', promptValue);

  // @ts-ignore
  const gptStreamRes = await getGptStreamRes(
    promptValue,
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

