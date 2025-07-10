import { NextResponse } from "next/server";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { sendCoachRegistrationEmail } from "@/app/lib/api/email";

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
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const coaches = await userRepo.getCoaches();
        return NextResponse.json({ status: true, coaches });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const sessionEmail = session.user.email;
        const sessionUser = await userRepo.getUserByEmail(sessionEmail);
        if (!sessionUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (sessionUser.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { name, email, phoneNumber, clinicId } = await request.json();
        const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await userRepo.createAdminUser(
            name,
            email,
            phoneNumber,
            "coach",
            randomPassword,
            clinicId
        );
        await sendCoachRegistrationEmail({ name, email }, randomPassword);
        return NextResponse.json({ status: true, message: "Coach created successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
