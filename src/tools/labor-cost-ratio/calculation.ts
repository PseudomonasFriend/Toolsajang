import type { LaborCostInput, LaborCostResult, IndustryBenchmark } from './types';

/**
 * 4대보험 사업주 부담률 (2024년 기준)
 * 국민연금: 4.5%, 건강보험: 3.545%, 장기요양보험: 건강보험의 12.95%
 * 고용보험: 0.9%, 산재보험: 업종별 상이 (평균 약 1.47%)
 */
const INSURANCE_RATES = {
  /** 국민연금 사업주 부담분 */
  nationalPension: 0.045,
  /** 건강보험 사업주 부담분 */
  healthInsurance: 0.03545,
  /** 장기요양보험 (건강보험료의 12.95%) */
  longTermCareRate: 0.1295,
  /** 고용보험 사업주 부담분 */
  employmentInsurance: 0.009,
  /** 산재보험 평균 */
  industrialAccident: 0.0147,
};

/** 업종별 적정 인건비 비율 벤치마크 */
export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  { name: '음식점', minRate: 25, maxRate: 30 },
  { name: '카페', minRate: 20, maxRate: 25 },
  { name: '소매업', minRate: 15, maxRate: 20 },
  { name: '서비스업', minRate: 30, maxRate: 40 },
  { name: '제조업', minRate: 20, maxRate: 30 },
];

/**
 * 시급 → 월급 변환
 * 주당 근무시간 × (365/7) / 12 = 월 근무시간
 * 주휴수당 포함: 주 15시간 이상이면 주휴 1일(8시간) 추가
 */
function hourlyToMonthly(hourlyPay: number, weeklyHours: number): number {
  // 주휴수당 포함 주당 시간
  const paidWeeklyHours = weeklyHours >= 15
    ? weeklyHours + Math.min(8, weeklyHours / 5)
    : weeklyHours;

  // 월 환산 (4.345주)
  const monthlyHours = paidWeeklyHours * 4.345;
  return Math.round(hourlyPay * monthlyHours);
}

/**
 * 4대보험 사업주 부담금 계산
 */
function calculateInsurance(monthlySalary: number): number {
  const pension = monthlySalary * INSURANCE_RATES.nationalPension;
  const health = monthlySalary * INSURANCE_RATES.healthInsurance;
  const longTermCare = health * INSURANCE_RATES.longTermCareRate;
  const employment = monthlySalary * INSURANCE_RATES.employmentInsurance;
  const industrial = monthlySalary * INSURANCE_RATES.industrialAccident;
  return Math.round(pension + health + longTermCare + employment + industrial);
}

/**
 * 인건비 비율 계산 함수
 */
export function calculateLaborCost(input: LaborCostInput): LaborCostResult {
  const { monthlySales, employees, includeInsurance } = input;

  // 직원별 월급 계산
  const employeeMonthlySalaries = employees.map((emp) => {
    if (emp.payType === 'hourly') {
      return hourlyToMonthly(emp.pay, emp.weeklyHours);
    }
    return emp.pay;
  });

  // 급여 합계
  const totalSalary = employeeMonthlySalaries.reduce((sum, s) => sum + s, 0);

  // 4대보험 사업주 부담금
  const insuranceCost = includeInsurance
    ? employeeMonthlySalaries.reduce((sum, salary) => sum + calculateInsurance(salary), 0)
    : 0;

  // 총 인건비
  const totalLaborCost = totalSalary + insuranceCost;

  // 인건비 비율
  const laborCostRatio = monthlySales > 0
    ? Math.round((totalLaborCost / monthlySales) * 100 * 10) / 10
    : 0;

  // 진단 (음식점 기준 25~30% 기본)
  let diagnosis: string;
  let diagnosisLevel: 'good' | 'warning' | 'danger';

  if (laborCostRatio <= 25) {
    diagnosis = '인건비 비율이 적정 수준입니다. 효율적으로 운영하고 있습니다.';
    diagnosisLevel = 'good';
  } else if (laborCostRatio <= 35) {
    diagnosis = '인건비 비율이 보통 수준입니다. 매출 증가 또는 인력 효율화를 검토해 보세요.';
    diagnosisLevel = 'warning';
  } else {
    diagnosis = '인건비 비율이 높습니다. 매출 대비 인건비 부담이 큰 상태입니다.';
    diagnosisLevel = 'danger';
  }

  return {
    employeeMonthlySalaries,
    totalSalary,
    insuranceCost,
    totalLaborCost,
    laborCostRatio,
    diagnosis,
    diagnosisLevel,
  };
}
