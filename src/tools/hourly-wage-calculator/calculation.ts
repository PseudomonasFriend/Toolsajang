import type { HourlyWageInput, HourlyWageOutput } from './types';

/** 2025년 최저시급 */
const MINIMUM_WAGE_2025 = 10030;

/** 월 평균 주수 */
const WEEKS_PER_MONTH = 4.345;

/**
 * 시급 계산 함수
 * 시급·일근무시간·주근무일수를 기반으로 주휴수당, 월 통상임금, 4대보험, 실수령액을 계산한다.
 * 2025년 기준 요율 적용.
 */
export function calculateHourlyWage(input: HourlyWageInput): HourlyWageOutput {
  const { hourlyWage, dailyHours, weeklyDays } = input;

  // --- 기본 급여 ---
  const weeklyHours = dailyHours * weeklyDays;
  const dailyPay = hourlyWage * dailyHours;
  const weeklyPay = dailyPay * weeklyDays;

  // --- 주휴수당 (주 소정근로시간 15시간 이상 시 발생) ---
  const isWeeklyAllowanceApplicable = weeklyHours >= 15;
  const weeklyAllowance = isWeeklyAllowanceApplicable
    ? Math.round(hourlyWage * (weeklyHours / 5))
    : 0;
  const weeklyTotal = weeklyPay + weeklyAllowance;

  // --- 월 통상임금 ---
  const weeklyHoursWithAllowance = isWeeklyAllowanceApplicable
    ? weeklyHours + weeklyHours / 5
    : weeklyHours;
  const monthlyHours = Math.round(weeklyHoursWithAllowance * WEEKS_PER_MONTH);
  const monthlyWage = Math.round(weeklyTotal * WEEKS_PER_MONTH);

  // --- 4대보험 (월 소정근로시간 60시간 이상 의무가입) ---
  const isInsuranceRequired = monthlyHours >= 60;

  let nationalPensionEmployee = 0;
  let healthInsuranceEmployee = 0;
  let longTermCareEmployee = 0;
  let employmentInsuranceEmployee = 0;
  let nationalPensionEmployer = 0;
  let healthInsuranceEmployer = 0;
  let longTermCareEmployer = 0;
  let employmentInsuranceEmployer = 0;

  if (isInsuranceRequired) {
    // 근로자 부담
    nationalPensionEmployee = Math.round(monthlyWage * 0.045);
    healthInsuranceEmployee = Math.round(monthlyWage * 0.03545);
    longTermCareEmployee = Math.round(healthInsuranceEmployee * 0.1295);
    employmentInsuranceEmployee = Math.round(monthlyWage * 0.009);

    // 사업주 부담
    nationalPensionEmployer = Math.round(monthlyWage * 0.045);
    healthInsuranceEmployer = Math.round(monthlyWage * 0.03545);
    longTermCareEmployer = Math.round(healthInsuranceEmployer * 0.1295);
    employmentInsuranceEmployer = Math.round(monthlyWage * 0.0115); // 10인 미만 기준
  }

  const totalDeductionEmployee =
    nationalPensionEmployee +
    healthInsuranceEmployee +
    longTermCareEmployee +
    employmentInsuranceEmployee;

  const netMonthlyPay = monthlyWage - totalDeductionEmployee;

  const totalEmployerCost =
    nationalPensionEmployer +
    healthInsuranceEmployer +
    longTermCareEmployer +
    employmentInsuranceEmployer;

  const totalLaborCost = monthlyWage + totalEmployerCost;

  // --- 최저시급 위반 여부 ---
  const isMinimumWageViolation = hourlyWage < MINIMUM_WAGE_2025;

  return {
    dailyPay,
    weeklyPay,
    weeklyAllowance,
    weeklyTotal,
    monthlyHours,
    monthlyWage,
    weeklyHours,
    isWeeklyAllowanceApplicable,
    isInsuranceRequired,
    nationalPensionEmployee,
    healthInsuranceEmployee,
    longTermCareEmployee,
    employmentInsuranceEmployee,
    totalDeductionEmployee,
    netMonthlyPay,
    nationalPensionEmployer,
    healthInsuranceEmployer,
    longTermCareEmployer,
    employmentInsuranceEmployer,
    totalEmployerCost,
    totalLaborCost,
    isMinimumWageViolation,
    minimumWage: MINIMUM_WAGE_2025,
  };
}
