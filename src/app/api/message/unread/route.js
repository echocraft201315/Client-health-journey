import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
    const email = session.user.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
 try {
    const users = await messageRepo.getUnreadUsers(email);
    return NextResponse.json({ status: true, users });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}
