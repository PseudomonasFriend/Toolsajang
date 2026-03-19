import { describe, it, expect } from 'vitest';
import { calculateStartupCost } from './calculation';

describe('창업비용 계산기 (calculateStartupCost)', () => {
  describe('기본 합산 계산', () => {
    it('7개 항목 합산 + 예비비 10% → 총 창업비용 계산', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 5000000,
        interiorCost: 15000000,
        equipmentCost: 8000000,
        initialInventory: 3000000,
        signageCost: 1000000,
        licenseFee: 500000,
        miscCost: 0,
        contingencyRate: 10,
      });
      // subtotal = 10+5+15+8+3+1+0.5 = 42.5M
      expect(result.subtotal).toBe(42500000);
      // contingency = round(42500000 * 0.1) = 4250000
      expect(result.contingency).toBe(4250000);
      expect(result.totalCost).toBe(46750000);
    });

    it('amount가 0인 항목은 items에서 제외', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 0,
        interiorCost: 15000000,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 0,
      });
      expect(result.items).toHaveLength(2);
    });
  });

  describe('예비비 계산', () => {
    it('예비비율 0%이면 contingency = 0', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 5000000,
        interiorCost: 0,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 0,
      });
      expect(result.contingency).toBe(0);
      expect(result.totalCost).toBe(result.subtotal);
    });

    it('예비비율 20%이면 contingency = subtotal * 0.2', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 0,
        interiorCost: 0,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 20,
      });
      expect(result.contingency).toBe(2000000);
    });
  });

  describe('상위 항목 추출', () => {
    it('topItems는 금액 기준 상위 3개', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 5000000,
        interiorCost: 20000000,
        equipmentCost: 8000000,
        initialInventory: 3000000,
        signageCost: 1000000,
        licenseFee: 500000,
        miscCost: 200000,
        contingencyRate: 10,
      });
      expect(result.topItems).toHaveLength(3);
      // 인테리어(20M) > 보증금(10M) > 설비(8M)
      expect(result.topItems[0].label).toBe('인테리어');
      expect(result.topItems[0].amount).toBe(20000000);
    });

    it('항목이 3개 미만이면 topItems는 전체 항목', () => {
      const result = calculateStartupCost({
        deposit: 5000000,
        premiumFee: 3000000,
        interiorCost: 0,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 0,
      });
      expect(result.topItems.length).toBeLessThanOrEqual(2);
    });
  });
});
