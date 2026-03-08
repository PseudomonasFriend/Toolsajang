import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import JsonLd from '@/components/common/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || '툴사장';
const SITE_DESC =
  '부가세 계산기, 마진 계산기, 손익분기점 계산기, 인건비 계산기까지 사장님이 자주 찾는 장사 계산기를 로그인 없이 바로 쓸 수 있는 무료 비즈니스 툴 모음입니다.';

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  inLanguage: 'ko-KR',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    template: '%s | 툴사장',
  },
  description: SITE_DESC,
  keywords: [
    '부가세 계산기',
    '마진 계산기',
    '손익분기점 계산기',
    '인건비 계산기',
    '매출 계산기',
    '자영업자 계산기',
    '소상공인 도구',
    '사장님 계산기',
    '무료 비즈니스 툴',
    '툴사장',
  ],
  metadataBase: new URL(SITE_URL),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? {
          'naver-site-verification':
            process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
        }
      : undefined,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE_NAME,
    title: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    description: SITE_DESC,
    url: SITE_URL,
    images: process.env.NEXT_PUBLIC_OG_IMAGE_URL
      ? [
          {
            url: process.env.NEXT_PUBLIC_OG_IMAGE_URL,
            width: 1200,
            height: 630,
            alt: SITE_NAME,
          },
        ]
      : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <JsonLd id="website-jsonld" data={webSiteJsonLd} />
        <JsonLd id="organization-jsonld" data={organizationJsonLd} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <Script
          id="adsense-script"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6162400610480124"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
