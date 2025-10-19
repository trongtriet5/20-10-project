// Base64 encoding/decoding utilities

/**
 * Encode string to URL-safe base64
 */
export function encodeToUrlSafeBase64(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode URL-safe base64 to string
 */
export function decodeFromUrlSafeBase64(encoded: string): string {
  // Restore base64 padding and URL-safe characters
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return atob(base64);
}

/**
 * Safe base64 encoding with error handling
 */
export function safeBase64Encode(str: string): string {
  try {
    return btoa(encodeURIComponent(str));
  } catch (error) {
    console.error('Base64 encoding failed:', error);
    return btoa(str);
  }
}

/**
 * Safe base64 decoding with error handling
 */
export function safeBase64Decode(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch (error) {
    console.error('Base64 decoding failed:', error);
    return atob(encoded);
  }
}
