// Simple base64 utilities for URL encoding/decoding

/**
 * Encode data to base64 for URL parameters
 */
export function encodeForUrl(data: Record<string, unknown>): string {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

/**
 * Decode base64 from URL parameters
 */
export function decodeFromUrl(base64: string): Record<string, unknown> | null {
  try {
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to decode base64 data:', error);
    return null;
  }
}
