# GHL (GoHighLevel) Subscription Integration Setup

This guide explains how to implement subscription management outside your app using GoHighLevel (GHL).

## Overview

The implementation includes:
- GHL API integration for subscription management
- Webhook handlers to sync subscription status
- Database schema updates to support GHL subscriptions
- Setup utilities for new clinics
- Updated registration flow to use GHL subscriptions

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# GHL (GoHighLevel) Configuration
GHL_API_BASE_URL="https://rest.gohighlevel.com/v1"
GHL_API_KEY="your_ghl_api_key_here"
GHL_WEBHOOK_SECRET="your_ghl_webhook_secret_here"
GHL_DASHBOARD_URL="https://app.gohighlevel.com"

# GHL Product IDs (configure these in your GHL dashboard)
GHL_STARTER_PRODUCT_ID="your_starter_product_id"
GHL_STARTER_PRICE_ID="your_starter_price_id"
GHL_PRO_PRODUCT_ID="your_pro_product_id"
GHL_PRO_PRICE_ID="your_pro_price_id"

# Subscription Provider Toggle
# GHL is now the default subscription provider
USE_GHL_SUBSCRIPTIONS="true"
```

## GHL Setup Instructions

### 1. Create Products in GHL

1. Log into your GHL dashboard
2. Go to **Products** → **Create Product**
3. Create two products:
   - **Starter Plan** ($297/month)
   - **Pro Plan** ($697/month)
4. Note down the Product IDs and Price IDs

### 2. Configure Webhooks

1. In GHL dashboard, go to **Settings** → **Webhooks**
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/ghl`
3. Select these events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.renewed`
   - `payment.succeeded`
   - `payment.failed`
4. Note down the webhook secret

### 3. API Key Setup

1. In GHL dashboard, go to **Settings** → **API Keys**
2. Generate a new API key with appropriate permissions
3. Copy the API key to your environment variables

## Database Migration

Run the database migration to add GHL support:

```bash
# This will update the SubscriptionTier table with GHL fields
npm run seed
```

## API Endpoints

### GHL Subscription Management
- `POST /api/ghl/subscription` - Create/update/cancel GHL subscriptions
- `GET /api/ghl/subscription` - Get subscription status

### Setup Utilities
- `POST /api/migrate-to-ghl` - Setup GHL subscriptions for clinics
- `GET /api/migrate-to-ghl` - Check setup status for all clinics

### Webhook Handler
- `POST /api/webhooks/ghl` - Handle GHL webhook events

## Usage Examples

### Creating a New GHL Subscription

```javascript
const response = await fetch('/api/ghl/subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    planId: 'starter',
    action: 'create'
  })
});

const data = await response.json();
if (data.success) {
  // Redirect user to GHL subscription URL
  window.location.href = data.subscriptionUrl;
}
```

### Setting Up GHL Subscriptions

```javascript
// Setup GHL for a specific clinic
const response = await fetch('/api/migrate-to-ghl', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clinicId: 'clinic-uuid',
    action: 'migrate'
  })
});

// Bulk setup GHL for all clinics
const response = await fetch('/api/migrate-to-ghl', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'bulk-migrate'
  })
});
```

## File Structure

```
src/app/
├── lib/api/
│   └── ghl.js                    # GHL API integration
├── api/
│   ├── ghl/
│   │   └── subscription/
│   │       └── route.js          # GHL subscription management
│   ├── webhooks/
│   │   └── ghl/
│   │       └── route.js          # GHL webhook handler
│   └── migrate-to-ghl/
│       └── route.js              # Migration utilities
└── lib/db/
    └── subscriptionRepo.js       # Updated with GHL support
```

## Setup Process

1. **Configure GHL Integration**: Set up environment variables
2. **Setup Existing Clinics**: Use the setup API for clinics without subscriptions
3. **New Registration Flow**: All new clinics automatically use GHL
4. **Monitor Webhooks**: Ensure subscription status syncs correctly

## Testing

1. **Test Webhook Handler**: Use GHL's webhook testing feature
2. **Test Subscription Creation**: Create test subscriptions in GHL
3. **Test Setup**: Setup test clinics with GHL subscriptions
4. **Verify Status Sync**: Check that subscription status updates correctly

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check GHL webhook configuration

2. **API Key Errors**
   - Verify API key has correct permissions
   - Check API key is not expired
   - Ensure correct API base URL

3. **Subscription Not Syncing**
   - Check webhook signature verification
   - Verify custom fields are set correctly
   - Check database connection

### Debug Logs

Enable debug logging by checking console output for:
- GHL API request/response logs
- Webhook event processing logs
- Database operation logs

## Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **API Key Security**: Store API keys securely in environment variables
3. **Database Security**: Use parameterized queries to prevent SQL injection
4. **Access Control**: Restrict migration endpoints to admin users only

## Support

For issues with:
- **GHL API**: Check GHL documentation and support
- **Integration**: Review webhook logs and API responses
- **Database**: Check migration logs and database schema 