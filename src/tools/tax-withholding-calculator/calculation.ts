import type { IncomeType, IncomeTypeInfo, TaxWithholdingInput, TaxWithholdingOutput } from './types';

/** 소득 유형별 세율 정의 */
export const INCOME_TYPE_INFO: IncomeTypeInfo[] = [
  {
    id: 'business',
    name: '사업소득 (프리랜서)',
    description: '용역·강의·원고 등 사업자 지급',
    taxRate: 3.0,
    localTaxRate: 0.3,
    withholdingRate: 3.3,
  },
  {
    id: 'other',
    name: '기타소득',
    description: '일시적 강연·원고료·상금 등',
    taxRate: 20.0,
    localTaxRate: 2.0,
    withholdingRate: 8.8,
  },
  {
    id: 'daily-worker',
    name: '일용근로소득',
    description: '일당 아르바이트·일용직 근로자',
    taxRate: 6.0,
    localTaxRate: 0.6,
    withholdingRate: 0,
  },
];

/** 소득 유형 정보 조회 */
export function getIncomeTypeInfo(id: IncomeType): IncomeTypeInfo {
  return INCOME_TYPE_INFO.find((info) => info.id === id) ?? INCOME_TYPE_INFO[0];
}

/** 원천세 계산 */
export function calculateTaxWithholding(input: TaxWithholdingInput): TaxWithholdingOutput {
  const { paymentAmount, incomeType, expenseRate } = input;

  let taxableIncome = 0;
  let expenseAmount = 0;
  let incomeTax = 0;
  let localTax = 0;

  if (incomeType === 'business') {
    // 사업소득: 과세표준 = 지급액, 세율 3%
    taxableIncome = paymentAmount;
    expenseAmount = 0;
    incomeTax = Math.round(paymentAmount * 0.03);
    localTax = Math.round(incomeTax * 0.1);
  } else if (incomeType === 'other') {
    // 기타소득: 필요경비 차감 후 20% 적용
    expenseAmount = Math.round(paymentAmount * expenseRate / 100);
    taxableIncome = paymentAmount - expenseAmount;
    // 소액 부징수: 과세표준 5만원 이하면 비과세
    if (taxableIncome <= 50000) {
      incomeTax = 0;
      localTax = 0;
    } else {
      incomeTax = Math.round(taxableIncome * 0.2);
      localTax = Math.round(incomeTax * 0.1);
    }
  } else {
    // 일용근로소득: 일당 15만원 공제 후 6% × 45% (근로소득공제 55%)
    const dailyExemption = 150000;
    taxableIncome = Math.max(0, paymentAmount - dailyExemption);
    expenseAmount = dailyExemption;
    incomeTax = Math.round(taxableIncome * 0.45 * 0.06);
    localTax = Math.round(incomeTax * 0.1);
  }

  const totalTax = incomeTax + localTax;
  const netPayment = paymentAmount - totalTax;
  const effectiveRate = paymentAmount > 0 ? Math.round((totalTax / paymentAmount) * 1000) / 10 : 0;

  return {
    paymentAmount,
    incomeType,
    taxableIncome,
    expenseAmount,
    incomeTax,
    localTax,
    totalTax,
    netPayment,
    effectiveRate,
  };
}
