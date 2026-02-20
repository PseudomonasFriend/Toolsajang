import { describe, it, expect } from 'vitest';
import { calculateFoodCost } from './calculation';

describe('원가율 계산기 (calculateFoodCost)', () => {
  describe('기본 원가율 계산', () => {
    it('식재료 3000, 판매가 10000이면 원가율 30%', () => {
      const result = calculateFoodCost({
        menuName: '아메리카노',
        ingredientCost: 3000,
        sellingPrice: 10000,
        targetCostRate: 35,
      });
      expect(result.currentCostRate).toBe(30);
    });

    it('식재료 1500, 판매가 4500이면 원가율 33.3%', () => {
      const result = calculateFoodCost({
        menuName: '라떼',
        ingredientCost: 1500,
        sellingPrice: 4500,
        targetCostRate: 35,
      });
      expect(result.currentCostRate).toBe(33.3);
    });

    it('판매가 0이면 원가율 0 (ZeroDivision 방지)', () => {
      const result = calculateFoodCost({
        menuName: '테스트',
        ingredientCost: 1000,
        sellingPrice: 0,
        targetCostRate: 35,
      });
      expect(result.currentCostRate).toBe(0);
    });
  });

  describe('총 이익 계산', () => {
    it('총 이익 = 판매가 - 식재료 원가', () => {
      const result = calculateFoodCost({
        menuName: '파스타',
        ingredientCost: 5000,
        sellingPrice: 15000,
        targetCostRate: 30,
      });
      expect(result.grossProfit).toBe(10000);
    });

    it('총 이익률 = (이익 / 판매가) * 100', () => {
      const result = calculateFoodCost({
        menuName: '파스타',
        ingredientCost: 5000,
        sellingPrice: 15000,
        targetCostRate: 30,
      });
      // (10000 / 15000) * 100 = 66.7
      expect(result.grossProfitRate).toBe(66.7);
    });

    it('식재료 원가 = 판매가이면 총 이익 0', () => {
      const result = calculateFoodCost({
        menuName: '테스트',
        ingredientCost: 10000,
        sellingPrice: 10000,
        targetCostRate: 30,
      });
      expect(result.grossProfit).toBe(0);
      expect(result.grossProfitRate).toBe(0);
    });
  });

  describe('권장 판매가 계산', () => {
    it('목표 원가율 기준 권장 판매가 = ceil(원가 / 목표율, 100원 단위)', () => {
      const result = calculateFoodCost({
        menuName: '된장찌개',
        ingredientCost: 3000,
        sellingPrice: 8000,
        targetCostRate: 30,
      });
      // 권장 가격 = ceil(3000 / 0.30 / 100) * 100 = ceil(100) * 100 = 10000
      expect(result.recommendedPrice).toBe(10000);
    });

    it('목표 원가율 0이면 권장 판매가 0', () => {
      const result = calculateFoodCost({
        menuName: '테스트',
        ingredientCost: 3000,
        sellingPrice: 8000,
        targetCostRate: 0,
      });
      expect(result.recommendedPrice).toBe(0);
    });

    it('권장 판매가는 100원 단위로 올림', () => {
      const result = calculateFoodCost({
        menuName: '테스트',
        ingredientCost: 1500,
        sellingPrice: 4000,
        targetCostRate: 35,
      });
      // 1500 / 0.35 = 4285.7... → ceil(42.857) * 100 = 4300
      expect(result.recommendedPrice).toBe(4300);
      expect(result.recommendedPrice % 100).toBe(0);
    });
  });

  describe('진단 (diagnosisLevel)', () => {
    it('원가율 <= 목표 원가율이면 good', () => {
      const result = calculateFoodCost({
        menuName: '아메리카노',
        ingredientCost: 2000,
        sellingPrice: 10000,
        targetCostRate: 30,
      });
      // 원가율 20% <= 30% → good
      expect(result.diagnosisLevel).toBe('good');
    });

    it('원가율이 목표보다 약간 높으면 (목표+10% 이내) warning', () => {
      const result = calculateFoodCost({
        menuName: '아메리카노',
        ingredientCost: 3500,
        sellingPrice: 10000,
        targetCostRate: 30,
      });
      // 원가율 35% = 목표 30% + 5% → warning
      expect(result.diagnosisLevel).toBe('warning');
    });

    it('원가율이 목표보다 10% 초과 높으면 danger', () => {
      const result = calculateFoodCost({
        menuName: '아메리카노',
        ingredientCost: 5000,
        sellingPrice: 10000,
        targetCostRate: 30,
      });
      // 원가율 50% = 목표 30% + 20% → danger
      expect(result.diagnosisLevel).toBe('danger');
    });
  });

  describe('실제 사용 시나리오', () => {
    it('한식당 된장찌개: 원가 4500, 판매가 9000, 목표 원가율 40%', () => {
      const result = calculateFoodCost({
        menuName: '된장찌개',
        ingredientCost: 4500,
        sellingPrice: 9000,
        targetCostRate: 40,
      });
      // 원가율 = 50% > 40% → warning (50 <= 40 + 10)
      expect(result.currentCostRate).toBe(50);
      expect(result.diagnosisLevel).toBe('warning');
      expect(result.grossProfit).toBe(4500);
    });

    it('카페 바나나스무디: 원가 2800, 판매가 6500, 목표 원가율 35%', () => {
      const result = calculateFoodCost({
        menuName: '바나나스무디',
        ingredientCost: 2800,
        sellingPrice: 6500,
        targetCostRate: 35,
      });
      // 원가율 = round(2800/6500 * 100 * 10) / 10 = 43.1%
      expect(result.currentCostRate).toBe(43.1);
      // 43.1 > 35, 43.1 <= 35 + 10 = 45 → warning
      expect(result.diagnosisLevel).toBe('warning');
    });
  });
});
