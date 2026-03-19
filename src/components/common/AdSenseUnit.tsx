'use client';

import { useEffect, useRef } from 'react';

/**
 * AdSense 슬롯 ID 매핑
 * 각 슬롯 ID는 AdSense 콘솔(광고 > 광고 단위)에서 생성 후 입력
 *
 * 슬롯 위치별 용도:
 * - tool-result-bottom : 계산기 결과 하단 (전환율 높은 위치)
 * - home-mid           : 홈페이지 툴 그리드 아래 (노출량 많음)
 * - tips-bottom        : 팁 본문 하단 (체류 시간 길어 CTR 유리)
 * - tip-list-1~3       : 팁 목록 카드 사이 삽입 (스크롤 중 노출)
 * - tip-content-mid    : 팁 본문 중간 삽입 (가장 높은 가시성)
 */
const AD_SLOTS: Record<string, string> = {
  'tool-result-bottom': '7252997263', // 계산기 결과 하단
  'home-mid': '4626833920',           // 홈페이지 중단
  'tips-bottom': '1337758354',        // 팁 본문 하단
  'tip-list-1': '2046403043',         // 팁 목록 3번째 카드 뒤
  'tip-list-2': '1617527205',         // 팁 목록 6번째 카드 뒤
  'tip-list-3': '1425955517',         // 팁 목록 9번째 카드 뒤
  'tip-content-mid': '2834672852',    // 팁 본문 중간
};

interface AdSenseUnitProps {
  position: string;
  adClient: string;
}

/** AdSense ins 태그 렌더링 + adsbygoogle.push() 호출 — 클라이언트 전용 */
export default function AdSenseUnit({ position, adClient }: AdSenseUnitProps) {
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
      className="adsbygoogle block"
      data-ad-client={adClient}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
