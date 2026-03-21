/** 시급 계산기 입력 */
export interface HourlyWageInput {
  /** 시급 (원) */
  hourlyWage: number;
  /** 1일 근무시간 (시간, 0.5~12) */
  dailyHours: number;
  /** 주 근무일수 (1~6일) */
  weeklyDays: number;
}

/** 시급 계산기 출력 */
export interface HourlyWageOutput {
  /** 일급 */
  dailyPay: number;
  /** 주급 (주휴수당 제외) */
  weeklyPay: number;
  /** 주휴수당 */
  weeklyAllowance: number;
  /** 주휴수당 포함 주급 */
  weeklyTotal: number;
  /** 월 소정근로 시간 */
  monthlyHours: number;
  /** 월 통상임금 (주휴수당 포함) */
  monthlyWage: number;
  /** 주 소정근로시간 */
  weeklyHours: number;
  /** 주휴수당 발생 여부 (주 15시간 이상) */
  isWeeklyAllowanceApplicable: boolean;
  /** 4대보험 의무 가입 여부 (월 60시간 이상) */
  isInsuranceRequired: boolean;
  /** 근로자 국민연금 */
  nationalPensionEmployee: number;
  /** 근로자 건강보험 */
  healthInsuranceEmployee: number;
  /** 근로자 장기요양 */
  longTermCareEmployee: number;
  /** 근로자 고용보험 */
  employmentInsuranceEmployee: number;
  /** 근로자 공제합계 */
  totalDeductionEmployee: number;
  /** 실수령액 */
  netMonthlyPay: number;
  /** 사업주 국민연금 */
  nationalPensionEmployer: number;
  /** 사업주 건강보험 */
  healthInsuranceEmployer: number;
  /** 사업주 장기요양 */
  longTermCareEmployer: number;
  /** 사업주 고용보험 */
  employmentInsuranceEmployer: number;
  /** 사업주 부담 합계 */
  totalEmployerCost: number;
  /** 사업주 총 인건비 (월 통상임금 + 사업주 부담) */
  totalLaborCost: number;
  /** 최저시급 위반 여부 (2025년 10,030원) */
  isMinimumWageViolation: boolean;
  /** 2025년 최저시급 */
  minimumWage: number;
}
