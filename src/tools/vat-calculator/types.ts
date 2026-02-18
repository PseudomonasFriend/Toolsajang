/** 계산 방향 */
export type VatDirection = 'toTotal' | 'toSupply';

/** 부가세 계산기 입력 */
export interface VatInput {
  /** 계산 방향: 공급가액→합계 또는 합계→공급가액 */
  direction: VatDirection;
  /** 금액 (원) */
  amount: number;
}

/** 부가세 계산기 출력 */
export interface VatOutput {
  /** 공급가액 */
  supplyPrice: number;
  /** 부가세 */
  vatAmount: number;
  /** 합계 (공급가액 + 부가세) */
  totalPrice: number;
}
