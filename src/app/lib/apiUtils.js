/**
 * Custom fetch wrapper to handle subscription inactive responses from middleware
 * 
 * This utility automatically handles 401 responses from the middleware that indicate
 * subscription inactive status. When such a response is detected, it redirects
 * the user to the login page with the appropriate error message.
 * 
 * Usage:
 * import { apiFetch } from '@/app/lib/apiUtils';
 * 
 * // Instead of: const response = await fetch('/api/some-endpoint');
 * // Use: const response = await apiFetch('/api/some-endpoint');
 * 
 * const data = await response.json();
 */

// Custom fetch wrapper to handle subscription inactive responses
export const apiFetch = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        // Handle 401 responses from middleware (subscription inactive)
        if (response.status === 401) {
            try {
                const data = await response.json();
                if (data.redirectTo) {
                    // Redirect to login with error message
                    window.location.href = data.redirectTo;
                    return { success: false, message: data.message };
                }
            } catch (error) {
                console.error('Error parsing 401 response:', error);
            }
        }

        return response;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};

// Helper function to check if response indicates subscription inactive
export const isSubscriptionInactive = (response) => {
    return response.status === 401;
}; 