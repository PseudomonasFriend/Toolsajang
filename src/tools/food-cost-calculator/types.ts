/** 원가율 계산기 입력 */
export interface FoodCostInput {
  /** 메뉴 이름 */
  menuName: string;
  /** 식재료 원가 합계 */
  ingredientCost: number;
  /** 현재 판매가 */
  sellingPrice: number;
  /** 목표 원가율 (%) */
  targetCostRate: number;
}

/** 원가율 계산 결과 */
export interface FoodCostResult {
  /** 현재 원가율 (%) */
  currentCostRate: number;
  /** 원가 이익 (판매가 - 원가) */
  grossProfit: number;
  /** 총 이익률 (%) */
  grossProfitRate: number;
  /** 목표 원가율 기준 권장 판매가 */
  recommendedPrice: number;
  /** 진단 메시지 */
  diagnosis: string;
  /** 진단 등급 */
  diagnosisLevel: 'good' | 'warning' | 'danger';
}
