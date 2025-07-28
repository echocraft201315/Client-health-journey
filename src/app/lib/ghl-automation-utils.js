import crypto from 'crypto';

/**
 * Automation Workflow Configuration
 * Defines triggers and their corresponding actions
 */
export const AUTOMATION_WORKFLOWS = {
    'subscription.activated': {
        name: 'Subscription Activation Workflow',
        description: 'Triggers when a subscription is activated',
        actions: [
            {
                name: 'activate_subscription',
                description: 'Activate subscription in local database',
                execute: 'handleSubscriptionActivation'
            },
            {
                name: 'send_welcome_email',
                description: 'Send welcome email to clinic',
                execute: 'sendWelcomeEmail'
            },
            {
                name: 'create_onboarding_tasks',
                description: 'Create onboarding tasks for clinic',
                execute: 'createOnboardingTasks'
            }
        ]
    },
    'subscription.cancelled': {
        name: 'Subscription Cancellation Workflow',
        description: 'Triggers when a subscription is cancelled',
        actions: [
            {
                name: 'deactivate_subscription',
                description: 'Deactivate subscription in local database',
                execute: 'handleSubscriptionDeactivation'
            },
            {
                name: 'send_cancellation_email',
                description: 'Send cancellation email to clinic',
                execute: 'sendCancellationEmail'
            },
            {
                name: 'create_retention_tasks',
                description: 'Create retention tasks',
                execute: 'createRetentionTasks'
            }
        ]
    },
    'subscription.payment_failed': {
        name: 'Payment Failure Workflow',
        description: 'Triggers when a payment fails',
        actions: [
            {
                name: 'log_payment_failure',
                description: 'Log payment failure in database',
                execute: 'logPaymentFailure'
            },
            {
                name: 'send_payment_reminder',
                description: 'Send payment reminder email',
                execute: 'sendPaymentReminder'
            },
            {
                name: 'create_payment_recovery_tasks',
                description: 'Create payment recovery tasks',
                execute: 'createPaymentRecoveryTasks'
            }
        ]
    },
    'subscription.renewed': {
        name: 'Subscription Renewal Workflow',
        description: 'Triggers when a subscription is renewed',
        actions: [
            {
                name: 'update_subscription',
                description: 'Update subscription in local database',
                execute: 'handleSubscriptionRenewal'
            },
            {
                name: 'send_renewal_confirmation',
                description: 'Send renewal confirmation email',
                execute: 'sendRenewalConfirmation'
            },
            {
                name: 'update_billing_records',
                description: 'Update billing records',
                execute: 'updateBillingRecords'
            }
        ]
    }
};

/**
 * Automation Engine - Executes workflow based on trigger
 * @param {string} trigger - The trigger event type
 * @param {Object} eventData - The event data
 * @param {Object} context - Additional context (clinic, subscription, etc.)
 * @returns {Object} - Execution results
 */
export async function executeAutomationWorkflow(trigger, eventData, context = {}) {
    const workflow = AUTOMATION_WORKFLOWS[trigger];

    if (!workflow) {
        console.log(`No automation workflow found for trigger: ${trigger}`);
        return {
            success: false,
            message: `No workflow configured for trigger: ${trigger}`,
            executedActions: []
        };
    }

    console.log(`Executing automation workflow: ${workflow.name}`);
    console.log(`Trigger: ${trigger}`);
    console.log(`Actions to execute: ${workflow.actions.length}`);

    const results = {
        trigger,
        workflow: workflow.name,
        executedActions: [],
        errors: [],
        startTime: new Date().toISOString()
    };

    // Execute each action in sequence
    for (const action of workflow.actions) {
        try {
            console.log(`Executing action: ${action.name}`);

            const actionResult = await executeAction(action.execute, eventData, context);

            results.executedActions.push({
                name: action.name,
                description: action.description,
                success: true,
                result: actionResult,
                executedAt: new Date().toISOString()
            });

            console.log(`Action completed: ${action.name}`);

        } catch (error) {
            console.error(`Action failed: ${action.name}`, error);

            results.executedActions.push({
                name: action.name,
                description: action.description,
                success: false,
                error: error.message,
                executedAt: new Date().toISOString()
            });

            results.errors.push({
                action: action.name,
                error: error.message
            });
        }
    }

    results.endTime = new Date().toISOString();
    results.success = results.errors.length === 0;

    console.log(`Automation workflow completed: ${workflow.name}`);
    console.log(`Actions executed: ${results.executedActions.length}`);
    console.log(`Errors: ${results.errors.length}`);

    return results;
}

