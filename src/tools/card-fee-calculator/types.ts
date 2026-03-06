/** 사업자 유형 */
export type BusinessType = 'general' | 'simplified' | 'exempt';

/** 업종 */
export type IndustryType = 'general' | 'restaurant' | 'convenience';

/** 카드수수료 계산기 입력 */
export interface CardFeeInput {
  /** 월 카드매출 */
  monthlySales: number;
  /** 업종 */
  industry: IndustryType;
  /** 사업자 유형 */
  businessType: BusinessType;
}

/** 카드사별 수수료 정보 */
export interface CardCompanyFee {
  /** 카드사 이름 */
  name: string;
  /** 수수료율 (%) */
  feeRate: number;
  /** 월 수수료 금액 */
  feeAmount: number;
}

/** 카드수수료 계산기 출력 */
export interface CardFeeResult {
  /** 카드사별 수수료 내역 */
  cardFees: CardCompanyFee[];
  /** 평균 수수료율 (%) */
  averageFeeRate: number;
  /** 월 수수료 합계 */
  totalFee: number;
  /** 실수령액 */
  netAmount: number;
  /** 우대수수료 적용 여부 */
  isPreferentialRate: boolean;
  /** 안내 메시지 */
  message: string;
}
