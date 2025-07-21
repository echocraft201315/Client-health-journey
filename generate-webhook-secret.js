const crypto = require('crypto');

// Generate a secure random webhook secret
const webhookSecret = crypto.randomBytes(32).toString('hex');
console.log('🔐 GHL Webhook Secret:');
console.log(webhookSecret);
console.log('\n📋 Add this to your .env file:');
console.log(`GHL_WEBHOOK_SECRET=${webhookSecret}`); 