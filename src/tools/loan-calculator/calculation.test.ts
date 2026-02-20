import { describe, it, expect } from 'vitest';
import { calculateLoan } from './calculation';

describe('대출 이자 계산기 (calculateLoan)', () => {
  describe('원리금균등상환 (equalPayment)', () => {
    it('원금 10000000, 연이율 5%, 12개월 — 총 상환액이 원금보다 크다', () => {
      const result = calculateLoan({
        principal: 10000000,
        annualRate: 5,
        loanMonths: 12,
        repaymentType: 'equalPayment',
      });
      expect(result.totalPayment).toBeGreaterThan(10000000);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('매월 상환액이 동일해야 한다 (원리금균등)', () => {
      const result = calculateLoan({
        principal: 6000000,
        annualRate: 6,
        loanMonths: 12,
        repaymentType: 'equalPayment',
      });
      const firstPayment = result.schedule[0].payment;
      // 마지막 회차는 잔액 보정으로 약간 다를 수 있으므로 처음 11개만 확인
      for (let i = 0; i < 11; i++) {
        expect(result.schedule[i].payment).toBe(firstPayment);
      }
    });

    it('스케줄 길이가 대출 기간과 일치', () => {
      const result = calculateLoan({
        principal: 5000000,
        annualRate: 4,
        loanMonths: 24,
        repaymentType: 'equalPayment',
      });
      expect(result.schedule).toHaveLength(24);
    });

    it('마지막 회차 잔액은 0이어야 한다', () => {
      const result = calculateLoan({
        principal: 5000000,
        annualRate: 4,
        loanMonths: 12,
        repaymentType: 'equalPayment',
      });
      const lastRow = result.schedule[result.schedule.length - 1];
      expect(lastRow.balance).toBe(0);
    });

    it('이자율 0%이면 총 이자가 0', () => {
      const result = calculateLoan({
        principal: 12000000,
        annualRate: 0,
        loanMonths: 12,
        repaymentType: 'equalPayment',
      });
      // 이자율 0% → 총 이자 0
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayment).toBe(12000000);
    });

    it('총 이자 = 총 상환액 - 원금', () => {
      const result = calculateLoan({
        principal: 10000000,
        annualRate: 3,
        loanMonths: 36,
        repaymentType: 'equalPayment',
      });
      expect(result.totalInterest).toBe(result.totalPayment - 10000000);
    });
  });

  describe('원금균등상환 (equalPrincipal)', () => {
    it('매월 원금 상환분이 동일해야 한다', () => {
      const result = calculateLoan({
        principal: 12000000,
        annualRate: 6,
        loanMonths: 12,
        repaymentType: 'equalPrincipal',
      });
      const monthlyPrincipal = result.schedule[0].principalPart;
      result.schedule.forEach((row) => {
        expect(row.principalPart).toBe(monthlyPrincipal);
      });
    });

    it('초기 상환액이 후기보다 크다 (이자 감소)', () => {
      const result = calculateLoan({
        principal: 12000000,
        annualRate: 6,
        loanMonths: 12,
        repaymentType: 'equalPrincipal',
      });
      const firstPayment = result.schedule[0].payment;
      const lastPayment = result.schedule[result.schedule.length - 1].payment;
      expect(firstPayment).toBeGreaterThan(lastPayment);
    });

    it('마지막 회차 잔액은 0이어야 한다', () => {
      const result = calculateLoan({
        principal: 9000000,
        annualRate: 5,
        loanMonths: 12,
        repaymentType: 'equalPrincipal',
      });
      const lastRow = result.schedule[result.schedule.length - 1];
      expect(lastRow.balance).toBe(0);
    });

    it('총 이자 = 총 상환액 - 원금', () => {
      const result = calculateLoan({
        principal: 6000000,
        annualRate: 4,
        loanMonths: 24,
        repaymentType: 'equalPrincipal',
      });
      expect(result.totalInterest).toBe(result.totalPayment - 6000000);
    });
  });

  describe('원리금균등 vs 원금균등 비교', () => {
    it('동일 조건에서 원금균등이 원리금균등보다 총 이자가 적다', () => {
      const common = {
        principal: 10000000,
        annualRate: 5,
        loanMonths: 24,
      };
      const equalPayment = calculateLoan({ ...common, repaymentType: 'equalPayment' });
      const equalPrincipal = calculateLoan({ ...common, repaymentType: 'equalPrincipal' });
      expect(equalPrincipal.totalInterest).toBeLessThan(equalPayment.totalInterest);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('소상공인 창업 대출: 원금 5000만원, 연 5%, 60개월 원리금균등', () => {
      const result = calculateLoan({
        principal: 50000000,
        annualRate: 5,
        loanMonths: 60,
        repaymentType: 'equalPayment',
      });
      expect(result.schedule).toHaveLength(60);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.monthlyPayment).toBeGreaterThan(0);
      // 총 이자 = 총 상환액 - 원금
      expect(result.totalInterest).toBe(result.totalPayment - 50000000);
    });
  });
});
