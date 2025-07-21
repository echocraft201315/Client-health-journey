export const SubscriptionPlan = [
    {
        id: "starter",
        name: "Starter",
        price: 297,
        features: [
            "Up to 20 clients",
            "Coach and Client Management",
            "Check-in and Progress Tracking",
            "Messaging and Communication",
            "Reports and Analytics",
        ],
        clientLimit: 20,
        // GHL product and price IDs will be configured via environment variables
        ghlProductId: process.env.GHL_STARTER_PRODUCT_ID,
        ghlPriceId: process.env.GHL_STARTER_PRICE_ID,
    },
    {
        id: "pro",
        name: "Pro",
        price: 697,
        features: [
            "Unlimited Clients",
            "Coach and Client Management",
            "Check-in and Progress Tracking",
            "Messaging and Communication",
            "Reports and Analytics",
            "Priority Support",
            "AI Driven Analytics",
        ],
        clientLimit: false,
        // GHL product and price IDs will be configured via environment variables
        ghlProductId: process.env.GHL_PRO_PRODUCT_ID,
        ghlPriceId: process.env.GHL_PRO_PRICE_ID,
    }
]