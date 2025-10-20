'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import Image from 'next/image';
import QRCodeLib from 'qrcode';
interface QRCodeGeneratorProps {
  url: string; // The original URL
}

export default function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tạo QR code
  const generateQRCode = async (text: string) => {
    try {
      setIsGenerating(true);
      
      // Kiểm tra độ dài text trước khi tạo QR code
      if (text.length > 2953) {
        console.warn('Text too long for QR code, truncating...');
        text = text.substring(0, 2953);
      }
      
      const dataUrl = await QRCodeLib.toDataURL(text, {
        width: 250,
        margin: 1,
        color: {
          dark: '#be185d',
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
      // QR code sẽ chứa URL để mở trang xem thư
      await generateQRCode(url);
    };

    initializeQR();
  }, [url]);

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


  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-lg font-bold text-pink-600 mb-3">QR Code lời chúc</h3>

        {/* QR Code Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          {isGenerating ? (
            <div className="w-[250px] h-[250px] mx-auto bg-pink-50 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-pink-300 border-t-pink-500 rounded-full"
              />
            </div>
          ) : qrCodeDataUrl ? (
            <Image 
              src={qrCodeDataUrl} 
              alt="QR Code" 
              width={250}
              height={250}
              className="w-[250px] h-[250px] rounded-xl shadow-lg border-2 border-pink-100 mx-auto"
            />
          ) : null}
        </motion.div>

        {/* Copy Link Button */}
        <motion.button
          onClick={() => handleCopyLink(url)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center gap-2 mx-auto"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Đã copy!' : 'Copy link'}
        </motion.button>
      </motion.div>
    </div>
  );
}
