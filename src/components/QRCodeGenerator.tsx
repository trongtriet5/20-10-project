'use client';

import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  url: string;
}

export default function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  return (
    <div className="flex justify-center items-center p-2">
      <QRCode
        value={url}
        size={120}
        level="M"
        style={{ 
          height: "auto", 
          maxWidth: "100%", 
          width: "100%"
        }}
      />
    </div>
  );
}
