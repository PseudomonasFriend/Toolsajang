/** 가게명 아이디어 툴 입력 (UI 상태) */
export interface ShopNameInput {
  /** 업종. 예: 카페, 치킨집, 네일샵 */
  businessType: string;
  /** 컨셉/분위기. 예: 감성, 프리미엄, 가족 친화 */
  concept: string;
  /** 키워드. 예: 꽃, 달, 제주, 숲 */
  keywords: string;
  /** 톤. 감성/심플/재치/프리미엄/친근 */
  tone: string;
  /** 추천 개수 5~15 */
  count: number;
}

/** API 응답 타입 */
export interface ShopNameOutput {
  suggestions: string[];
  provider?: string;
  error?: string;
}

/** 업종 예시 목록 */
export const BUSINESS_TYPES = [
  { value: '카페', label: '카페' },
  { value: '한식', label: '한식당' },
  { value: '치킨', label: '치킨' },
  { value: '베이커리', label: '베이커리' },
  { value: '네일샵', label: '네일샵' },
  { value: '헤어샵', label: '헤어샵' },
  { value: '피부관리', label: '피부관리' },
  { value: '꽃집', label: '꽃집' },
  { value: '편의점', label: '편의점' },
  { value: '기타', label: '기타' },
] as const;

/** 톤 목록 */
export const TONES = [
  { value: '', label: '선택 안 함' },
  { value: '감성', label: '감성' },
  { value: '심플', label: '심플' },
  { value: '재치', label: '재치' },
  { value: '프리미엄', label: '프리미엄' },
  { value: '친근', label: '친근' },
  { value: '모던', label: '모던' },
  { value: '레트로', label: '레트로' },
] as const;
