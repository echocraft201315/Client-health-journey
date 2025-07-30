import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { clinicRepo } from "@/app/lib/db/clinicRepo";


export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { timeRange } = await request.json();
        const email = session.user.email;
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const recentActivity = await clinicRepo.getAllRecentactivityByRange(timeRange);
        return NextResponse.json({ status: true, recentActivity });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}