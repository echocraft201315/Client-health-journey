import { NextResponse } from "next/server";
import { ghlApi, getGHLProductByPlanId } from "@/app/lib/api/ghl";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";

export async function POST(request) {
    const body = await request.text();

    // Get custom secret from header (for custom webhooks)
    const customSecret = request.headers.get("x-custom-secret");

    // Verify custom webhook secret
    if (process.env.GHL_WEBHOOK_SECRET) {
        if (customSecret !== process.env.GHL_WEBHOOK_SECRET) {
            console.error("GHL custom webhook secret verification failed");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
    }

    let event;
    try {
        event = JSON.parse(body);
    } catch (error) {
        console.error("Failed to parse webhook body:", error);
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    console.log("GHL webhook received:", event);

    try {
        // Determine event type based on status
        const status = event.status;

        if (status === "active" || status === "trialing") {
            await handleSubscriptionCreated(event);
        } else if (status === "cancelled" || status === "canceled") {
            await handleSubscriptionCancelled(event);
        } else if (status === "past_due" || status === "unpaid") {
            await handlePaymentFailed(event);
        } else if (status === "active" && event.subscriptionId) {
            // If already active and we have subscriptionId, it's a renewal
            await handleSubscriptionRenewed(event);
        } else {
            await handleSubscriptionUpdated(event);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

async function handleSubscriptionCreated(data) {
    const { contactId, subscriptionId, productId, status } = data;

    // Find clinic by GHL contact ID
    const clinic = await clinicRepo.findByGHLContactId(contactId);
    if (!clinic) {
        console.error("Clinic not found for GHL contact ID:", contactId);
        return;
    }

    // Get product details - try productId first, then productName
    let product = getGHLProductByPlanId(productId);

    // If productId not found, try to find by product name
    if (!product && data.productName) {
        // Map product names to plan IDs
        const productNameMap = {
            'Starter Plan': 'starter',
            'Pro Plan': 'pro',
            'starter': 'starter',
            'pro': 'pro'
        };
        const planId = productNameMap[data.productName];
        if (planId) {
            product = getGHLProductByPlanId(planId);
        }
    }

    if (!product) {
        console.error("Unknown GHL product ID or name:", productId, data.productName);
        return;
    }

    // Update subscription in database
    await subscriptionRepo.updateSubscription({
        clinicId: clinic.id,
        ghlSubscriptionId: subscriptionId,
        ghlContactId: contactId,
        planId: product.planId,
        status: status,
        startDate: new Date(),
        endDate: null, // Will be set when subscription ends
        isActive: status === "active"
    });

    console.log("Subscription created for clinic:", clinic.id);
}

async function handleSubscriptionUpdated(data) {
    const { contactId, subscriptionId, status } = data;

    const clinic = await clinicRepo.findByGHLContactId(contactId);
    if (!clinic) {
        console.error("Clinic not found for GHL contact ID:", contactId);
        return;
    }

    await subscriptionRepo.updateSubscriptionStatus(
        clinic.id,
        subscriptionId,
        status
    );

    console.log("Subscription updated for clinic:", clinic.id);
}

async function handleSubscriptionCancelled(data) {
    const { contactId, subscriptionId } = data;

    const clinic = await clinicRepo.findByGHLContactId(contactId);
    if (!clinic) {
        console.error("Clinic not found for GHL contact ID:", contactId);
        return;
    }

    await subscriptionRepo.updateSubscriptionStatus(
        clinic.id,
        subscriptionId,
        "cancelled"
    );

    console.log("Subscription cancelled for clinic:", clinic.id);
}

async function handleSubscriptionRenewed(data) {
    const { contactId, subscriptionId, nextBillingDate } = data;

    const clinic = await clinicRepo.findByGHLContactId(contactId);
    if (!clinic) {
        console.error("Clinic not found for GHL contact ID:", contactId);
        return;
    }

    await subscriptionRepo.updateSubscriptionStatus(
        clinic.id,
        subscriptionId,
        "active"
    );

    console.log("Subscription renewed for clinic:", clinic.id);
}

async function handlePaymentSucceeded(data) {
    const { contactId, subscriptionId, amount } = data;

    const clinic = await clinicRepo.findByGHLContactId(contactId);
    if (!clinic) {
        console.error("Clinic not found for GHL contact ID:", contactId);
        return;
    }

    // Update subscription status to active
    await subscriptionRepo.updateSubscriptionStatus(
        clinic.id,
        subscriptionId,
        "active"
    );

    console.log("Payment succeeded for clinic:", clinic.id);
}

async function handlePaymentFailed(data) {
    const { contactId, subscriptionId } = data;

    const clinic = await clinicRepo.findByGHLContactId(contactId);
    if (!clinic) {
        console.error("Clinic not found for GHL contact ID:", contactId);
        return;
    }

    // Update subscription status to past_due
    await subscriptionRepo.updateSubscriptionStatus(
        clinic.id,
        subscriptionId,
        "past_due"
    );

    console.log("Payment failed for clinic:", clinic.id);
} 