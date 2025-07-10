import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";

export async function GET() {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return Response.json({ success: false, message: "User not found" });
    }
    try {
        const user = await userRepo.getUserByEmail(session?.user?.email);
        if (!user) {
            return Response.json({ success: false, message: "User not found" });
        }
        
        return Response.json({ success: true, user: user });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "User fetch failed" });
    }
}

export async function PUT(req) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return Response.json({ success: false, message: "User not found" });
    }
    try {
        const user = await userRepo.getUserByEmail(session?.user?.email);
        if (!user) {
            return Response.json({ success: false, message: "User not found" });
        }
        const { name, email, phone, origin } = await req.json();
        console.log(name, email, phone, origin);
        const updatedUser = await userRepo.updateAdminUser(user.id, name, email, phone, user.role, user.isActive, origin);
        return Response.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "User update failed" });
    }
}