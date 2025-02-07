import * as React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';
import { TopNavbar } from '@/components/molecules/TopNavbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';
import { DotBackground } from '@/components/backgrounds/patterns';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GÜCO | Aprende Programación con Robots',
  description: 'Aprende programación de forma divertida controlando robots en un mundo virtual. Una plataforma educativa basada en blockchain.',
  keywords: ['programación', 'educación', 'blockchain', 'robots', 'coding', 'learn to code', 'güco', 'guco'],
  authors: [{ name: 'GÜCO Team' }],
  openGraph: {
    title: 'GÜCO | Aprende Programación con Robots',
    description: 'Aprende programación de forma divertida controlando robots en un mundo virtual',
    url: 'https://guco.dev',
    siteName: 'GÜCO',
    images: [
      {
        url: '/og-image.png', // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'GÜCO - Plataforma de Aprendizaje',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GÜCO | Aprende Programación con Robots',
    description: 'Aprende programación de forma divertida controlando robots en un mundo virtual',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers cookie={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <div className="flex min-h-screen w-full flex-col bg-black font-mono">
              <DotBackground>
                <TopNavbar />
                <div className="flex flex-col gap-4 py-4">
                  <main className="main flex flex-col gap-4 px-2 pt-16 md:px-8">
                    {children}
                    <Toaster />
                  </main>
                  <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
                    <p className="text-lg text-gray-800 dark:text-gray-400">© 2025 GUCO Network. All rights reserved.</p>                   
                  </div>
                </div>
              </DotBackground>
            </div>
          </ThemeProvider>
        </Providers>
        
        <Toaster />
      </body>
    </html>
  );
}
