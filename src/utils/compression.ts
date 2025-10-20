// Main compression utilities for URL parameters

import { preprocessString, postprocessString } from './preprocessing';
import { lzCompress, lzDecompress } from './lz-compression';
import { encodeToUrlSafeBase64, decodeFromUrlSafeBase64, safeBase64Encode, safeBase64Decode } from './base64-utils';
import type { CompressionResult, CompressionOptions, DecompressionResult } from '../types/compression';

/**
 * Compress a string using advanced compression techniques
 * This reduces the size of the parameter significantly
 */
export function compressString(str: string, options: CompressionOptions = {}): CompressionResult {
  const {
    enablePreprocessing = true,
    enableLZCompression = true,
    enableDebugLogging = false
  } = options;

  // Kiểm tra input hợp lệ
  if (!str || typeof str !== 'string') {
    console.error('Invalid input: str must be a non-empty string');
    return {
      compressed: '',
      originalLength: 0,
      compressedLength: 0,
      ratio: 0
    };
  }

  const originalLength = str.length;
  
  try {
    let processed = str;
    
    // Step 1: Pre-process the string to optimize for compression
    if (enablePreprocessing) {
      processed = preprocessString(str);
      if (enableDebugLogging) {
        console.log('Preprocessed:', processed.substring(0, 100) + '...');
      }
    }
    
    // Step 2: Apply LZ compression
    if (enableLZCompression) {
      processed = lzCompress(processed);
      if (enableDebugLogging) {
        console.log('LZ compressed:', processed.substring(0, 100) + '...');
      }
    }
    
    // Step 3: Encode to URL-safe base64
    const compressed = encodeToUrlSafeBase64(processed);
    if (enableDebugLogging) {
      console.log('URL safe:', compressed.substring(0, 100) + '...');
    }
    
    const compressedLength = compressed.length;
    const ratio = Math.round((1 - compressedLength / originalLength) * 100);
    
    return {
      compressed,
      originalLength,
      compressedLength,
      ratio
    };
  } catch (error) {
    console.error('Compression failed:', error);
    // Fallback to simple base64 encoding
    const fallback = safeBase64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return {
      compressed: fallback,
      originalLength,
      compressedLength: fallback.length,
      ratio: Math.round((1 - fallback.length / originalLength) * 100)
    };
  }
}

/**
 * Decompress a string that was compressed using compressString
 */
export function decompressString(compressed: string, options: CompressionOptions = {}): DecompressionResult {
  const {
    enablePreprocessing = true,
    enableLZCompression = true,
    enableDebugLogging = false
  } = options;

  try {
    if (enableDebugLogging) {
      console.log('Decompressing:', compressed.substring(0, 50) + '...');
    }
    
    // Decode from URL-safe base64
    const decoded = decodeFromUrlSafeBase64(compressed);
    if (enableDebugLogging) {
      console.log('Base64 decoded, length:', decoded.length);
    }
    
    let processed = decoded;
    
    // Decompress LZ
    if (enableLZCompression) {
      processed = lzDecompress(decoded);
      if (enableDebugLogging) {
        console.log('LZ decompressed, length:', processed.length);
      }
    }
    
    // Post-process to restore original string
    if (enablePreprocessing) {
      processed = postprocessString(processed);
      if (enableDebugLogging) {
        console.log('Final result length:', processed.length);
      }
    }
    
    return {
      decompressed: processed,
      success: true
    };
  } catch (error) {
    console.error('Decompression failed:', error);
    
    // Fallback to simple base64 decoding
    try {
      const fallback = safeBase64Decode(compressed);
      return {
        decompressed: fallback,
        success: true
      };
    } catch (fallbackError) {
      console.error('Fallback decompression also failed:', fallbackError);
      return {
        decompressed: '',
        success: false,
        error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
      };
    }
  }
}

/**
 * Create a short URL by compressing the parameters
 */
export function createShortUrl(baseUrl: string, data: Record<string, unknown>, options: CompressionOptions = {}): string {
  try {
    const jsonString = JSON.stringify(data);
    const result = compressString(jsonString, options);
    return `${baseUrl}?c=${result.compressed}`;
  } catch (error) {
    console.error('Failed to create short URL:', error);
    // Fallback to original method
    const json = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return `${baseUrl}?d=${encodeURIComponent(base64)}`;
  }
}

/**
 * Parse a short URL and extract the original data
 */
export function parseShortUrl(url: string, options: CompressionOptions = {}): Record<string, unknown> | null {
  try {
    const urlObj = new URL(url);
    const compressed = urlObj.searchParams.get('c');
    
    if (compressed) {
      const result = decompressString(compressed, options);
      if (result.success) {
        return JSON.parse(result.decompressed);
      } else {
        console.error('Decompression failed:', result.error);
        return null;
      }
    }
    
    // Fallback to original method
    const d = urlObj.searchParams.get('d');
    if (d) {
      const json = decodeURIComponent(escape(atob(d)));
      return JSON.parse(json);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse short URL:', error);
    return null;
  }
}

/**
 * Get compression ratio (how much the string was compressed)
 */
export function getCompressionRatio(original: string, compressed: string): number {
  return Math.round((1 - compressed.length / original.length) * 100);
}