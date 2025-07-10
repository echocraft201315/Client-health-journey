import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { resourceRepo } from "@/app/lib/db/resourceRepo";

export async function PUT(request, { params }) {
  const { id } = await params;
  const { title, description, role, category, type, content } = await request.json();
  
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
    const data = await resourceRepo.updateResource(id, title, description, role, category, type, content);
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const data = await resourceRepo.deleteResource(id);
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}