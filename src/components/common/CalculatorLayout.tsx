import type { ReactNode } from 'react';
import AdBanner from '@/components/common/AdBanner';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

/** 모든 툴 페이지의 공통 레이아웃 래퍼 */
export default function CalculatorLayout({
  title,
  description,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-6">
      {/* 툴 제목 + 설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      {/* 툴 본체 UI */}
      {children}

      {/* 결과 하단 광고 슬롯 */}
      <AdBanner
        position="tool-result-bottom"
        type="adsense"
        className="mt-6"
      />

      {/* 페이지 하단 자사 배너 슬롯 */}
      <AdBanner
        position="tool-page-bottom"
        type="custom"
        className="mt-6"
      />
    </div>
  );
}
