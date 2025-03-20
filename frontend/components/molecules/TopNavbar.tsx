'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Plus, Gamepad2, Layers } from 'lucide-react';
import { DEFAULT_NETWORK_NAME } from '@/lib/constants';
import Button from '../atoms/Button';
import { useTranslation } from '@/providers/language-provider';
import { CustomConnectButton } from '@/components/molecules/CustomConnectButton';

export function TopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  // const { isConnected } = useAccount();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardLinks = [
    {
      label: t('nav.explorer'),
      href: '/dashboard',
      color: 'purple',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: t('nav.createLevel'),
      color: 'orange',
      href: '/dashboard/create-level',
      icon: <Plus className="w-4 h-4" />,
    },
    {
      label: t('nav.myLevels'),
      color: 'blue',
      href: '/dashboard/my-levels',
      icon: <Gamepad2 className="w-4 h-4" />,
    },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 transition-all duration-100 ease-in-out bg-slate-900 backdrop-blur-sm shadow-lg
      `}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-90'}`}>
          <span className="text-xl font-bold text-guco-100">GÜCO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}

            >
              <Button color={link.color}>
                {link.icon}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">


        <div className={`transition-transform duration-100 ${scrolled ? 'scale-95' : 'scale-100'}`}>
          <CustomConnectButton />

        </div>
      </div>
    </header>
  );
}

export default TopNavbar;