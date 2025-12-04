'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Bot, FileClock, Home, Layers, Moon, Sun, PieChart } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };
  
  const navItems = [
    { href: '/', label: 'Analyze', icon: <Home /> },
    { href: '/batch', label: 'Batch', icon: <Layers /> },
    { href: '/summary', label: 'Summary', icon: <PieChart /> },
    { href: '/history', label: 'History', icon: <FileClock /> },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Sentimatic</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                onClick={handleLinkClick}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center gap-1 rounded-full border bg-background p-1 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-0">
          <Button
            size="icon"
            variant={theme === 'light' ? 'secondary' : 'ghost'}
            className="rounded-full"
            onClick={() => setTheme('light')}
          >
            <Sun />
          </Button>
          <Button
            size="icon"
            variant={theme === 'dark' ? 'secondary' : 'ghost'}
            className="rounded-full"
            onClick={() => setTheme('dark')}
          >
            <Moon />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
