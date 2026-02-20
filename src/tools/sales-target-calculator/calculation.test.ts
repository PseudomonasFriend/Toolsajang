import { describe, it, expect } from 'vitest';
import { calculateSalesTarget } from './calculation';

describe('매출 목표 계산기 (calculateSalesTarget)', () => {
  describe('기본 필요 매출 계산', () => {
    it('고정비 1000000, 목표 순이익 500000, 마진율 30%', () => {
      const result = calculateSalesTarget({
        fixedCost: 1000000,
        targetProfit: 500000,
        marginRate: 30,
      });
      // 필요 매출 = (1000000 + 500000) / 0.30 = 5000000
      expect(result.breakEvenAmount).toBe(1500000);
      expect(result.requiredSales).toBe(5000000);
    });

    it('고정비 2000000, 목표 순이익 0, 마진율 50%이면 BEP 매출 계산', () => {
      const result = calculateSalesTarget({
        fixedCost: 2000000,
        targetProfit: 0,
        marginRate: 50,
      });
      // 필요 매출 = 2000000 / 0.50 = 4000000
      expect(result.requiredSales).toBe(4000000);
      expect(result.breakEvenAmount).toBe(2000000);
    });

    it('마진율 100%이면 필요 매출 = 고정비 + 목표 순이익', () => {
      const result = calculateSalesTarget({
        fixedCost: 1000000,
        targetProfit: 500000,
        marginRate: 100,
      });
      expect(result.requiredSales).toBe(1500000);
    });
  });

  describe('잘못된 마진율 처리 (계산 불가)', () => {
    it('마진율 0이면 requiredSales 0 반환', () => {
      const result = calculateSalesTarget({
        fixedCost: 1000000,
        targetProfit: 500000,
        marginRate: 0,
      });
      expect(result.requiredSales).toBe(0);
      expect(result.breakEvenAmount).toBe(1500000);
    });

    it('마진율 음수이면 requiredSales 0 반환', () => {
      const result = calculateSalesTarget({
        fixedCost: 1000000,
        targetProfit: 500000,
        marginRate: -10,
      });
      expect(result.requiredSales).toBe(0);
    });

    it('마진율 100% 초과이면 requiredSales 0 반환', () => {
      const result = calculateSalesTarget({
        fixedCost: 1000000,
        targetProfit: 0,
        marginRate: 101,
      });
      expect(result.requiredSales).toBe(0);
    });
  });

  describe('breakEvenAmount 계산', () => {
    it('breakEvenAmount = 고정비 + 목표 순이익', () => {
      const result = calculateSalesTarget({
        fixedCost: 3000000,
        targetProfit: 1000000,
        marginRate: 40,
      });
      expect(result.breakEvenAmount).toBe(4000000);
    });

    it('고정비 0, 목표 순이익 0이면 breakEvenAmount 0', () => {
      const result = calculateSalesTarget({
        fixedCost: 0,
        targetProfit: 0,
        marginRate: 30,
      });
      expect(result.breakEvenAmount).toBe(0);
      expect(result.requiredSales).toBe(0);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('카페: 월 고정비 3000000, 목표 수익 1000000, 마진율 60%', () => {
      const result = calculateSalesTarget({
        fixedCost: 3000000,
        targetProfit: 1000000,
        marginRate: 60,
      });
      // 필요 매출 = 4000000 / 0.60 ≈ 6666667
      expect(result.requiredSales).toBe(Math.round((4000000 * 100) / 60));
      expect(result.breakEvenAmount).toBe(4000000);
    });

    it('음식점: 고정비 5000000, 목표 수익 2000000, 마진율 25%', () => {
      const result = calculateSalesTarget({
        fixedCost: 5000000,
        targetProfit: 2000000,
        marginRate: 25,
      });
      // 필요 매출 = 7000000 / 0.25 = 28000000
      expect(result.breakEvenAmount).toBe(7000000);
      expect(result.requiredSales).toBe(28000000);
    });
  });
});
