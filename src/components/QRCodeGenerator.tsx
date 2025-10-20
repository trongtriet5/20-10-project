'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  url: string; // The original URL
}

export default function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  return (
    <div className="text-center">
      <QRCodeSVG
        value={url}
        size={100}
        bgColor="#ffffff"
        fgColor="#be185d"
        level="M"
        includeMargin={false}
        className="rounded-lg shadow-md mx-auto"
      />
    </div>
  );
}
