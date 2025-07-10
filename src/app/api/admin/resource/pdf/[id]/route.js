import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { resourceRepo } from "@/app/lib/db/resourceRepo";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "No PDF ID provided" }, { status: 400 });
    }
    await resourceRepo.deleteResource(id);
    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
} 