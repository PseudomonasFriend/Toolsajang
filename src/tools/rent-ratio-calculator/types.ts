/** 임대료 비율 계산기 입력 */
export interface RentRatioInput {
  /** 월 매출 (원) */
  monthlySales: number;
  /** 월 임대료 (원) */
  monthlyRent: number;
}

/** 임대료 비율 계산기 출력 */
export interface RentRatioOutput {
  /** 임대료 비율 (%) */
  rentRatio: number;
  /** 적정 여부 안내 */
  status: 'low' | 'normal' | 'high';
}
