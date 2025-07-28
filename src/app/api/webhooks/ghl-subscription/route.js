import { NextResponse } from "next/server";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import {
    executeAutomationWorkflow,
    extractClinicIdentifier,
    parseAutomationEvent,
    mapGHLToAutomationTrigger,
    logAutomationExecution
} from "@/app/lib/ghl-automation-utils.js";

// Bearer token for authorization (should be stored in environment variables)
const BEARER_TOKEN = process.env.GHL_BEARER_TOKEN || 'ClinicApp_GHL_WebhookSecret_2024';

export async function POST(request) {
    try {
        const body = await request.text();

        // Get Bearer token from Authorization header
        const authHeader = request.headers.get('authorization');
        const bearerToken = authHeader?.replace('Bearer ', '');

        console.log('Expected Bearer token:', BEARER_TOKEN);
        console.log('Received Bearer token:', bearerToken);
        console.log('GHL Automation Webhook received:', body);

        // Verify Bearer token
        if (!bearerToken || bearerToken !== BEARER_TOKEN) {
            console.error('Invalid Bearer token');
            console.error('Expected:', BEARER_TOKEN);
            console.error('Received:', bearerToken);
            return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 });
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
        const ghlStatus = payload.event || payload.status;
        const automationTrigger = mapGHLStatusToTrigger(ghlStatus);

        // Normalize the flat payload into the expected structure
        // Match the exact field names from your GHL configuration
        const normalizedEventData = {
            subscription_id: payload.subscriptionId || payload.subscription_id,
            customer_id: payload.customer_id,
            customer_email: payload.customer_email,
            plan_id: payload.plan_id,
            amount: payload.amount,
            start_date: payload.start_date || payload.startDate,
            end_date: payload.end_date || payload.endDate,
            failure_reason: payload.failure_reason || payload.failureReason,
            clinic_name: payload.clinic_name || payload.companyName,
            contact_name: payload.contact_name || payload.contactName,
            phone: payload.phone,
            // Store original GHL status for debugging
            ghl_status: ghlStatus
        };

        // Parse and normalize event data
        const parsedEventData = parseAutomationEvent(normalizedEventData);

        // Extract clinic identifier and find clinic
        const clinicIdentifier = extractClinicIdentifier(parsedEventData);
        let clinic = null;

        if (clinicIdentifier.email) {
            clinic = await clinicRepo.getClinicByEmail(clinicIdentifier.email);
        } else if (clinicIdentifier.customer_id) {
            clinic = await clinicRepo.getClinicById(clinicIdentifier.customer_id);
        }

        if (!clinic) {
            console.error('Clinic not found for automation trigger:', parsedEventData);
            return NextResponse.json({
                error: 'Clinic not found',
                automationTrigger,
                eventData: parsedEventData,
                receivedPayload: payload,
                ghlStatus: ghlStatus
            }, { status: 404 });
        }

        // Prepare context for automation workflow
        const context = {
            clinic,
            subscriptionData: parsedEventData,
            timestamp: new Date().toISOString(),
            originalPayload: payload,
            ghlStatus: ghlStatus
        };

        // Execute automation workflow based on trigger
        const workflowResults = await executeAutomationWorkflow(
            automationTrigger,
            parsedEventData,
            context
        );

        // Log automation execution
        logAutomationExecution(automationTrigger, parsedEventData, workflowResults);

        // Handle specific subscription actions that need database updates
        await handleSubscriptionDatabaseActions(automationTrigger, parsedEventData, clinic);

        return NextResponse.json({
            message: 'Automation workflow executed successfully',
            trigger: automationTrigger,
            workflow: workflowResults.workflow,
            actionsExecuted: workflowResults.executedActions.length,
            success: workflowResults.success,
            errors: workflowResults.errors,
            clinicFound: !!clinic,
            clinicId: clinic?.id,
            ghlStatus: ghlStatus
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
        'cancelled': 'subscription.cancelled',
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
async function handleSubscriptionDatabaseActions(trigger, eventData, clinic) {
    try {
        switch (trigger) {
            case 'subscription.activated':
                await handleSubscriptionActivation(eventData, clinic);
                break;

            case 'subscription.cancelled':
                await handleSubscriptionCancellation(eventData, clinic);
                break;

            case 'subscription.renewed':
                await handleSubscriptionRenewal(eventData, clinic);
                break;

            case 'subscription.payment_failed':
                await handlePaymentFailure(eventData, clinic);
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
async function handleSubscriptionActivation(eventData, clinic) {
    const {
        subscription_id,
        plan_id,
        amount,
        start_date,
        end_date
    } = eventData;

    // Create or update subscription tier
    let subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinic.id);

    if (subscriptionTier) {
        // Update existing subscription
        await subscriptionRepo.updateSubscriptionStatus(
            clinic.id,
            true,
            subscription_id,
            end_date ? new Date(end_date) : null
        );

        if (start_date) {
            await subscriptionRepo.updateSubscriptionDates(
                clinic.id,
                new Date(start_date),
                end_date ? new Date(end_date) : null
            );
        }
    } else {
        // Create new subscription tier
        subscriptionTier = await subscriptionRepo.createSubscriptionTier(
            clinic.id,
            plan_id,
            subscription_id
        );

        if (start_date) {
            await subscriptionRepo.updateSubscriptionDates(
                clinic.id,
                new Date(start_date),
                end_date ? new Date(end_date) : null
            );
        }
    }

    // Create subscription history record
    if (amount) {
        await subscriptionRepo.createSubscriptionHistory(
            clinic.id,
            subscriptionTier.id,
            parseFloat(amount)
        );
    }

    console.log(`Subscription activated for clinic: ${clinic.id}`);
}

/**
 * Handle subscription cancellation database operations
 */
async function handleSubscriptionCancellation(eventData, clinic) {
    const {
        subscription_id,
        end_date
    } = eventData;

    // Update subscription status to inactive
    await subscriptionRepo.updateSubscriptionStatus(
        clinic.id,
        false,
        subscription_id,
        end_date ? new Date(end_date) : new Date()
    );

    console.log(`Subscription cancelled for clinic: ${clinic.id}`);
}

/**
 * Handle subscription renewal database operations
 */
async function handleSubscriptionRenewal(eventData, clinic) {
    const {
        subscription_id,
        amount
    } = eventData;

    // Get subscription tier
    const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinic.id);

    if (!subscriptionTier) {
        console.error('Subscription tier not found for renewal:', clinic.id);
        return;
    }

    // Create subscription history record for renewal payment
    if (amount) {
        await subscriptionRepo.createSubscriptionHistory(
            clinic.id,
            subscriptionTier.id,
            parseFloat(amount)
        );
    }

    console.log(`Subscription renewed for clinic: ${clinic.id}`);
}

/**
 * Handle payment failure database operations
 */
async function handlePaymentFailure(eventData, clinic) {
    const {
        subscription_id,
        failure_reason
    } = eventData;

    // Log payment failure (you might want to create a separate table for this)
    console.log(`Payment failed for clinic: ${clinic.id}, reason: ${failure_reason}`);

    // You could also update subscription status to indicate payment issues
    // await subscriptionRepo.updateSubscriptionStatus(clinic.id, false, subscription_id);
} 