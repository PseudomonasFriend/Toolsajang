import { describe, it, expect } from 'vitest';
import { calculateMonthlyExpense } from './calculation';

describe('월 고정비 계산기 (calculateMonthlyExpense)', () => {
  describe('기본 합산 계산', () => {
    it('5개 항목 합산 → totalExpense 및 dailyExpense 계산', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 200000,
        laborCost: 2000000,
        insuranceCost: 0,
        utilityCost: 300000,
        telecomCost: 100000,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      expect(result.totalExpense).toBe(4100000);
      // round(4100000 / 30) = 136667
      expect(result.dailyExpense).toBe(136667);
    });

    it('amount가 0인 항목은 items에서 제외', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 0,
        laborCost: 2000000,
        insuranceCost: 0,
        utilityCost: 0,
        telecomCost: 0,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      expect(result.items).toHaveLength(2);
    });
  });

  describe('카테고리별 소계', () => {
    it('임대/인건비/운영비 카테고리 구분 및 비중 계산', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 200000,
        laborCost: 2000000,
        insuranceCost: 0,
        utilityCost: 300000,
        telecomCost: 100000,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      // 인건비(2M) > 임대(1.7M) > 운영비(0.4M)
      expect(result.largestCategory).toBe('인건비');
      expect(result.categoryTotals.length).toBeGreaterThan(0);
    });

    it('카테고리 비중 합계는 100% (반올림 오차 허용)', () => {
      const result = calculateMonthlyExpense({
        rent: 1000000,
        maintenanceFee: 200000,
        laborCost: 2000000,
        insuranceCost: 300000,
        utilityCost: 200000,
        telecomCost: 100000,
        loanInterest: 500000,
        cardFee: 100000,
        deliveryFee: 200000,
        miscCost: 100000,
      });
      const totalPct = result.categoryTotals.reduce((sum, c) => sum + c.percentage, 0);
      // 반올림으로 99~101 허용
      expect(totalPct).toBeGreaterThanOrEqual(99);
      expect(totalPct).toBeLessThanOrEqual(101);
    });
  });

  describe('전액 0 처리', () => {
    it('모든 항목 0이면 items 빈 배열, totalExpense 0', () => {
      const result = calculateMonthlyExpense({
        rent: 0,
        maintenanceFee: 0,
        laborCost: 0,
        insuranceCost: 0,
        utilityCost: 0,
        telecomCost: 0,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      expect(result.items).toHaveLength(0);
      expect(result.totalExpense).toBe(0);
    });
  });
});
