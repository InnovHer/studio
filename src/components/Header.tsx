'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from './ui/sidebar';


export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Analyze' },
    { href: '/batch', label: 'Batch' },
    { href: '/history', label: 'History' },
  ];

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Bot className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline-block text-lg font-bold">Sentimatic</span>
            </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
