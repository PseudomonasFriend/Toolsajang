/** API 요청 body (툴 UI → API) */
export interface MenuNameRequest {
  /** 업종. 예: 카페, 한식, 베이커리 */
  category: string;
  /** 메뉴 종류. 음료, 메인, 디저트, 사이드, 기타 */
  menuType: string;
  /** 키워드. 예: 달달한, 건강한 (선택) */
  keywords?: string;
  /** 톤. 감성, 심플, 재치, 프리미엄, 친근 등 (선택) */
  tone?: string;
  /** 추천 개수 5~15 */
  count: number;
}

/** API 응답 (API → UI) */
export interface MenuNameResponse {
  suggestions: string[];
  provider?: string;
  error?: string;
}

/** 가게명 아이디어 API 요청 body */
export interface ShopNameRequest {
  /** 업종. 예: 카페, 치킨집, 네일샵 */
  businessType: string;
  /** 컨셉/분위기. 예: 감성적인, 가족 친화적인 (선택) */
  concept?: string;
  /** 키워드. 예: 꽃, 달, 제주 (선택) */
  keywords?: string;
  /** 톤. 감성, 심플, 재치, 프리미엄, 친근 등 (선택) */
  tone?: string;
  /** 추천 개수 5~15 */
  count: number;
}

/** 가게명 아이디어 API 응답 */
export interface ShopNameResponse {
  suggestions: string[];
  provider?: string;
  error?: string;
}

/** 사용된 LLM 프로바이더 식별 */
export type ProviderId = 'gemini' | 'groq' | 'openrouter';

/** 프로바이더별 호출 옵션 */
export interface SuggestOptions {
  maxTokens?: number;
  timeoutMs?: number;
}
