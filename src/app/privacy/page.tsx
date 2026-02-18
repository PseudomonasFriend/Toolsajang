import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '툴사장 개인정보처리방침 안내 페이지입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        개인정보처리방침
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p>
            툴사장(이하 &ldquo;서비스&rdquo;)은 별도의 회원가입 절차 없이 이용 가능하며,
            이용자의 개인정보를 직접 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            2. 자동 수집 정보
          </h2>
          <p>
            서비스 이용 과정에서 아래 정보가 자동으로 수집될 수 있습니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>방문 일시, 접속 IP, 브라우저 종류, 운영체제 정보</li>
            <li>방문 페이지, 서비스 이용 기록</li>
          </ul>
          <p className="mt-2">
            이 정보는 Google Analytics를 통해 서비스 개선 목적으로만 활용됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            3. 광고 관련
          </h2>
          <p>
            본 서비스는 Google AdSense를 통한 광고를 게재할 수 있으며, 이 과정에서
            쿠키가 사용될 수 있습니다. Google의 광고 쿠키 사용에 대한 자세한 내용은{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google 광고 정책
            </a>
            을 참고하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            4. 개인정보의 보관 및 파기
          </h2>
          <p>
            서비스는 이용자의 개인정보를 별도로 보관하지 않으며, 자동 수집된
            접속 기록은 관련 법령에 따라 일정 기간 보관 후 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900">
            5. 문의
          </h2>
          <p>
            개인정보 관련 문의사항은 아래 이메일로 연락해 주세요.
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
