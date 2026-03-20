/** 적정 임대료 계산기 입력 */
export interface OptimalRentInput {
  /** 월 매출 (원) */
  monthlySales: number;
  /** 원가율 (%) — 식재료·상품 원가 / 매출 */
  costRate: number;
  /** 인건비 (월, 원) */
  laborCost: number;
  /** 기타 고정비 (월, 원) — 공과금·통신비·보험료 등 임대료 제외 */
  otherFixedCost: number;
  /** 현재 임대료 (원, 선택) — 입력 시 비교 표시 */
  currentRent: number;
}

/** 업종별 권장 임대료 비율 */
export interface IndustryBenchmark {
  name: string;
  minRate: number;
  maxRate: number;
}

/** 적정 임대료 계산기 출력 */
export interface OptimalRentOutput {
  /** 매출총이익 (원) = 매출 - 원가 */
  grossProfit: number;
  /** 원가 금액 */
  costAmount: number;
  /** 인건비 + 기타고정비 합계 */
  totalOtherCost: number;
  /** 임대료 제외 영업비용 */
  operatingCostExcludeRent: number;
  /** 최대 임대료 (수익 0 기준) */
  maxAffordableRent: number;
  /** 안정적 임대료 (매출의 10% 기준) */
  stableRent: number;
  /** 권장 임대료 (매출의 9%) */
  recommendedRent: number;
  /** 현재 임대료 여유금 (currentRent 입력 시) */
  rentMargin: number | null;
  /** 현재 임대료 적정 여부 */
  rentStatus: 'safe' | 'caution' | 'danger' | null;
  /** 임대료 지불 후 예상 영업이익 (currentRent 입력 시) */
  operatingProfitWithCurrentRent: number | null;
  /** 손익분기 매출 (currentRent 입력 시) */
  breakEvenSales: number | null;
}
