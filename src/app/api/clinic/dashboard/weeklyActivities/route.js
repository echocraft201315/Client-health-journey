import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { clinicRepo } from "@/app/lib/db/clinicRepo";

export async function GET() {
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
        if (user.role !== "clinic_admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const clinicId = user.clinic;

        const numActivity = await clinicRepo.getNumWactiveCount(clinicId);
        console.log("activity",numActivity,clinicId);
        return NextResponse.json({ status: true, numActivity });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}