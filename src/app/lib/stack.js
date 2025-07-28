/**
 * Subscription Plans Configuration
 * Defines available subscription plans for clinics
 */
export const SubscriptionPlan = [
    {
        id: 'basic_plan',
        name: 'Basic Plan',
        description: 'Essential features for small clinics',
        price: '$99/month',
        features: [
            'Up to 50 clients',
            'Basic health tracking',
            'Email support',
            'Standard reports'
        ],
        ghlPaymentLink: 'https://pay.gohighlevel.com/basic-plan'
    },
    {
        id: 'premium_plan',
        name: 'Premium Plan',
        description: 'Advanced features for growing clinics',
        price: '$199/month',
        features: [
            'Up to 200 clients',
            'Advanced health tracking',
            'Priority support',
            'Advanced analytics',
            'Custom branding'
        ],
        ghlPaymentLink: 'https://pay.gohighlevel.com/premium-plan'
    },
    {
        id: 'enterprise_plan',
        name: 'Enterprise Plan',
        description: 'Complete solution for large clinics',
        price: '$399/month',
        features: [
            'Unlimited clients',
            'Full health tracking suite',
            '24/7 support',
            'Advanced analytics & AI',
            'Custom branding',
            'API access',
            'White-label options'
        ],
        ghlPaymentLink: 'https://pay.gohighlevel.com/enterprise-plan'
    }
];

/**
 * Add-ons Configuration
 * Additional features that can be added to any plan
 */
export const AddOns = [
    {
        id: 'additional_coaches',
        name: 'Additional Coaches',
        description: 'Add more coaches to your team',
        price: '$29/month per coach',
        features: [
            'Additional coach accounts',
            'Individual coach dashboards',
            'Coach performance tracking'
        ]
    },
    {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Enhanced reporting and insights',
        price: '$49/month',
        features: [
            'Advanced reporting',
            'Custom dashboards',
            'Data export capabilities',
            'Trend analysis'
        ]
    },
    {
        id: 'api_access',
        name: 'API Access',
        description: 'Integrate with your existing systems',
        price: '$79/month',
        features: [
            'REST API access',
            'Webhook support',
            'Custom integrations',
            'Developer documentation'
        ]
    }
];

/**
 * Helper function to find a plan by ID
 */
export function findPlanById(planId) {
    return SubscriptionPlan.find(plan => plan.id === planId);
}

/**
 * Helper function to get plan price as number
 */
export function getPlanPrice(planId) {
    const plan = findPlanById(planId);
    if (!plan) return 0;

    // Extract price from string like "$99/month"
    const priceMatch = plan.price.match(/\$(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : 0;
}

/**
 * Helper function to get GHL payment link for a plan
 */
export function getGHLPaymentLink(planId) {
    const plan = findPlanById(planId);
    return plan?.ghlPaymentLink || null;
} 