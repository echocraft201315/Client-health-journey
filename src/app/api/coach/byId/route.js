import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const email = session.user.email;
  const user = await userRepo.getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  
  const coachId = user.coachId;
  try {
      const user = await userRepo.getUserById(coachId);
      console.log("user", user);
      return NextResponse.json({ status: true, user });
    } catch (error) {
      return NextResponse.json({ status: false, message: error.message });
    }
}