import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { AnimationProvider } from '@/components/animations';
import "./globals.css";

// Import the FontAwesome CSS
import '@fortawesome/fontawesome-svg-core/styles.css';

// Configure FontAwesome
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

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
      <body className={`${sora.className} bg-[#0a0f1a] text-[#f1f5f9]`}>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
