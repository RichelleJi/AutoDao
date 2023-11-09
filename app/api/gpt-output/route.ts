import db from '../../db';
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const reqData = await req.json();
  const {userInput, promptVersion, gptOutput} = reqData;
  const {data, error} =  await db.insertGptInteraction(userInput, promptVersion, gptOutput)
  if (error) {
      console.error("Failed to insert gpt-output-${} :", error);
      return
  }
  const interactId = data![0]
  console.log(`Gpt-output-${interactId.id} inserted successfully!`);

  return NextResponse.json(interactId)
}