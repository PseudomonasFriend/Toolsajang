import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsajang.com';

export const metadata: Metadata = {
  title: '이용약관',
  description: '툴사장 서비스 이용약관 안내 페이지입니다.',
  openGraph: {
    title: '이용약관 | 툴사장',
    description: '툴사장 서비스 이용약관 안내 페이지입니다.',
    url: `${BASE}/terms`,
    type: "website",
  },
  alternates: { canonical: `${BASE}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">이용약관</h1>

      <div className="space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제1조 (목적)
          </h2>
          <p>
            이 약관은 툴사장(이하 &ldquo;서비스&rdquo;)이 제공하는 웹 기반 비즈니스 도구
            서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제2조 (서비스 내용)
          </h2>
          <p>
            서비스는 마진 계산기 등 소상공인을 위한 무료 온라인 비즈니스 계산 도구를
            제공합니다. 별도의 회원가입 없이 누구나 이용할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제3조 (이용자의 의무)
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>서비스를 불법적인 목적으로 사용하지 않습니다.</li>
            <li>서비스의 정상적인 운영을 방해하지 않습니다.</li>
            <li>계산 결과는 참고용이며, 정확한 세무/회계 처리는 전문가와 상담하시기 바랍니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제4조 (면책 조항)
          </h2>
          <p>
            서비스에서 제공하는 계산 결과는 참고용이며, 이를 기반으로 한 의사결정에
            대해 서비스 제공자는 법적 책임을 지지 않습니다. 정확한 세무 및 회계
            처리는 반드시 전문가와 상담하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제5조 (서비스 변경 및 중단)
          </h2>
          <p>
            서비스 제공자는 운영상, 기술상의 이유로 서비스의 전부 또는 일부를
            변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제6조 (저작권)
          </h2>
          <p>
            서비스에 포함된 콘텐츠(텍스트, 이미지, 코드 등)의 저작권은
            서비스 제공자에게 있습니다. 무단 복제 및 배포를 금지합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제7조 (약관의 변경)
          </h2>
          <p>
            본 약관은 필요 시 변경될 수 있으며, 변경된 약관은
            서비스 내 공지를 통해 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            제8조 (문의)
          </h2>
          <p>
            이용약관 관련 문의사항은 아래 이메일로 연락해 주세요.
          </p>
          <p className="mt-1 font-medium text-blue-600">
            contact@toolsajang.com
          </p>
        </section>

        <p className="text-xs text-gray-400">시행일: 2026년 2월 17일</p>
      </div>
    </div>
  );
}
