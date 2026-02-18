/** 할인율 계산기 입력 */
export interface DiscountInput {
  /** 정상 판매가 (원) */
  originalPrice: number;
  /** 매입 원가 (원) */
  costPrice: number;
  /** 할인율 (%) */
  discountRate: number;
}

/** 할인율 계산기 출력 */
export interface DiscountOutput {
  /** 할인 금액 */
  discountAmount: number;
  /** 할인 판매가 */
  discountedPrice: number;
  /** 원래 마진 */
  originalMargin: number;
  /** 원래 마진율 (%) */
  originalMarginRate: number;
  /** 할인 후 마진 */
  discountedMargin: number;
  /** 할인 후 마진율 (%) */
  discountedMarginRate: number;
  /** 마진 감소액 */
  marginDrop: number;
  /** 마진 감소율 (%) */
  marginDropRate: number;
  /** 동일 이익 필요 판매량 증가율 (%) */
  requiredSalesIncrease: number;
}
