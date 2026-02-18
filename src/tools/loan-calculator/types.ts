/** 상환 방식 */
export type RepaymentType = 'equalPrincipal' | 'equalPayment';

/** 대출 이자 계산기 입력 */
export interface LoanInput {
  /** 대출 원금 (원) */
  principal: number;
  /** 연 이자율 (%) */
  annualRate: number;
  /** 대출 기간 (개월) */
  loanMonths: number;
  /** 상환 방식 */
  repaymentType: RepaymentType;
}

/** 상환 스케줄 행 */
export interface ScheduleRow {
  /** 회차 (1부터 시작) */
  month: number;
  /** 월 상환액 */
  payment: number;
  /** 원금 상환분 */
  principalPart: number;
  /** 이자분 */
  interestPart: number;
  /** 남은 잔액 */
  balance: number;
}

/** 대출 이자 계산기 출력 */
export interface LoanOutput {
  /** 월 상환액 (첫 달 기준) */
  monthlyPayment: number;
  /** 총 상환액 */
  totalPayment: number;
  /** 총 이자 */
  totalInterest: number;
  /** 상환 스케줄 */
  schedule: ScheduleRow[];
}
