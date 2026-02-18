/** 배달앱 수수료 계산기 입력 */
export interface DeliveryFeeInput {
  /** 메뉴 판매가 (원) */
  menuPrice: number;
  /** 메뉴 원가 (원) */
  menuCost: number;
  /** 배달비 - 고객 부담 (원) */
  deliveryFee: number;
  /** 추가 비용 - 포장비 등 (원) */
  additionalCost: number;
}

/** 플랫폼별 계산 결과 */
export interface PlatformResult {
  /** 플랫폼 식별자 */
  platformId: string;
  /** 플랫폼 이름 */
  platformName: string;
  /** 수수료율 (%) */
  commissionRate: number;
  /** 수수료 금액 (원) */
  commissionAmount: number;
  /** 실수령액 (원) */
  netRevenue: number;
  /** 순이익 (원) */
  netProfit: number;
  /** 순이익률 (%) */
  profitRate: number;
}

/** 플랫폼 프리셋 정보 */
export interface PlatformPreset {
  id: string;
  name: string;
  commissionRate: number;
  description: string;
}
