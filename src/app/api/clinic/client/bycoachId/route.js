import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";

export async function POST(request) {

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;
    const user = await userRepo.getUserByEmail(userEmail);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.role !== "clinic_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const {coachId} = await request.json();
    const clients = await clientRepo.getclientsbycoachId(coachId);
    return NextResponse.json({ status: true, clients });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
