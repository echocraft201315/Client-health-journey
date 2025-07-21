import axios from 'axios';

// GHL API Configuration
const GHL_API_BASE_URL = process.env.GHL_API_BASE_URL || 'https://rest.gohighlevel.com/v1';
const GHL_API_KEY = process.env.GHL_API_KEY;

// GHL API client
const ghlClient = axios.create({
  baseURL: GHL_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// GHL Subscription Management
export const ghlApi = {
  // Create a new subscription in GHL
  async createSubscription(subscriptionData) {
    try {
      const response = await ghlClient.post('/subscriptions', {
        contactId: subscriptionData.contactId,
        productId: subscriptionData.productId,
        priceId: subscriptionData.priceId,
        billingCycle: subscriptionData.billingCycle || 'monthly',
        startDate: subscriptionData.startDate || new Date().toISOString(),
        customFields: {
          clinicId: subscriptionData.clinicId,
          planId: subscriptionData.planId,
          customerEmail: subscriptionData.customerEmail,
        },
      });
      return response.data;
    } catch (error) {
      console.error('GHL Create Subscription Error:', error.response?.data || error.message);
      throw new Error(`Failed to create GHL subscription: ${error.message}`);
    }
  },

  // Get subscription details from GHL
  async getSubscription(subscriptionId) {
    try {
      const response = await ghlClient.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('GHL Get Subscription Error:', error.response?.data || error.message);
      throw new Error(`Failed to get GHL subscription: ${error.message}`);
    }
  },

  // Update subscription in GHL
  async updateSubscription(subscriptionId, updateData) {
    try {
      const response = await ghlClient.put(`/subscriptions/${subscriptionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('GHL Update Subscription Error:', error.response?.data || error.message);
      throw new Error(`Failed to update GHL subscription: ${error.message}`);
    }
  },

  // Cancel subscription in GHL
  async cancelSubscription(subscriptionId, reason = 'User requested cancellation') {
    try {
      const response = await ghlClient.post(`/subscriptions/${subscriptionId}/cancel`, {
        reason,
        effectiveDate: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('GHL Cancel Subscription Error:', error.response?.data || error.message);
      throw new Error(`Failed to cancel GHL subscription: ${error.message}`);
    }
  },

  // Get contact by email
  async getContactByEmail(email) {
    try {
      const response = await ghlClient.get(`/contacts/lookup?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('GHL Get Contact Error:', error.response?.data || error.message);
      throw new Error(`Failed to get GHL contact: ${error.message}`);
    }
  },

  // Create contact in GHL
  async createContact(contactData) {
    try {
      const response = await ghlClient.post('/contacts', {
        email: contactData.email,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phone: contactData.phone,
        companyName: contactData.companyName,
        customFields: {
          clinicId: contactData.clinicId,
          role: contactData.role || 'clinic_admin',
        },
      });
      console.log('GHL Create Contact FULL Response:', response.data);
      // Try to extract the contact ID from different possible response structures
      let contactId = response.data.id;
      if (!contactId && response.data.contact && response.data.contact.id) {
        contactId = response.data.contact.id;
      }
      if (!contactId && response.data.data && response.data.data.id) {
        contactId = response.data.data.id;
      }
      if (!contactId) {
        throw new Error('Could not extract contact ID from GHL response');
      }
      return { id: contactId, raw: response.data };
    } catch (error) {
      console.error('GHL Create Contact Error:', error.response?.data || error.message);
      throw new Error(`Failed to create GHL contact: ${error.message}`);
    }
  },

  // Update contact in GHL
  async updateContact(contactId, updateData) {
    try {
      const response = await ghlClient.put(`/contacts/${contactId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('GHL Update Contact Error:', error.response?.data || error.message);
      throw new Error(`Failed to update GHL contact: ${error.message}`);
    }
  },

  // Get products from GHL
  async getProducts() {
    try {
      const response = await ghlClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('GHL Get Products Error:', error.response?.data || error.message);
      throw new Error(`Failed to get GHL products: ${error.message}`);
    }
  },

  // Verify webhook signature
  verifyWebhookSignature(payload, signature, secret) {
    // Implement webhook signature verification based on GHL documentation
    // This is a placeholder - you'll need to implement based on GHL's specific requirements
    try {
      // Add your webhook verification logic here
      return true;
    } catch (error) {
      console.error('GHL Webhook Verification Error:', error);
      return false;
    }
  },
};

// GHL Product/Plan Mapping
export const GHL_PRODUCT_MAPPING = {
  starter: {
    productId: process.env.GHL_STARTER_PRODUCT_ID,
    priceId: process.env.GHL_STARTER_PRICE_ID,
    name: 'Starter Plan',
    price: 297,
  },
  pro: {
    productId: process.env.GHL_PRO_PRODUCT_ID,
    priceId: process.env.GHL_PRO_PRICE_ID,
    name: 'Pro Plan',
    price: 697,
  },
};

// Helper function to get GHL product details by plan ID
export const getGHLProductByPlanId = (planId) => {
  return GHL_PRODUCT_MAPPING[planId] || null;
};

// Helper function to create subscription URL for GHL
export const createGHLSubscriptionUrl = (clinicId, planId, contactId) => {
  const product = getGHLProductByPlanId(planId);
  if (!product) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }

  // This would typically redirect to GHL's subscription creation flow
  // You might need to customize this based on your GHL setup
  return `${process.env.GHL_DASHBOARD_URL}/subscriptions/create?productId=${product.productId}&priceId=${product.priceId}&contactId=${contactId}&clinicId=${clinicId}`;
}; 