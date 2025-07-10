import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";

export async function POST(request) {
  const { email} = await request.json();
  try {
    const getNumber = await messageRepo.getNumber(email);
    console.log("saved message", getNumber)
    return NextResponse.json({ status: true, getNumber });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

