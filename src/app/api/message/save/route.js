import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";

export async function POST(request) {
  const { id,message,sender,receiver,status} = await request.json();
  try {
    const newMessage = await messageRepo.saveMessage(id,message,sender,receiver,status);
    const updateNotification = await messageRepo.updateNotification(receiver);
    return NextResponse.json({ status: true, newMessage });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

