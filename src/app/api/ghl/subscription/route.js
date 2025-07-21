import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { ghlApi, getGHLProductByPlanId, createGHLSubscriptionUrl } from "@/app/lib/api/ghl";
import { SubscriptionPlan } from "@/app/lib/stack";
import authOptions from "@/app/lib/authoption";

export async function POST(request) {
    const { planId, action } = await request.json();

    if (!planId || !action) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const email = session?.user?.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const clinic = await clinicRepo.getClinicById(user.clinic);
    if (!clinic) {
        return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
    }

    try {
        switch (action) {
            case 'create':
                return await handleCreateSubscription(clinic, planId);
            case 'update':
                return await handleUpdateSubscription(clinic, planId);
            case 'cancel':
                return await handleCancelSubscription(clinic);
            default:
                return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error('GHL Subscription Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function handleCreateSubscription(clinic, planId) {
    // Check if plan exists
    const plan = SubscriptionPlan.find(plan => plan.id === planId);
    if (!plan) {
        return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 });
    }

    // Check if clinic already has a subscription
    const existingSubscription = await subscriptionRepo.getSubscriptionTier(clinic.id);
    if (existingSubscription && existingSubscription.isActive) {
        return NextResponse.json({ success: false, error: "Clinic already has an active subscription" }, { status: 400 });
    }

    try {
        // Check if contact exists in GHL, create if not
        let ghlContact;
        try {
            ghlContact = await ghlApi.getContactByEmail(clinic.email);
        } catch (error) {
            // Contact doesn't exist, create it
            const contactName = clinic.primaryContact || clinic.name;
            const [firstName, ...lastNameParts] = contactName.split(' ');
            const lastName = lastNameParts.join(' ') || '';

            ghlContact = await ghlApi.createContact({
                email: clinic.email,
                firstName: firstName,
                lastName: lastName,
                phone: clinic.phoneNumber,
                companyName: clinic.name,
                clinicId: clinic.id,
                role: 'clinic_admin',
            });
        }

        // Create subscription tier in local database
        const subscriptionTier = await subscriptionRepo.createGHLSubscriptionTier(
            clinic.id,
            planId,
            ghlContact.id
        );

        // Get GHL product details
        const ghlProduct = getGHLProductByPlanId(planId);
        if (!ghlProduct) {
            return NextResponse.json({ success: false, error: "GHL product not configured for this plan" }, { status: 400 });
        }

        // Create subscription URL for GHL
        const subscriptionUrl = createGHLSubscriptionUrl(clinic.id, planId, ghlContact.id);

        return NextResponse.json({
            success: true,
            subscriptionUrl,
            message: "Redirect to GHL to complete subscription setup"
        });

    } catch (error) {
        console.error('Error creating GHL subscription:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function handleUpdateSubscription(clinic, newPlanId) {
    const existingSubscription = await subscriptionRepo.getSubscriptionTier(clinic.id);
    if (!existingSubscription || !existingSubscription.ghlSubscriptionId) {
        return NextResponse.json({ success: false, error: "No active GHL subscription found" }, { status: 400 });
    }

    try {
        // Get GHL product details for new plan
        const ghlProduct = getGHLProductByPlanId(newPlanId);
        if (!ghlProduct) {
            return NextResponse.json({ success: false, error: "GHL product not configured for this plan" }, { status: 400 });
        }

        // Update subscription in GHL
        await ghlApi.updateSubscription(existingSubscription.ghlSubscriptionId, {
            productId: ghlProduct.productId,
            priceId: ghlProduct.priceId,
        });

        // Update local database
        await subscriptionRepo.updateSubscriptionTier(clinic.id, newPlanId);

        return NextResponse.json({
            success: true,
            message: "Subscription updated successfully"
        });

    } catch (error) {
        console.error('Error updating GHL subscription:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function handleCancelSubscription(clinic) {
    const existingSubscription = await subscriptionRepo.getSubscriptionTier(clinic.id);
    if (!existingSubscription || !existingSubscription.ghlSubscriptionId) {
        return NextResponse.json({ success: false, error: "No active GHL subscription found" }, { status: 400 });
    }

    try {
        // Cancel subscription in GHL
        await ghlApi.cancelSubscription(existingSubscription.ghlSubscriptionId);

        // Update local database
        await subscriptionRepo.updateGHLSubscriptionStatus(clinic.id, existingSubscription.ghlSubscriptionId, false);

        return NextResponse.json({
            success: true,
            message: "Subscription cancelled successfully"
        });

    } catch (error) {
        console.error('Error cancelling GHL subscription:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// GET endpoint to check subscription status
export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const email = session?.user?.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    try {
        const subscriptionTier = await subscriptionRepo.getSubscriptionTier(user.clinic);
        if (!subscriptionTier) {
            return NextResponse.json({ success: true, subscription: null });
        }

        // If it's a GHL subscription, get additional details
        let ghlDetails = null;
        if (subscriptionTier.subscriptionProvider === 'ghl' && subscriptionTier.ghlSubscriptionId) {
            try {
                ghlDetails = await ghlApi.getSubscription(subscriptionTier.ghlSubscriptionId);
            } catch (error) {
                console.error('Error fetching GHL subscription details:', error);
            }
        }

        return NextResponse.json({
            success: true,
            subscription: {
                ...subscriptionTier,
                ghlDetails
            }
        });

    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
} 