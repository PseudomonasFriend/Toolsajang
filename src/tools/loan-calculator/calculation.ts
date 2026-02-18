import type { LoanInput, LoanOutput, ScheduleRow } from './types';

/**
 * 대출 이자 계산 함수
 * 원금, 연 이자율, 기간, 상환 방식을 기반으로
 * 월 상환액, 총 상환액, 총 이자, 상환 스케줄을 계산한다.
 */
export function calculateLoan(input: LoanInput): LoanOutput {
  const { principal, annualRate, loanMonths, repaymentType } = input;

  /** 월이율 */
  const monthlyRate = annualRate / 100 / 12;

  const schedule: ScheduleRow[] = [];

  if (repaymentType === 'equalPayment') {
    // === 원리금균등상환 ===
    let fixedPayment: number;

    if (monthlyRate === 0) {
      fixedPayment = Math.round(principal / loanMonths);
    } else {
      const compounded = Math.pow(1 + monthlyRate, loanMonths);
      fixedPayment = Math.round(
        (principal * monthlyRate * compounded) / (compounded - 1)
      );
    }

    let balance = principal;

    for (let i = 1; i <= loanMonths; i++) {
      const interestPart = Math.round(balance * monthlyRate);
      const principalPart = fixedPayment - interestPart;
      balance = balance - principalPart;

      // 마지막 회차에서 잔액 보정
      if (i === loanMonths) {
        balance = 0;
      }

      schedule.push({
        month: i,
        payment: fixedPayment,
        principalPart,
        interestPart,
        balance: Math.max(balance, 0),
      });
    }
  } else {
    // === 원금균등상환 ===
    const monthlyPrincipal = Math.round(principal / loanMonths);
    let balance = principal;

    for (let i = 1; i <= loanMonths; i++) {
      const interestPart = Math.round(balance * monthlyRate);
      const payment = monthlyPrincipal + interestPart;
      balance = balance - monthlyPrincipal;

      // 마지막 회차에서 잔액 보정
      if (i === loanMonths) {
        balance = 0;
      }

      schedule.push({
        month: i,
        payment,
        principalPart: monthlyPrincipal,
        interestPart,
        balance: Math.max(balance, 0),
      });
    }
  }

  /** 월 상환액 (첫 달 기준) */
  const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;

  /** 총 상환액 */
  const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0);

  /** 총 이자 */
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}
