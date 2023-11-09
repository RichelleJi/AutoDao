import db from '../../db';
import {NextResponse} from "next/server";
import {PostgrestError} from "@supabase/supabase-js";

export async function POST(req: Request) {
  const {reqData} = await req.json();
  const {id, feedback, rating} = reqData;

  db.updateGptInteraction(id, feedback, rating)
    .then(({error}) => {
      if (error) {
        log_error(id, error);
      } else {
        console.log(`Gpt-output-${id.toString()} user feedback updated successfully!`);
      }
    })
    .catch((err) => {
      log_error(id, err);
    });
  return NextResponse.json("success");
}

function log_error(id: number, error: PostgrestError) {
  console.error(`An error occurred with gpt-output-${id} user feedback update: ${error}`);
}