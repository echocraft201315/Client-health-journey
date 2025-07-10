import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

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
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await userRepo.getAdminUsers();
  return NextResponse.json({ status: true, users });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const { fullName, email, phone, role, password, clinicId } = await request.json();
  if (role !== "admin" && role !== "clinic_admin") {
    return NextResponse.json({ status: false, message: "Invalid role" });
  }

  if (role === "clinic_admin" && !clinicId) {
    return NextResponse.json({ status: false, message: "Clinic ID is required" });
  }
  try {
    const user = await userRepo.createAdminUser(fullName, email, phone, role, password, clinicId);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: false, message: error.message });
  }
}