/**
 * Action Executor - Maps action names to actual functions
 * @param {string} actionName - The action to execute
 * @param {Object} eventData - The event data
 * @param {Object} context - Additional context
 * @returns {Object} - Action result
 */
async function executeAction(actionName, eventData, context) {
    switch (actionName) {
        case 'handleSubscriptionActivation':
            return await handleSubscriptionActivation(eventData, context);
        case 'sendWelcomeEmail':
            return await sendWelcomeEmail(eventData, context);
        case 'createOnboardingTasks':
            return await createOnboardingTasks(eventData, context);
        case 'handleSubscriptionDeactivation':
            return await handleSubscriptionDeactivation(eventData, context);
        case 'sendCancellationEmail':
            return await sendCancellationEmail(eventData, context);
        case 'createRetentionTasks':
            return await createRetentionTasks(eventData, context);
        case 'logPaymentFailure':
            return await logPaymentFailure(eventData, context);
        case 'sendPaymentReminder':
            return await sendPaymentReminder(eventData, context);
        case 'createPaymentRecoveryTasks':
            return await createPaymentRecoveryTasks(eventData, context);
        case 'handleSubscriptionRenewal':
            return await handleSubscriptionRenewal(eventData, context);
        case 'sendRenewalConfirmation':
            return await sendRenewalConfirmation(eventData, context);
        case 'updateBillingRecords':
            return await updateBillingRecords(eventData, context);
        default:
            throw new Error(`Unknown action: ${actionName}`);
    }
}

// Action Implementations
async function handleSubscriptionActivation(eventData, context) {
    // This will be implemented in the main webhook file
    return { message: 'Subscription activation handled', data: eventData };
}

async function sendWelcomeEmail(eventData, context) {
    // Simulate sending welcome email
    console.log(`Sending welcome email to clinic: ${context.clinic?.email}`);
    return { message: 'Welcome email sent', recipient: context.clinic?.email };
}

async function createOnboardingTasks(eventData, context) {
    // Simulate creating onboarding tasks
    console.log(`Creating onboarding tasks for clinic: ${context.clinic?.id}`);
    return { message: 'Onboarding tasks created', clinicId: context.clinic?.id };
}

async function handleSubscriptionDeactivation(eventData, context) {
    // This will be implemented in the main webhook file
    return { message: 'Subscription deactivation handled', data: eventData };
}

async function sendCancellationEmail(eventData, context) {
    // Simulate sending cancellation email
    console.log(`Sending cancellation email to clinic: ${context.clinic?.email}`);
    return { message: 'Cancellation email sent', recipient: context.clinic?.email };
}

async function createRetentionTasks(eventData, context) {
    // Simulate creating retention tasks
    console.log(`Creating retention tasks for clinic: ${context.clinic?.id}`);
    return { message: 'Retention tasks created', clinicId: context.clinic?.id };
}

async function logPaymentFailure(eventData, context) {
    // Simulate logging payment failure
    console.log(`Logging payment failure for clinic: ${context.clinic?.id}`);
    return { message: 'Payment failure logged', clinicId: context.clinic?.id };
}

async function sendPaymentReminder(eventData, context) {
    // Simulate sending payment reminder
    console.log(`Sending payment reminder to clinic: ${context.clinic?.email}`);
    return { message: 'Payment reminder sent', recipient: context.clinic?.email };
}

async function createPaymentRecoveryTasks(eventData, context) {
    // Simulate creating payment recovery tasks
    console.log(`Creating payment recovery tasks for clinic: ${context.clinic?.id}`);
    return { message: 'Payment recovery tasks created', clinicId: context.clinic?.id };
}

