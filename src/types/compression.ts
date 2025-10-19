// Types for compression utilities

export interface CompressionResult {
  compressed: string;
  originalLength: number;
  compressedLength: number;
  ratio: number;
}

export interface CompressionOptions {
  enablePreprocessing?: boolean;
  enableLZCompression?: boolean;
  enableDebugLogging?: boolean;
}

export interface DecompressionResult {
  decompressed: string;
  success: boolean;
  error?: string;
}
