/* 공통 타입 정의 */

/** 툴 카테고리 */
export type ToolCategory = '재무/회계' | '매장운영' | '마케팅' | '유틸리티';

/** 툴 메타 정보 */
export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  isNew?: boolean;
  isActive: boolean;
}

/** 광고 슬롯 타입 */
export type AdSlotType = 'adsense' | 'custom';

/** 광고 슬롯 */
export interface AdSlot {
  type: AdSlotType;
  position: string;
  adClient?: string;
  adSlot?: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
}

/** 커스텀 배너 데이터 */
export interface CustomAd {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  position: string[];
}

/** 블로그 포스트 메타 */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  author: string;
  published: boolean;
  relatedTools?: string[];
}

/* 툴별 전용 타입은 각 툴 폴더의 types.ts에 정의 */
