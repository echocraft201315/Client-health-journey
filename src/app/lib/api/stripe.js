import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia",
});

export const createCustomer = async (email, name) => {
    const customer = await stripe.customers.create({
        email,
        name,
    });
    return customer;
};

export const createCheckoutSession = async (customerId, priceId, email) => {
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.NEXTAUTH_URL}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout?status=canceled`,
        metadata: {
            priceId: priceId,
            email: email,
        },
        locale: 'en',
    });
    return session;
};

export const updateSubscription = async (subscriptionId, priceId) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionItemId = subscription.items.data[0].id;

    await stripe.subscriptions.update(subscriptionId, {
        items: [{
            id: subscriptionItemId,
            price: priceId
        }],
        proration_behavior: 'always_invoice',
    });
    return subscription;
};
