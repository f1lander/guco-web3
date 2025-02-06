'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarNavItems = [
  {
    title: 'Credential Issuers',
    href: '/platform/issuers',
    icon: Shield,
  },
  {
    title: 'User Wallet',
    href: '/platform/wallet',
    icon: Wallet,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block lg:w-72">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            GUCO
          </Link>
        </div>
        <ScrollArea className="flex-1 py-6">
          <nav className="grid gap-2 px-4">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}