/** 급여 유형 */
export type PayType = 'hourly' | 'monthly';

/** 직원 정보 */
export interface Employee {
  /** 급여 유형 */
  payType: PayType;
  /** 시급 또는 월급 */
  pay: number;
  /** 주당 근무시간 (시급일 때만 사용) */
  weeklyHours: number;
}

/** 인건비 비율 계산기 입력 */
export interface LaborCostInput {
  /** 월 매출 */
  monthlySales: number;
  /** 직원 목록 */
  employees: Employee[];
  /** 4대보험 포함 여부 */
  includeInsurance: boolean;
}

/** 업종별 적정 인건비 비율 */
export interface IndustryBenchmark {
  /** 업종명 */
  name: string;
  /** 최소 비율 (%) */
  minRate: number;
  /** 최대 비율 (%) */
  maxRate: number;
}

/** 인건비 비율 계산기 출력 */
export interface LaborCostResult {
  /** 직원별 월급 */
  employeeMonthlySalaries: number[];
  /** 직원 급여 합계 */
  totalSalary: number;
  /** 4대보험 사업주 부담금 */
  insuranceCost: number;
  /** 총 인건비 (급여 + 보험) */
  totalLaborCost: number;
  /** 매출 대비 인건비 비율 (%) */
  laborCostRatio: number;
  /** 진단 메시지 */
  diagnosis: string;
  /** 진단 등급 */
  diagnosisLevel: 'good' | 'warning' | 'danger';
}
