import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chúc Mừng 20/10 - Ngày Phụ Nữ Việt Nam",
  description: "Gửi lời chúc mừng ngày 20/10 đến những người phụ nữ một lời chúc thật ý nghĩa",
  keywords: "20/10, ngày phụ nữ việt nam, chúc mừng, lời chúc, phụ nữ",
  authors: [{ name: "Wish 20/10" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}