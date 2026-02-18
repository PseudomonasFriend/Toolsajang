import type { CustomAd } from '@/types';

/**
 * 자사 배너 데이터 — 푸터·홈 하단 등 크로스 프로모션용
 * 추가 시 id, imageUrl, linkUrl, altText, position(배열) 입력
 * position 예: 'home-bottom', 'footer-banner', 'tool-page-bottom'
 */
export const customAds: CustomAd[] = [
  // 예: { id: 'my-service', imageUrl: '/images/ads/banner.png', linkUrl: 'https://...', altText: '...', position: ['footer-banner', 'home-bottom'] }
];

/** 특정 위치에 맞는 커스텀 배너 조회 */
export function getCustomAdByPosition(position: string): CustomAd | undefined {
  return customAds.find((ad) => ad.position.includes(position));
}
