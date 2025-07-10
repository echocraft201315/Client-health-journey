import { NextResponse } from "next/server";
import { activityRepo } from "@/app/lib/db/activityRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const { type, description, clinicId } = await request.json();
  try {
    const activity = await activityRepo.createActivity(type, description, clinicId);
    return NextResponse.json({ status: true, activity });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}