'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, QrCode, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import QRCodeLib from 'qrcode';
import { compressString } from '@/utils/compression';
import type { WishData } from '@/types/app';

interface QRCodeGeneratorProps {
  url: string; // This is already the compressed URL
  data?: WishData; // Original data for compression ratio calculation
}

export default function QRCodeGenerator({ url, data }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate compression ratio if data is provided
  const calculateCompressionRatio = useCallback(() => {
    if (data) {
      try {
        // Create original JSON string for comparison
        const originalJson = JSON.stringify(data);
        const result = compressString(originalJson, { enableDebugLogging: false });
        setCompressionRatio(result.ratio);
      } catch (error) {
        console.error('Error calculating compression ratio:', error);
      }
    }
  }, [data]);

  // Tạo QR code
  const generateQRCode = async (text: string) => {
    try {
      setIsGenerating(true);
      const dataUrl = await QRCodeLib.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#be185d', // Pink color
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Tạo QR code khi component mount
  useEffect(() => {
    const initializeQR = async () => {
      // Calculate compression ratio
      calculateCompressionRatio();
      
      // Generate QR code with the provided URL
      await generateQRCode(url);
    };

    initializeQR();
  }, [url, data, calculateCompressionRatio]);

  // Copy link to clipboard
  const handleCopyLink = async (linkToCopy: string) => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Download QR code
  const handleDownloadQR = () => {
    if (qrCodeDataUrl && canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qr-code-loi-chuc-20-10.png';
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <QrCode className="w-12 h-12 text-pink-500 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-pink-600 mb-2">Chia sẻ lời chúc</h3>
          <p className="text-pink-500 text-sm">Quét QR code hoặc copy link để gửi cho người thân</p>
          {compressionRatio > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              ✨ Đã nén {compressionRatio}% kích thước
            </motion.div>
          )}
        </motion.div>

        {/* QR Code Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          {isGenerating ? (
            <div className="w-[300px] h-[300px] mx-auto bg-pink-50 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-pink-300 border-t-pink-500 rounded-full"
              />
            </div>
          ) : qrCodeDataUrl ? (
            <div className="relative inline-block">
              <Image 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                width={300}
                height={300}
                className="w-[300px] h-[300px] rounded-xl shadow-lg border-4 border-pink-100"
              />
              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          ) : null}
        </motion.div>

        {/* Link Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {/* Compressed URL */}
          <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
            <p className="text-sm text-pink-600 mb-2 font-medium">Link chia sẻ (đã nén):</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 bg-white rounded-lg border border-pink-200 text-sm text-pink-700 font-mono"
              />
              <motion.button
                onClick={() => handleCopyLink(url)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
            {compressionRatio > 0 && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                ✨ Link đã được nén {compressionRatio}% so với phiên bản gốc
              </p>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 mt-6"
        >
          <motion.button
            onClick={handleDownloadQR}
            disabled={!qrCodeDataUrl}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Tải QR code
          </motion.button>
          
          <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-white text-pink-600 border-2 border-pink-200 px-4 py-3 rounded-xl font-medium hover:bg-pink-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            In QR code
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
