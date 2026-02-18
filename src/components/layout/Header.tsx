import Link from 'next/link';
import { Wrench } from 'lucide-react';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/tools', label: '툴' },
  { href: '/about', label: '소개' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-lg font-bold text-blue-600"
          aria-label="툴사장 홈으로 이동"
        >
          <Wrench className="h-5 w-5" />
          <span>툴사장</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden gap-6 md:flex" aria-label="메인 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
