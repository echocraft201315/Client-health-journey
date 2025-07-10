import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sender = session.user.email;
  const { receiver } = await request.json();

  try {
    const messageHistory = await messageRepo.readMessageHistory(sender, receiver);
    return NextResponse.json({ status: true, messageHistory });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}