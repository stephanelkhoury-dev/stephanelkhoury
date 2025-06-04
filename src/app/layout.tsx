import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { AnimationProvider } from '@/components/animations';
import "./globals.css";
import Script from 'next/script';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Stephan El Khoury – Portfolio & Ventures',
  description: 'Innovating at the intersection of code, creativity, and sound',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable}`}>
      <head>
        <Script
          src="https://kit.fontawesome.com/your-kit-code.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${sora.className} bg-[#0B001F] text-[#F5F5F5]`}>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
