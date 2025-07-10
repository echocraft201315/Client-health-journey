import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";

export async function POST(request) {
  const { id,status,email} = await request.json();
  try {
    const update = await messageRepo.markNotification(email);
    const updateMessage = await messageRepo.updateMessage(id,status);
    return NextResponse.json({ status: true, updateMessage });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}