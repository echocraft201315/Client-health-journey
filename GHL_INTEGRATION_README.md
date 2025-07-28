# GoHighLevel Automation Webhook Integration

This document explains how to set up and use the GoHighLevel automation webhook integration for managing subscription workflows in your health journey app.

## Overview

The automation integration allows GoHighLevel to trigger automated workflows in your app when subscription events occur. Each trigger executes a series of actions in sequence, providing a comprehensive automation solution.

## Automation Workflow Architecture

The integration follows a **Trigger → Action** pattern:

1. **Trigger**: Subscription event from GoHighLevel (e.g., `subscription.activated`)
2. **Workflow**: Predefined sequence of actions to execute
3. **Actions**: Individual tasks to perform (database updates, emails, task creation, etc.)

## Setup Instructions

### 1. Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
GHL_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. GoHighLevel Webhook Configuration

In your GoHighLevel account:

1. Go to **Settings** > **Integrations** > **Webhooks**
2. Add a new webhook with the following details:
   - **URL**: `https://yourdomain.com/api/webhooks/ghl-subscription`
   - **Events**: Select the following subscription events:
     - `subscription.created`
     - `subscription.activated`
     - `subscription.cancelled`
     - `subscription.deactivated`
     - `subscription.renewed`
     - `subscription.payment_success`
     - `subscription.payment_failed`
     - `subscription.updated`
     - `subscription.paused`
     - `subscription.resumed`
3. **Secret**: Use the same secret you set in your environment variables
4. **Method**: POST

### 3. Automation Endpoints

#### Main Automation Endpoint
- **URL**: `/api/webhooks/ghl-subscription`
- **Method**: POST
- **Purpose**: Receives GoHighLevel events and executes automation workflows

#### Test Endpoint
- **URL**: `/api/webhooks/ghl-subscription/test`
- **Method**: GET/POST
- **Purpose**: Test automation workflows and view available triggers/actions

## Available Automation Workflows

### 1. Subscription Activation Workflow
**Trigger**: `subscription.activated`
**Actions**:
- Activate subscription in local database
- Send welcome email to clinic
- Create onboarding tasks for clinic

### 2. Subscription Cancellation Workflow
**Trigger**: `subscription.cancelled`
**Actions**:
- Deactivate subscription in local database
- Send cancellation email to clinic
- Create retention tasks

### 3. Payment Failure Workflow
**Trigger**: `subscription.payment_failed`
**Actions**:
- Log payment failure in database
- Send payment reminder email
- Create payment recovery tasks

### 4. Subscription Renewal Workflow
**Trigger**: `subscription.renewed`
**Actions**:
- Update subscription in local database
- Send renewal confirmation email
- Update billing records

## Workflow Execution Process

1. **Event Reception**: Webhook receives event from GoHighLevel
2. **Trigger Mapping**: Maps GHL event to automation trigger
3. **Clinic Identification**: Finds clinic based on event data
4. **Workflow Execution**: Executes predefined action sequence
5. **Database Updates**: Performs necessary database operations
6. **Result Logging**: Logs execution results and any errors

## Webhook Payload Structure

The webhook expects payloads in the following format:

```json
{
  "event": "subscription.activated",
  "data": {
    "subscription_id": "sub_123456789",
    "customer_id": "cust_123456789",
    "plan_id": "basic_plan",
    "amount": 99.99,
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-02-01T00:00:00Z",
    "customer_email": "clinic@example.com"
  }
}
```

## Database Schema

The automation uses the following database tables:

### SubscriptionTier
- `id`: UUID (Primary Key)
- `clinicId`: UUID (References Clinic)
- `planId`: String
- `subscriptionId`: String (GHL subscription ID)
- `startDate`: Date
- `endDate`: Date
- `isActive`: Boolean
- `subscriptionProvider`: String (default: 'ghl')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### SubscriptionHistory
- `id`: UUID (Primary Key)
- `clinicId`: UUID (References Clinic)
- `subscriptionId`: UUID (References SubscriptionTier)
- `paymentAmount`: Numeric
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Testing

### 1. Test Automation Workflows

Visit: `https://yourdomain.com/api/webhooks/ghl-subscription/test`

This endpoint shows all available automation workflows and their actions.

### 2. Test with Sample Payload

Send a POST request to the test endpoint with a sample payload:

```bash
curl -X POST https://yourdomain.com/api/webhooks/ghl-subscription/test \
  -H "Content-Type: application/json" \
  -d '{
    "event": "subscription.activated",
    "data": {
      "subscription_id": "test_sub_123",
      "customer_id": "test_cust_123",
      "plan_id": "basic_plan",
      "amount": 99.99,
      "customer_email": "test@example.com"
    }
  }'
```

### 3. Monitor Automation Logs

Check your application logs for automation workflow messages:

```bash
# Look for messages like:
# "Executing automation workflow: Subscription Activation Workflow"
# "Executing action: activate_subscription"
# "Action completed: send_welcome_email"
# "Automation workflow completed: Subscription Activation Workflow"
```

## Error Handling

The automation includes comprehensive error handling:

- **Invalid Signature**: Returns 401 if webhook signature verification fails
- **Clinic Not Found**: Returns 404 if clinic cannot be identified
- **Action Failures**: Individual actions can fail without stopping the workflow
- **Database Errors**: Logs error and continues processing other actions

## Security

### Webhook Signature Verification

The automation verifies signatures using HMAC-SHA256:

1. Extracts signature from headers (`x-ghl-signature`, `x-webhook-signature`, or `authorization`)
2. Creates expected signature using your webhook secret
3. Compares signatures using timing-safe comparison

### Environment Variables

- Store webhook secrets in environment variables
- Never commit secrets to version control
- Use different secrets for development and production

## Troubleshooting

### Common Issues

1. **Automation Not Triggering**
   - Check GoHighLevel webhook configuration
   - Verify webhook URL is accessible
   - Check application logs for trigger mapping errors

2. **Actions Not Executing**
   - Verify clinic exists in database
   - Check action implementation in automation utils
   - Review workflow configuration

3. **Signature Verification Failing**
   - Ensure webhook secret matches between GHL and your app
   - Check signature header format
   - Verify HMAC-SHA256 implementation

4. **Database Errors**
   - Check database connectivity
   - Verify table schemas
   - Check for constraint violations

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=ghl-automation
```

This will log detailed information about automation workflow execution.

## Support

For issues with the automation integration:

1. Check application logs for automation messages
2. Test workflows using the test endpoint
3. Verify GoHighLevel webhook configuration
4. Review this documentation for common solutions

## API Reference

### Automation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/ghl-subscription` | POST | Main automation endpoint |
| `/api/webhooks/ghl-subscription/test` | GET/POST | Test endpoint |

### Response Codes

| Code | Description |
|------|-------------|
| 200 | Automation workflow executed successfully |
| 401 | Invalid webhook signature |
| 404 | Clinic not found |
| 500 | Internal server error |

### Headers

| Header | Description |
|--------|-------------|
| `x-ghl-signature` | GoHighLevel webhook signature |
| `x-webhook-signature` | Alternative signature header |
| `authorization` | Alternative signature header |
| `content-type` | Should be `application/json` |

## Automation Workflow Configuration

The automation workflows are defined in `src/app/lib/ghl-automation-utils.js`. You can:

- Add new triggers
- Modify existing workflows
- Add new actions
- Customize action implementations

Each workflow follows the pattern:
```javascript
'trigger_name': {
    name: 'Workflow Name',
    description: 'Workflow description',
    actions: [
        {
            name: 'action_name',
            description: 'Action description',
            execute: 'functionName'
        }
    ]
}
``` 