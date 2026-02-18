import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: {
    default: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    template: '%s | 툴사장',
  },
  description:
    '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 무료 비즈니스 도구를 제공합니다. 로그인 없이 바로 사용하세요.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '툴사장',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* AdSense 스크립트 — 승인 후 NEXT_PUBLIC_ADSENSE_ID 설정 */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
