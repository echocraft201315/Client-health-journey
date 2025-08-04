import { signOut } from "next-auth/react";

/**
 * Handle API responses and check for subscription-related errors
 * @param {Response} response - The fetch response
 * @param {string} defaultErrorMessage - Default error message if none provided
 * @returns {Promise<Object>} The parsed response data
 */
export async function handleApiResponse(response, defaultErrorMessage = "Request failed") {
    try {
        const data = await response.json();

        // Check if the response indicates a subscription issue
        if (response.status === 403 && data.redirect === true) {
            console.log('Subscription issue detected, redirecting to login');
            signOut({
                callbackUrl: data.redirectUrl || '/login?error=subscription_inactive&message=Your subscription is inactive. Please contact your administrator.'
            });
            throw new Error('Subscription inactive - redirecting to login');
        }

        // Check for other subscription-related errors
        if (data.message && (
            data.message.includes('subscription') ||
            data.message.includes('Subscription') ||
            data.message.includes('inactive')
        )) {
            console.log('Subscription error detected:', data.message);
            signOut({
                callbackUrl: '/login?error=subscription_inactive&message=' + encodeURIComponent(data.message)
            });
            throw new Error('Subscription issue - redirecting to login');
        }

        return data;
    } catch (error) {
        if (error.message.includes('redirecting to login')) {
            throw error; // Re-throw redirect errors
        }

        // Handle network errors or other issues
        console.error('API response error:', error);
        throw new Error(defaultErrorMessage);
    }
}

/**
 * Enhanced fetch function that handles subscription errors
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {string} defaultErrorMessage - Default error message
 * @returns {Promise<Object>} The parsed response data
 */
export async function fetchWithSubscriptionCheck(url, options = {}, defaultErrorMessage = "Request failed") {
    try {
        const response = await fetch(url, options);
        return await handleApiResponse(response, defaultErrorMessage);
    } catch (error) {
        if (error.message.includes('redirecting to login')) {
            throw error; // Re-throw redirect errors
        }
        console.error('Fetch error:', error);
        throw new Error(defaultErrorMessage);
    }
} 