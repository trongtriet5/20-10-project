// LZ compression algorithm implementation

/**
 * Simple LZ compression algorithm
 * This is a basic implementation for compressing repetitive data
 */
export function lzCompress(str: string): string {
  const dict: { [key: string]: number } = {};
  const result: string[] = [];
  let current = '';
  let dictSize = 256;
  
  // Initialize dictionary with single characters
  for (let i = 0; i < 256; i++) {
    dict[String.fromCharCode(i)] = i;
  }
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const next = current + char;
    
    if (dict[next] !== undefined) {
      current = next;
    } else {
      result.push(dict[current].toString(36)); // Use base36 for shorter output
      dict[next] = dictSize++;
      current = char;
    }
  }
  
  if (current) {
    result.push(dict[current].toString(36));
  }
  
  return result.join(',');
}

/**
 * Simple LZ decompression algorithm
 */
export function lzDecompress(compressed: string): string {
  const dict: { [key: number]: string } = {};
  const codes = compressed.split(',');
  let result = '';
  let dictSize = 256;
  
  // Initialize dictionary with single characters
  for (let i = 0; i < 256; i++) {
    dict[i] = String.fromCharCode(i);
  }
  
  let current = dict[parseInt(codes[0], 36)];
  result = current;
  
  for (let i = 1; i < codes.length; i++) {
    const code = parseInt(codes[i], 36);
    let entry: string;
    
    if (dict[code]) {
      entry = dict[code];
    } else if (code === dictSize) {
      entry = current + current[0];
    } else {
      throw new Error('Invalid compressed data');
    }
    
    result += entry;
    dict[dictSize++] = current + entry[0];
    current = entry;
  }
  
  return result;
}
