import * as React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';
import { TopNavbar } from '@/components/molecules/TopNavbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';
import { DotBackground } from '@/components/backgrounds/patterns';
import { LanguageProvider } from '@/providers/language-provider';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers cookie={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <LanguageProvider>
              <div className="flex min-h-screen w-full flex-col bg-black font-mono">
                <DotBackground>

                  <div className="flex flex-col">
                    <TopNavbar />
                    {children}
                    <Toaster />

                    {/* <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
                      <p className="text-lg text-gray-800 dark:text-gray-400">© 2025 GUCO Network. All rights reserved.</p>                   
                    </div> */}
                  </div>
                </DotBackground>
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
