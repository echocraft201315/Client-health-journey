import { NextResponse } from "next/server";
import { activityRepo } from "@/app/lib/db/activityRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";

export async function POST(request) {
  const { type, description, clinicId } = await request.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const email = session.user.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.role !== "client") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const updateclient = await activityRepo.updateclientActivity(email);
    const activity = await activityRepo.createActivity(type, description, clinicId);
    console.log("activity", activity);
    return NextResponse.json({ status: true, activity });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: false, message: error.message });
  }
}