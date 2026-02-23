'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/tools', label: '툴', icon: Wrench },
  { href: '/tips', label: '장사 팁', icon: FileText },
  { href: '/about', label: '소개', icon: Info },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden"
      aria-label="모바일 메뉴"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 text-xs transition-all active:scale-90',
                isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-800'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive && "scale-110"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
