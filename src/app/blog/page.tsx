import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '사장님 꿀팁',
  description: '소상공인과 자영업자를 위한 경영, 세금, 마케팅 꿀팁 콘텐츠 모음입니다.',
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">사장님 꿀팁</h1>
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          알찬 콘텐츠를 준비하고 있습니다.
          <br />
          조금만 기다려 주세요!
        </p>
      </div>
    </div>
  );
}
