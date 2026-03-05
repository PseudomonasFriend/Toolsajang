'use client';

import { useEffect, useRef } from 'react';

/** AdSense 슬롯 ID 매핑 — 콘솔에서 생성 후 채움 */
const AD_SLOTS: Record<string, string> = {
  'tool-result-bottom': '', // AdSense 콘솔에서 생성 후 입력
  'tool-page-bottom': '',
  'tip-list-between': '',
  'homepage-top': '',
  'home-mid': '',
  'home-bottom': '',
};

interface AdSenseUnitProps {
  position: string;
  adClient: string;
}

/** AdSense ins 태그 렌더링 + adsbygoogle.push() 호출 — 클라이언트 전용 */
export default function AdSenseUnit({ position, adClient }: AdSenseUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const slotId = AD_SLOTS[position] ?? '';

  useEffect(() => {
    // 이미 push했으면 중복 호출 방지
    if (pushed.current) return;
    pushed.current = true;

    try {
      (
        (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ??= []
      ).push({});
    } catch {
      // AdSense 스크립트 미로드 시 무시
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle block"
      data-ad-client={adClient}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
