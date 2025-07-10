import { NextResponse } from "next/server";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function DELETE(request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await subscriptionRepo.deleteSessionByClinicId(user.clinic);
    return NextResponse.json({ message: "Session deleted" }, { status: 200 });
}