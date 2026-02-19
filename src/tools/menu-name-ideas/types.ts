/** 메뉴명 추천 툴 입력 (UI 상태) */
export interface MenuNameInput {
  category: string;
  menuType: string;
  keywords: string;
  tone: string;
  count: number;
}

/** API 응답 타입 (lib/llm과 동기화) */
export interface MenuNameOutput {
  suggestions: string[];
  provider?: string;
  error?: string;
}

export const MENU_TYPES = [
  { value: '음료', label: '음료' },
  { value: '메인', label: '메인' },
  { value: '디저트', label: '디저트' },
  { value: '사이드', label: '사이드' },
  { value: '기타', label: '기타' },
] as const;

export const TONES = [
  { value: '', label: '선택 안 함' },
  { value: '감성', label: '감성' },
  { value: '심플', label: '심플' },
  { value: '재치', label: '재치' },
  { value: '프리미엄', label: '프리미엄' },
  { value: '친근', label: '친근' },
] as const;
