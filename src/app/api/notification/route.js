import { NextResponse } from "next/server";
import { sendNewMessageEmail } from "@/app/lib/api/email";
import { userRepo } from "@/app/lib/db/userRepo";

export async function POST(request) {
  const { senderE, time, receiver } = await request.json();
  try {
    const sender =  await userRepo.getUserByEmail(senderE);
    await sendNewMessageEmail(sender.name,time,receiver);
    return NextResponse.json({ status: true});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: false, message: error.message });
  }
}