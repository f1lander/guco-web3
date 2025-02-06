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
  title: 'Create Web3 App',
  description: 'A template for creating web3 apps with Next.js, viem, and Tailwind CSS',
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
                  <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-lg text-foreground ">© 2025 GUCO Network. All rights reserved. </p>                   
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
