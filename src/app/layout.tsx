import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { AnimationProvider } from '@/components/animations';
import SiteAura from '@/components/premium/SiteAura';
import LiveChatWidget from '@/components/dynamic/LiveChatWidget';
import ThemeProvider from '@/components/ThemeProvider';
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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${sora.variable} ${sora.className} bg-background text-foreground`}>
        <ThemeProvider>
          <AnimationProvider>
            <SiteAura />
            {children}
            <LiveChatWidget />
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

