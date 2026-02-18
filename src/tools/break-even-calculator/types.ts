/** 손익분기점 계산기 입력 */
export interface BreakEvenInput {
  /** 상품 판매가 (원) */
  sellingPrice: number;
  /** 상품당 변동비 (원) */
  variableCost: number;
  /** 월 고정비 (원) */
  fixedCost: number;
}

/** 손익분기점 계산기 출력 */
export interface BreakEvenOutput {
  /** 개당 공헌이익 (원) */
  contributionMargin: number;
  /** 공헌이익률 (%) */
  contributionRate: number;
  /** BEP 수량 (개) */
  breakEvenQuantity: number;
  /** BEP 매출액 (원) */
  breakEvenRevenue: number;
}
