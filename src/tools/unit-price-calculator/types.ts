/** 단가 비교 상품 항목 */
export interface UnitPriceItem {
  /** 상품 이름 (선택) */
  name: string;
  /** 총 금액 */
  totalPrice: number;
  /** 수량/용량 */
  quantity: number;
  /** 단위 */
  unit: string;
}

/** 단가 계산 결과 항목 */
export interface UnitPriceResult {
  /** 상품 이름 */
  name: string;
  /** 총 금액 */
  totalPrice: number;
  /** 수량 */
  quantity: number;
  /** 단위 */
  unit: string;
  /** 단가 */
  unitPrice: number;
  /** 가장 저렴한지 여부 */
  isCheapest: boolean;
  /** 최저가 대비 차이 (%) */
  diffFromCheapest: number;
}
