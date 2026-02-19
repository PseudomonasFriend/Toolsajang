import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import JsonLd from '@/components/common/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || '툴사장';

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: '소상공인·자영업자를 위한 무료 비즈니스 계산 도구',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
};

const SITE_DESC =
  '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 무료 비즈니스 도구를 제공합니다. 로그인 없이 바로 사용하세요.';

export const metadata: Metadata = {
  title: {
    default: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    template: '%s | 툴사장',
  },
  description: SITE_DESC,
  keywords: [
    '마진 계산기',
    '부가세 계산기',
    '손익분기점',
    '소상공인 계산기',
    '자영업자 도구',
    '무료 비즈니스 툴',
    '툴사장',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '툴사장',
    title: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    description: SITE_DESC,
    url: SITE_URL,
    images: process.env.NEXT_PUBLIC_OG_IMAGE_URL
      ? [{ url: process.env.NEXT_PUBLIC_OG_IMAGE_URL, width: 1200, height: 630, alt: '툴사장' }]
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
    <html lang="ko">
      <head>
        {/* 검색엔진 사이트 소유 확인 — 등록 시 발급값을 환경 변수로 설정 */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        {process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION && (
          <meta
            name="naver-site-verification"
            content={process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION}
          />
        )}
        <JsonLd data={webSiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
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
