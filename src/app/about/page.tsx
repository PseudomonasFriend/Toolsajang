import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: '툴사장은 소상공인과 자영업자를 위한 무료 비즈니스 계산 도구 플랫폼입니다.',
  openGraph: {
    title: '서비스 소개 | 툴사장',
    description: '툴사장은 소상공인과 자영업자를 위한 무료 비즈니스 계산 도구 플랫폼입니다.',
    url: `${BASE}/about`,
    type: 'website',
  },
  alternates: { canonical: `${BASE}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">서비스 소개</h1>

      <div className="space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-2 text-lg font-bold text-gray-900">툴사장이란?</h2>
          <p>
            툴사장은 소상공인, 자영업자, 1인 사업자를 위한 무료 비즈니스 계산 도구
            플랫폼입니다. 복잡한 엑셀 없이도 마진, 부가세, 손익분기점 등을 간편하게
            계산할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-gray-900">왜 만들었나요?</h2>
          <p>
            매장을 운영하면서 &ldquo;이 상품 팔면 얼마 남지?&rdquo;라는 단순한 질문에도
            엑셀을 꺼내야 하는 불편함이 있었습니다. 숫자 몇 개만 넣으면 바로 답이
            나오는 도구가 있으면 좋겠다는 생각에서 시작했습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-gray-900">핵심 가치</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>회원가입 없이 바로 사용</li>
            <li>모바일에서 편리하게</li>
            <li>3초 안에 결과 확인</li>
            <li>완전 무료</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-gray-900">문의</h2>
          <p>
            서비스 관련 문의는 아래 이메일로 연락해 주세요.
          </p>
          <p className="mt-1 font-medium text-blue-600">
            contact@toolsajang.com
          </p>
        </section>
      </div>
    </div>
  );
}
