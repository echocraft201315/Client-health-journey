import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";
import { clientRepo } from "@/app/lib/db/clientRepo";
import { clientProfileRepo } from "@/app/lib/db/clientProfileRepo";

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const client = await clientRepo.getClientById(id);
    if (!client) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await clientProfileRepo.deleteClientProfile(client.id);
    const result = await userRepo.deleteClient(client.email);
    return NextResponse.json({ status: true, result });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const client = await clientRepo.getClientById(id);
    if (!client) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = await userRepo.getUserByEmail(client.email);
    const resetPassword = "password123";
    const result = await userRepo.resetPassword(user.id, resetPassword);
    return NextResponse.json({ status: true, result });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}