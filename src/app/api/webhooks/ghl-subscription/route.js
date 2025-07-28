import { NextResponse } from "next/server";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { userRepo } from "@/app/lib/db/userRepo";
// Webhook secret for verification (should be stored in environment variables)
const WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-ghl-signature') ||
            request.headers.get('x-webhook-signature') ||
            request.headers.get('authorization');
        console.log("webhook secret", WEBHOOK_SECRET);
        console.log("signature", signature);
        console.log('GHL Automation Webhook received:', body);
        // Verify webhook signature
        if (WEBHOOK_SECRET !== signature) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse the body - GHL sends flat key-value pairs
        let payload;
        try {
            // Try to parse as JSON first
            payload = JSON.parse(body);
        } catch (error) {
            // If not JSON, parse as form data
            const formData = new URLSearchParams(body);
            payload = {};
            for (const [key, value] of formData.entries()) {
                payload[key] = value;
            }
        }

        console.log('GHL Automation Webhook received:', JSON.stringify(payload, null, 2));

        // Extract event type and normalize data structure
        // GHL sends subscription.status, we need to map it to our event types
        const ghlStatus = payload.event;
        const automationTrigger = mapGHLStatusToTrigger(ghlStatus);

        // Normalize the flat payload into the expected structure
        const normalizedEventData = {
            subscription_id: payload.subscriptionId,
            customer_id: payload.customer_id,
            customer_email: payload.customer_email,
            plan_id: payload.plan_id,
            ghl_status: ghlStatus,
            started_date: payload.start_date,
            name: payload.name,
            phone: payload.phone,
        };

        // Handle specific subscription actions that need database updates
        await handleSubscriptionDatabaseActions(automationTrigger, normalizedEventData);

        return NextResponse.json({
            message: 'Automation workflow executed successfully',
        }, { status: 200 });

    } catch (error) {
        console.error('Error processing GHL automation webhook:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}

/**
 * Map GHL subscription status to automation trigger
 * GHL sends status like 'active', 'cancelled', 'failed' etc.
 */
function mapGHLStatusToTrigger(ghlStatus) {
    const statusMap = {
        'active': 'subscription.activated',
        'activated': 'subscription.activated',
        'created': 'subscription.activated',
        'incomplete': 'subscription.activated', // Handle incomplete status
        'canceled': 'subscription.cancelled',
        'deactivated': 'subscription.cancelled',
        'failed': 'subscription.payment_failed',
        'payment_failed': 'subscription.payment_failed',
        'renewed': 'subscription.renewed',
        'payment_success': 'subscription.renewed',
        'updated': 'subscription.activated',
        'paused': 'subscription.cancelled',
        'resumed': 'subscription.activated'
    };

    const trigger = statusMap[ghlStatus?.toLowerCase()] || 'subscription.activated';
    console.log(`GHL Status: ${ghlStatus} -> Mapped to trigger: ${trigger}`);
    return trigger;
}

/**
 * Handle subscription database actions based on automation trigger
 * This separates database operations from automation workflow actions
 */
async function handleSubscriptionDatabaseActions(trigger, eventData) {
    try {
        switch (trigger) {
            case 'subscription.activated':
                await handleSubscriptionActivation(eventData);
                break;

            case 'subscription.cancelled':
                await handleSubscriptionCancellation(eventData);
                break;

            case 'subscription.renewed':
                await handleSubscriptionRenewal(eventData);
                break;

            case 'subscription.payment_failed':
                await handlePaymentFailure(eventData);
                break;

            default:
                console.log(`No database actions for trigger: ${trigger}`);
        }
    } catch (error) {
        console.error(`Error handling database actions for trigger ${trigger}:`, error);
        throw error;
    }
}

/**
 * Handle subscription activation database operations
 */
async function handleSubscriptionActivation(eventData) {
    const {
        subscription_id,
        customer_email,
        plan_id,
        start_date,
        name,
        phone
    } = eventData;

    try {
        // Calculate end_date for monthly subscription (30 days from start_date)
        const startDate = start_date ? new Date(start_date) : new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30); // Add 30 days for monthly subscription

        const clinic = await clinicRepo.getClinicByEmail(customer_email);

        if (clinic) {
            let subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinic.id);
            if (subscriptionTier) {
                // Update existing subscription
                await subscriptionRepo.updateSubscriptionStatus(
                    clinic.id,
                    plan_id,
                    subscription_id,
                    startDate,
                    endDate,
                    true
                );
            }
            else {
                // Create new subscription tier
                await subscriptionRepo.createSubscriptionTier(
                    clinic.id,
                    plan_id,
                    subscription_id,
                    startDate,
                    endDate,
                    true
                );
            }
        }
        else {
            // Create new clinic
            try {
                const newClinic = await clinicRepo.createClinic(
                    customer_email,
                    name,
                    phone
                );
                // Create new subscription tier
                await subscriptionRepo.createSubscriptionTier(
                    newClinic.id,
                    plan_id,
                    subscription_id,
                    startDate,
                    endDate,
                    true
                );
                const adminUser = await userRepo.createAdminUser(
                    name,
                    customer_email,
                    phone,
                    "clinic_admin",
                    "password123",
                    newClinic.id
                );
            } catch (error) {
                console.error('Error creating new clinic:', error);
            }
        }

        console.log(`✅ Subscription activated - Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);

        return NextResponse.json({
            success: true,
            url: "/login",
            message: 'Subscription activated successfully',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
    } catch (error) {
        console.log('Error in handleSubscriptionActivation:', error);
        return NextResponse.json({
            success: false,
            message: 'Error in handleSubscriptionActivation'
        });
    }
}

/**
 * Handle subscription cancellation database operations
 */
async function handleSubscriptionCancellation(eventData) {
    const {
        subscription_id,
        customer_email
    } = eventData;

    const clinic = await clinicRepo.getClinicByEmail(customer_email);
    console.log(`Subscription cancelled for clinic: ${clinic.id}`);
    if (!clinic) {
        console.error('Clinic not found for subscription cancellation:', eventData);
        return;
    }

    // Update subscription status to inactive with current date as end date
    await subscriptionRepo.cancelSubscriptionStatus(
        clinic.id,
        false,
        subscription_id,
        new Date() // Set end date to current date
    );


}

/**
 * Handle subscription renewal database operations
 */
async function handleSubscriptionRenewal(eventData) {
    const {
        subscription_id,
        customer_email,
        start_date
    } = eventData;

    // Get subscription tier
    const clinic = await clinicRepo.getClinicByEmail(customer_email);

    if (!clinic) {
        console.error('Clinic not found for renewal:', customer_email);
        return;
    }

    const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinic.id);

    if (!subscriptionTier) {
        console.error('Subscription tier not found for renewal:', clinic.id);
        return;
    }

    // Calculate new end date for renewal (30 days from current date or start_date)
    const renewalStartDate = start_date ? new Date(start_date) : new Date();
    const newEndDate = new Date(renewalStartDate);
    newEndDate.setDate(newEndDate.getDate() + 30); // Add 30 days for monthly renewal

    // Update subscription with new end date
    await subscriptionRepo.renewalSubscriptionStatus(
        clinic.id,
        true,
        subscription_id,
        newEndDate
    );

    console.log(`Subscription renewed for clinic: ${clinic.id} - New end date: ${newEndDate.toISOString()}`);
}

/**
 * Handle payment failure database operations
 */
async function handlePaymentFailure(eventData) {
    const {
        subscription_id,
        customer_email,
        failure_reason
    } = eventData;

    const clinic = await clinicRepo.getClinicByEmail(customer_email);

    if (!clinic) {
        console.error('Clinic not found for payment failure:', customer_email);
        return;
    }

    // Log payment failure (you might want to create a separate table for this)
    console.log(`Payment failed for clinic: ${clinic.id}, reason: ${failure_reason}`);

    // You could also update subscription status to indicate payment issues
    // await subscriptionRepo.updateSubscriptionStatus(clinic.id, false, subscription_id);
}
