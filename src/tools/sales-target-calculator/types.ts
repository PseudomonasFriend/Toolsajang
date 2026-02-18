/** 매출 목표 계산기 입력 */
export interface SalesTargetInput {
  /** 월 고정비 (원) */
  fixedCost: number;
  /** 목표 순이익 (원) */
  targetProfit: number;
  /** 마진율 (%) — 매출 대비 순이익 비율 */
  marginRate: number;
}

/** 매출 목표 계산기 출력 */
export interface SalesTargetOutput {
  /** 필요 매출 (원) */
  requiredSales: number;
  /** 고정비 + 목표 순이익 합계 */
  breakEvenAmount: number;
}
