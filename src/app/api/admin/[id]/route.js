import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";

export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const email = session.user.email;
    const user = await userRepo.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userData = await userRepo.getUserById(id);
    return NextResponse.json({ status: true, user: userData });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { full_name, email, phone, role, is_active } = await request.json();
  
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

  try {
    const user = await userRepo.updateAdminUser(id, full_name, email, phone, role, is_active);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const user = await userRepo.deleteAdminUser(id);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}