import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";

export async function POST(request) {
  const { email} = await request.json();
  try {
    const update = await messageRepo.markNotification(email);
    console.log("updated", update)
    return NextResponse.json({ status: true, update });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

