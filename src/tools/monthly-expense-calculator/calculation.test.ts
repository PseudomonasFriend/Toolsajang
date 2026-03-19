import { describe, it, expect } from 'vitest';
import { calculateMonthlyExpense } from './calculation';

describe('월 고정비 계산기 (calculateMonthlyExpense)', () => {
  describe('기본 합산', () => {
    it('모든 항목 합산이 totalExpense와 일치', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 200000,
        laborCost: 3000000,
        insuranceCost: 300000,
        utilityCost: 400000,
        telecomCost: 100000,
        loanInterest: 500000,
        cardFee: 150000,
        deliveryFee: 200000,
        miscCost: 100000,
      });
      const expected = 1500000 + 200000 + 3000000 + 300000 + 400000 + 100000 + 500000 + 150000 + 200000 + 100000;
      expect(result.totalExpense).toBe(expected);
    });

    it('0인 항목은 items에 포함되지 않음', () => {
      const result = calculateMonthlyExpense({
        rent: 1000000,
        maintenanceFee: 0,
        laborCost: 2000000,
        insuranceCost: 0,
        utilityCost: 300000,
        telecomCost: 0,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      expect(result.items).toHaveLength(3);
      expect(result.totalExpense).toBe(3300000);
    });

    it('모든 항목 0이면 totalExpense 0', () => {
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
      expect(result.totalExpense).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('일 고정비 계산', () => {
    it('dailyExpense = round(totalExpense / 30)', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 0,
        laborCost: 3000000,
        insuranceCost: 0,
        utilityCost: 0,
        telecomCost: 0,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      expect(result.dailyExpense).toBe(Math.round(4500000 / 30));
    });
  });

  describe('카테고리별 소계', () => {
    it('임대 카테고리 = 임대료 + 관리비', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 200000,
        laborCost: 0,
        insuranceCost: 0,
        utilityCost: 0,
        telecomCost: 0,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      const rentCategory = result.categoryTotals.find((c) => c.category === '임대');
      expect(rentCategory?.total).toBe(1700000);
    });

    it('가장 큰 카테고리가 largestCategory', () => {
      const result = calculateMonthlyExpense({
        rent: 500000,
        maintenanceFee: 0,
        laborCost: 3000000,
        insuranceCost: 300000,
        utilityCost: 0,
        telecomCost: 0,
        loanInterest: 0,
        cardFee: 0,
        deliveryFee: 0,
        miscCost: 0,
      });
      expect(result.largestCategory).toBe('인건비');
    });

    it('퍼센테이지 합계가 100% 이하', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 200000,
        laborCost: 3000000,
        insuranceCost: 300000,
        utilityCost: 400000,
        telecomCost: 100000,
        loanInterest: 500000,
        cardFee: 150000,
        deliveryFee: 200000,
        miscCost: 100000,
      });
      const totalPct = result.categoryTotals.reduce((sum, c) => sum + c.percentage, 0);
      // 반올림으로 인해 100이 아닐 수 있지만 합리적 범위
      expect(totalPct).toBeGreaterThanOrEqual(96);
      expect(totalPct).toBeLessThanOrEqual(104);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('동네 음식점: 임대 150만, 관리 20만, 인건비 350만, 보험 35만, 공과금 50만', () => {
      const result = calculateMonthlyExpense({
        rent: 1500000,
        maintenanceFee: 200000,
        laborCost: 3500000,
        insuranceCost: 350000,
        utilityCost: 500000,
        telecomCost: 80000,
        loanInterest: 300000,
        cardFee: 200000,
        deliveryFee: 150000,
        miscCost: 50000,
      });
      expect(result.totalExpense).toBe(6830000);
      expect(result.dailyExpense).toBe(Math.round(6830000 / 30));
      expect(result.largestCategory).toBe('인건비');
    });
  });
});
