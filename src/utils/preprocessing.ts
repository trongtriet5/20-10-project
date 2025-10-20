// String preprocessing utilities for compression

export const PATTERN_REPLACEMENTS = {
  // JSON keys
  '"name"': 'n',
  '"message"': 'm',
  '"iconIndex"': 'i',
  '"font"': 'f',
  
  // Font names
  'Inter, Arial, sans-serif': '0',
  'Times New Roman': '1',
  'Georgia': '2',
  'Comic Sans MS': '3',
  'Courier New': '4',
  'Dancing Script': '5',
  'Pacifico': '6',
  'Great Vibes': '7',
  'Lobster': '8',
  'Playfair Display': '9'
} as const;

export const REVERSE_PATTERN_REPLACEMENTS = Object.fromEntries(
  Object.entries(PATTERN_REPLACEMENTS).map(([key, value]) => [value, key])
) as Record<string, string>;

/**
 * Pre-process string to optimize for compression
 */
export function preprocessString(str: string): string {
  // Kiểm tra input hợp lệ
  if (!str || typeof str !== 'string') {
    console.error('Invalid input: str must be a non-empty string');
    return '';
  }
  
  // Remove unnecessary whitespace and normalize
  let processed = str.replace(/\s+/g, ' ').trim();
  
  // Replace common patterns with shorter representations
  for (const [key, value] of Object.entries(PATTERN_REPLACEMENTS)) {
    processed = processed.replace(new RegExp(key, 'g'), value);
  }
  
  return processed;
}

/**
 * Post-process string to restore original format
 */
export function postprocessString(str: string): string {
  // Kiểm tra input hợp lệ
  if (!str || typeof str !== 'string') {
    console.error('Invalid input: str must be a non-empty string');
    return '';
  }
  
  let processed = str;
  
  // Restore common patterns
  for (const [key, value] of Object.entries(REVERSE_PATTERN_REPLACEMENTS)) {
    processed = processed.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
  }
  
  return processed;
}
