import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";

export async function POST(request) {
  const { messageIds,viewerEmail} = await request.json();
console.log("adsfasdfasdfasdf",messageIds,viewerEmail)
  try {
    const updateMessage = await messageRepo.viewedMessage(messageIds,viewerEmail);
    const update = await messageRepo.markNotification(viewerEmail);

    return NextResponse.json({ status: true, updateMessage });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}