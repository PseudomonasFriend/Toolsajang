/** 소득 유형 */
export type IncomeType = 'business' | 'other' | 'daily-worker';

/** 원천세 계산기 입력 */
export interface TaxWithholdingInput {
  /** 지급액 (원, VAT 제외) */
  paymentAmount: number;
  /** 소득 유형 */
  incomeType: IncomeType;
  /** 필요경비율 (%) — 기타소득 필요경비 인정 (기본 60%) */
  expenseRate: number;
}

/** 소득 유형별 정보 */
export interface IncomeTypeInfo {
  id: IncomeType;
  name: string;
  description: string;
  taxRate: number;
  localTaxRate: number;
  withholdingRate: number; // 총 원천징수율
}

/** 원천세 계산기 출력 */
export interface TaxWithholdingOutput {
  /** 지급액 */
  paymentAmount: number;
  /** 소득 유형 */
  incomeType: IncomeType;
  /** 과세표준 (필요경비 차감 후) */
  taxableIncome: number;
  /** 필요경비 금액 */
  expenseAmount: number;
  /** 국세 (소득세/법인세) */
  incomeTax: number;
  /** 지방소득세 (국세의 10%) */
  localTax: number;
  /** 원천세 합계 */
  totalTax: number;
  /** 실지급액 (지급액 - 원천세 합계) */
  netPayment: number;
  /** 원천징수 세율 (%) */
  effectiveRate: number;
}
