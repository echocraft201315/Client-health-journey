import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";

export async function POST(request) {
    const { currentPassword, newPassword } = await request.json();

    const session = await getServerSession();
    if (!session?.user?.email) {
        return Response.json({ success: false, message: "User not found" });
    }

    const user = await userRepo.authenticate(session?.user?.email, currentPassword);
    if (!user) {
        return Response.json({ success: false, message: "Invalid current password" });
    }

    await userRepo.resetPassword(user.id, newPassword);
    return NextResponse.json({ success: true, message: "Password updated successfully" });
}
