import type { Metadata } from 'next';
import { getActiveTools } from '@/data/tools';
import ToolsListWithFilter from '@/components/tools/ToolsListWithFilter';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export const metadata: Metadata = {
  title: '전체 툴 목록',
  description:
    '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 모든 무료 비즈니스 도구 목록입니다.',
  openGraph: {
    title: '전체 툴 목록 | 툴사장',
    description: '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 모든 무료 비즈니스 도구 목록입니다.',
    url: `${BASE}/tools`,
    type: 'website',
  },
  alternates: { canonical: `${BASE}/tools` },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">전체 툴</h1>
      <ToolsListWithFilter tools={getActiveTools()} />
    </div>
  );
}