async function handleSubscriptionRenewal(eventData, context) {
    // This will be implemented in the main webhook file
    return { message: 'Subscription renewal handled', data: eventData };
}

async function sendRenewalConfirmation(eventData, context) {
    // Simulate sending renewal confirmation
    console.log(`Sending renewal confirmation to clinic: ${context.clinic?.email}`);
    return { message: 'Renewal confirmation sent', recipient: context.clinic?.email };
}

async function updateBillingRecords(eventData, context) {
    // Simulate updating billing records
    console.log(`Updating billing records for clinic: ${context.clinic?.id}`);
    return { message: 'Billing records updated', clinicId: context.clinic?.id };
}

/**
 * Verify GoHighLevel webhook signature for automation
 */
export function verifyGHLWebhookSignature(payload, signature, secret) {
    if (!secret || !signature) {
        console.warn('Missing webhook secret or signature');
        return false;
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload, 'utf8')
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'hex'),
            Buffer.from(signature.replace('sha256=', ''), 'hex')
        );
    } catch (error) {
        console.error('Error verifying webhook signature:', error);
        return false;
    }
}

/**
 * Extract clinic identifier from automation event data
 * Handles both flat key-value and nested structures
 */
export function extractClinicIdentifier(eventData) {
    const {
        customer_email,
        customer_id,
        contact_email,
        contact_id,
        email,
        clinic_email,
        clinic_id
    } = eventData;

    return {
        email: customer_email || contact_email || email || clinic_email,
        customer_id: customer_id || contact_id || clinic_id
    };
}

/**
 * Parse automation event data
 * Handles both flat key-value and nested structures from GHL
 */
export function parseAutomationEvent(eventData) {
    const {
        subscription_id,
        subscriptionId,
        customer_id,
        customerId,
        plan_id,
        planId,
        productName,
        amount,
        payment_amount,
        start_date,
        startDate,
        end_date,
        endDate,
        status,
        event_type,
        eventType,
        failure_reason,
        failureReason,
        clinic_name,
        companyName,
        contact_name,
        contactName,
        phone
    } = eventData;

    return {
        subscription_id: subscription_id || subscriptionId,
        customer_id: customer_id || customerId,
        plan_id: plan_id || planId || productName,
        amount: amount || payment_amount,
        start_date: start_date || startDate,
        end_date: end_date || endDate,
        status: status,
        event_type: event_type || eventType,
        failure_reason: failure_reason || failureReason,
        clinic_name: clinic_name || companyName,
        contact_name: contact_name || contactName,
        phone: phone
    };
}

/**
 * Map GHL event types to automation triggers
 */
export function mapGHLToAutomationTrigger(ghlEventType) {
    const triggerMap = {
        'subscription.created': 'subscription.activated',
        'subscription.activated': 'subscription.activated',
        'subscription.cancelled': 'subscription.cancelled',
        'subscription.deactivated': 'subscription.cancelled',
        'subscription.renewed': 'subscription.renewed',
        'subscription.payment_success': 'subscription.renewed',
        'subscription.payment_failed': 'subscription.payment_failed',
        'subscription.updated': 'subscription.activated',
        'subscription.paused': 'subscription.cancelled',
        'subscription.resumed': 'subscription.activated'
    };

    return triggerMap[ghlEventType] || ghlEventType;
}

/**
 * Log automation workflow execution
 */
export function logAutomationExecution(trigger, eventData, results) {
    const logData = {
        timestamp: new Date().toISOString(),
        trigger,
        eventData: {
            subscriptionId: eventData.subscription_id,
            customerId: eventData.customer_id,
            planId: eventData.plan_id,
            amount: eventData.amount,
            customerEmail: eventData.customer_email
        },
        results: {
            success: results.success,
            actionsExecuted: results.executedActions.length,
            errors: results.errors.length,
            startTime: results.startTime,
            endTime: results.endTime
        }
    };

    console.log('GHL Automation Workflow:', JSON.stringify(logData, null, 2));
} 