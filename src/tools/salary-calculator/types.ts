/** 급여 계산기 입력 */
export interface SalaryInput {
  /** 월 급여 (세전, 원) */
  monthlySalary: number;
  /** 부양가족 수 (본인 포함, 1~20) */
  dependents: number;
}

/** 급여 계산기 출력 */
export interface SalaryOutput {
  /** 국민연금 (근로자) */
  nationalPensionEmployee: number;
  /** 건강보험 (근로자) */
  healthInsuranceEmployee: number;
  /** 장기요양보험 (근로자) */
  longTermCareEmployee: number;
  /** 고용보험 (근로자) */
  employmentInsuranceEmployee: number;
  /** 소득세 */
  incomeTax: number;
  /** 지방소득세 */
  localIncomeTax: number;
  /** 공제 합계 */
  totalDeduction: number;
  /** 실수령액 */
  netSalary: number;
  /** 국민연금 (사업주) */
  nationalPensionEmployer: number;
  /** 건강보험 (사업주) */
  healthInsuranceEmployer: number;
  /** 장기요양보험 (사업주) */
  longTermCareEmployer: number;
  /** 고용보험 (사업주) */
  employmentInsuranceEmployer: number;
  /** 사업주 부담 합계 */
  totalEmployerCost: number;
  /** 총 인건비 */
  totalLaborCost: number;
}
