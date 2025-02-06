'use client';
import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import { DEFAULT_NETWORK_NAME } from '@/lib/constants';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import Link from 'next/link';

export function TopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  // const { isConnected } = useAccount();
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between gap-4 px-4 md:px-6 transition-all duration-100 ease-in-out
        ${scrolled ? 'bg-guco-900 shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-90'}`}>
        <span className="text-xl font-bold text-guco-100">gUCO</span>
      </div>

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div
          className={`inline-flex items-center rounded-full border border-solid px-2 py-1 text-sm transition-colors duration-100
            ${scrolled
              ? 'border-guco-100 text-guco-100 bg-guco-800/50'
              : 'border-guco-500 text-guco-500'}
          `}
        >
          {DEFAULT_NETWORK_NAME}
        </div>

        <div className={`transition-transform duration-100 ${scrolled ? 'scale-95' : 'scale-100'}`}>
          <ConnectButton chainStatus={'none'} />
          {/* {
            isConnected && (
              <div className="flex items-center gap-2">
                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                <p className="text-sm text-guco-100">Profile</p>
                <Button
              </div>
            )
          } */}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;