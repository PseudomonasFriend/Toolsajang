/** 창업비용 항목 */
export interface StartupCostItem {
  /** 항목명 */
  label: string;
  /** 금액 */
  amount: number;
}

/** 창업비용 계산기 입력 */
export interface StartupCostInput {
  /** 보증금 */
  deposit: number;
  /** 권리금 */
  premiumFee: number;
  /** 인테리어 비용 */
  interiorCost: number;
  /** 설비/집기 비용 */
  equipmentCost: number;
  /** 초기 재고/식자재 */
  initialInventory: number;
  /** 간판/사인물 */
  signageCost: number;
  /** 사업자등록/인허가 비용 */
  licenseFee: number;
  /** 기타 비용 */
  miscCost: number;
  /** 예비비 비율 (%) */
  contingencyRate: number;
}

/** 창업비용 계산기 출력 */
export interface StartupCostResult {
  /** 항목별 내역 */
  items: StartupCostItem[];
  /** 소계 (예비비 제외) */
  subtotal: number;
  /** 예비비 */
  contingency: number;
  /** 총 창업비용 */
  totalCost: number;
  /** 상위 3개 항목 */
  topItems: StartupCostItem[];
}
