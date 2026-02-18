/** 할인가 역산 입력 */
export interface DiscountPriceInput {
  /** 정가 (원) */
  originalPrice: number;
  /** 할인율 (%) */
  discountRate: number;
}

/** 할인가 역산 출력 */
export interface DiscountPriceOutput {
  /** 할인 금액 (원) */
  discountAmount: number;
  /** 할인가 (원) */
  discountedPrice: number;
}
