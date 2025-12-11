import Cookies from "js-cookie";

const USER_TYPE_KEY = "chat_user_type";

/**
 * Get the user type from URL or sessionStorage.
 * The URL parameter is checked first and stored in sessionStorage for subsequent navigations.
 */
const getUserType = (): string | null => {
  // Check URL query parameter first (passed from parent iframe)
  const urlParams = new URLSearchParams(window.location.search);
  const userTypeFromUrl = urlParams.get("userType");

  // If userType is in URL, store it in sessionStorage for this tab
  if (userTypeFromUrl) {
    sessionStorage.setItem(USER_TYPE_KEY, userTypeFromUrl);
    return userTypeFromUrl;
  }

  // Fall back to stored value (preserved during internal navigation)
  return sessionStorage.getItem(USER_TYPE_KEY);
};

/**
 * Get the authentication token for the current user.
 * Uses URL query parameter 'userType' to determine whether to use customer or model token.
 * The chat frontend is embedded in an iframe, so we pass userType from the parent.
 * This allows both customer and model to use the chat on the same browser.
 */
export const getAuthToken = (): string | undefined => {
  const userType = getUserType();

  // If userType is specified, use the corresponding token
  if (userType === "model") {
    const modelToken = Cookies.get("whoxa_model_auth_token");
    if (modelToken) {
      return modelToken;
    }
  }

  if (userType === "customer") {
    const customerToken = Cookies.get("whoxa_customer_auth_token");
    if (customerToken) {
      return customerToken;
    }
  }

  // Fallback: Check for customer token first, then model token
  const customerToken = Cookies.get("whoxa_customer_auth_token");
  if (customerToken) {
    return customerToken;
  }

  const modelToken = Cookies.get("whoxa_model_auth_token");
  if (modelToken) {
    return modelToken;
  }

  // Fallback to legacy token for backward compatibility
  return Cookies.get("whoxa_auth_token");
};

/**
 * Remove all auth tokens (used during logout)
 */
export const removeAuthTokens = (): void => {
  Cookies.remove("whoxa_customer_auth_token");
  Cookies.remove("whoxa_model_auth_token");
  Cookies.remove("whoxa_auth_token");
  sessionStorage.removeItem(USER_TYPE_KEY);
};

/**
 * Check if user is authenticated (has any valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
