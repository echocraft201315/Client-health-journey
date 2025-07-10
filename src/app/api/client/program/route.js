import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";
import { clientRepo } from "@/app/lib/db/clientRepo";
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

  const programId = await clientRepo.getProgramIdbyClientEmail(sessionEmail);
  const program = await programRepo.getProgrambyId(programId);
  return NextResponse.json({ status: true, program });
}

