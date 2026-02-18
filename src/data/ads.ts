import type { CustomAd } from '@/types';

/** 자사 배너 데이터 — 커스텀 배너 추가 시 이 배열에 객체 추가 */
export const customAds: CustomAd[] = [
  // 아직 등록된 배너 없음
];

/** 특정 위치에 맞는 커스텀 배너 조회 */
export function getCustomAdByPosition(position: string): CustomAd | undefined {
  return customAds.find((ad) => ad.position.includes(position));
}
