import { NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { SubscriptionPlan } from "@/app/lib/stack";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const sessionEmail = session.user.email;
    const sessionUser = await userRepo.getUserByEmail(sessionEmail);
    if (!sessionUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const clinicId = sessionUser.clinic;
    const { id } = await params;

    if (clinicId !== id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const clinic = await clinicRepo.getClinicById(clinicId);
        const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinicId);
        let clientLimit = 0;
        let plan = null;
        if (subscriptionTier && subscriptionTier.isActive && subscriptionTier.endDate > new Date()) {
            plan = SubscriptionPlan.find(plan => plan.id === subscriptionTier.planId);
            clientLimit = plan.clientLimit;
        }
        return NextResponse.json({ 
            success: true, 
            clinic: {
                id: clinic.id,
                name: clinic.name,
                email: clinic.email
            },
            clientLimit, 
            planId: plan?.id, 
            currentPlan: subscriptionTier.planId
        });
    } catch (error) {
        console.error("Error fetching clinic data:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch clinic data" }, { status: 500 });
    }
}