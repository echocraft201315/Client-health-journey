import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (sessionUser.role !== "clinic_admin" && sessionUser.role !== "coach") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const clinicId = sessionUser.clinic;
  const programs = await programRepo.getProsForCreateClient(clinicId);
  return NextResponse.json({ status: true, programs });
}