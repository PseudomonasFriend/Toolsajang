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

      // 마지막 회차: 남은 잔액 + 이자로 실제 payment 재계산 (반올림 오차 보정)
      if (i === loanMonths) {
        const lastPayment = balance + interestPart;
        schedule.push({
          month: i,
          payment: lastPayment,
          principalPart: balance,
          interestPart,
          balance: 0,
        });
        break;
      }

      const principalPart = fixedPayment - interestPart;
      balance = balance - principalPart;

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

      // 마지막 회차: 남은 잔액 전부 상환 (반올림 오차 보정)
      if (i === loanMonths) {
        schedule.push({
          month: i,
          payment: balance + interestPart,
          principalPart: balance,
          interestPart,
          balance: 0,
        });
        break;
      }

      const payment = monthlyPrincipal + interestPart;
      balance = balance - monthlyPrincipal;

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
