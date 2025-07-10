import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/api/stripe";
import { SubscriptionPlan } from "@/app/lib/stack";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json(
            { error: "Webhook signature verification failed" },
            { status: 400 }
        );
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json(
            { error: err.message },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const customerId = session.customer;

                if (!customerId) {
                    console.error("Missing required metadata in checkout session:", session);
                    return NextResponse.json(
                        { error: "Missing required metadata" },
                        { status: 400 }
                    );
                }
                const subscriptionId = session.subscription;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const plan = SubscriptionPlan.find(plan => plan.priceId === subscription.items.data[0].price.id);
                if (!plan) {
                    console.error("Plan not found for price ID:", subscription.items.data[0].price.id);
                    return NextResponse.json(
                        { error: "Plan not found" },
                        { status: 404 }
                    );
                }

                const subscriptionTier = await subscriptionRepo.getSubscriptionTierByCustomerId(customerId);
                if (subscriptionTier) {
                    await subscriptionRepo.activeSubscriptionTier(subscriptionTier.id, plan.id, true);
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                if (!customerId) {
                    console.error("Missing customer ID in subscription update:", subscription);
                    return NextResponse.json(
                        { error: "Missing required metadata" },
                        { status: 400 }
                    );
                }

                if (subscription.status === "active") {
                    const plan = SubscriptionPlan.find(plan => plan.priceId === subscription.items.data[0].price.id);
                    if (!plan) {
                        console.error("Plan not found for price ID:", subscription.items.data[0].price.id);
                        return NextResponse.json(
                            { error: "Plan not found" },
                            { status: 404 }
                        );
                    }

                    const subscriptionTier = await subscriptionRepo.getSubscriptionTierByCustomerId(customerId);
                    if (subscriptionTier) {
                        await subscriptionRepo.activeSubscriptionTier(subscriptionTier.id, plan.id, true);
                    }
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const subscriptionTier = await subscriptionRepo.getSubscriptionTierByCustomerId(customerId);
                if (subscriptionTier) {
                    await subscriptionRepo.activeSubscriptionTier(subscriptionTier.id, null, false);
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                const subscriptionId = invoice.subscription;
                const customerId = invoice.customer;

                // Only process subscription invoices
                if (!subscriptionId) break;

                // Find user by Stripe customer ID
                const subscriptionTier = await subscriptionRepo.getSubscriptionTierByCustomerId(customerId);
                if (!subscriptionTier) {
                    console.error(`No subscription tier found for customer: ${customerId}`);
                    break;
                }

                // Get subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0].price.id;

                // Get plan from price ID
                const plan = SubscriptionPlan.find(plan => plan.priceId === priceId);
                if (!plan) {
                    console.error(`No plan found for price ID: ${priceId}`);
                    break;
                }

                await subscriptionRepo.createSubscriptionHistory(
                    subscriptionTier.clinicId,
                    subscriptionTier.id,
                    invoice.amount_paid / 100
                );

                console.log(`Subscription renewed for clinic: ${subscriptionTier.clinicId}`);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

