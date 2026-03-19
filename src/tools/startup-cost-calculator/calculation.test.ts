import { describe, it, expect } from 'vitest';
import { calculateStartupCost } from './calculation';

describe('창업비용 계산기 (calculateStartupCost)', () => {
  describe('기본 합산', () => {
    it('모든 항목 합산이 subtotal과 일치', () => {
      const result = calculateStartupCost({
        deposit: 30000000,
        premiumFee: 20000000,
        interiorCost: 15000000,
        equipmentCost: 5000000,
        initialInventory: 3000000,
        signageCost: 2000000,
        licenseFee: 500000,
        miscCost: 1000000,
        contingencyRate: 10,
      });
      const expected = 30000000 + 20000000 + 15000000 + 5000000 + 3000000 + 2000000 + 500000 + 1000000;
      expect(result.subtotal).toBe(expected);
    });

    it('0인 항목은 items에 포함되지 않음', () => {
      const result = calculateStartupCost({
        deposit: 20000000,
        premiumFee: 0,
        interiorCost: 10000000,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 10,
      });
      expect(result.items).toHaveLength(2);
    });
  });

  describe('예비비 계산', () => {
    it('예비비 = round(subtotal * contingencyRate / 100)', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 0,
        interiorCost: 10000000,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 15,
      });
      expect(result.contingency).toBe(Math.round(20000000 * 0.15));
      expect(result.totalCost).toBe(20000000 + result.contingency);
    });

    it('예비비율 0이면 contingency 0', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 0,
        interiorCost: 5000000,
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
  });

  describe('totalCost = subtotal + contingency', () => {
    it('항상 totalCost = subtotal + contingency', () => {
      const cases = [
        { contingencyRate: 0 },
        { contingencyRate: 5 },
        { contingencyRate: 10 },
        { contingencyRate: 20 },
      ];
      for (const { contingencyRate } of cases) {
        const result = calculateStartupCost({
          deposit: 15000000,
          premiumFee: 10000000,
          interiorCost: 8000000,
          equipmentCost: 3000000,
          initialInventory: 2000000,
          signageCost: 1000000,
          licenseFee: 300000,
          miscCost: 500000,
          contingencyRate,
        });
        expect(result.totalCost).toBe(result.subtotal + result.contingency);
      }
    });
  });

  describe('상위 항목', () => {
    it('topItems은 금액 상위 3개', () => {
      const result = calculateStartupCost({
        deposit: 30000000,
        premiumFee: 20000000,
        interiorCost: 15000000,
        equipmentCost: 5000000,
        initialInventory: 3000000,
        signageCost: 2000000,
        licenseFee: 500000,
        miscCost: 1000000,
        contingencyRate: 10,
      });
      expect(result.topItems).toHaveLength(3);
      expect(result.topItems[0].amount).toBe(30000000);
      expect(result.topItems[1].amount).toBe(20000000);
      expect(result.topItems[2].amount).toBe(15000000);
    });

    it('항목 3개 미만이면 있는 만큼만 반환', () => {
      const result = calculateStartupCost({
        deposit: 10000000,
        premiumFee: 5000000,
        interiorCost: 0,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 10,
      });
      expect(result.topItems).toHaveLength(2);
    });
  });

  describe('모든 항목 0', () => {
    it('모든 비용 0이면 totalCost 0', () => {
      const result = calculateStartupCost({
        deposit: 0,
        premiumFee: 0,
        interiorCost: 0,
        equipmentCost: 0,
        initialInventory: 0,
        signageCost: 0,
        licenseFee: 0,
        miscCost: 0,
        contingencyRate: 10,
      });
      expect(result.subtotal).toBe(0);
      expect(result.contingency).toBe(0);
      expect(result.totalCost).toBe(0);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('카페 창업: 보증금 2000만, 인테리어 1500만, 설비 800만, 예비비 10%', () => {
      const result = calculateStartupCost({
        deposit: 20000000,
        premiumFee: 5000000,
        interiorCost: 15000000,
        equipmentCost: 8000000,
        initialInventory: 3000000,
        signageCost: 2000000,
        licenseFee: 500000,
        miscCost: 500000,
        contingencyRate: 10,
      });
      expect(result.subtotal).toBe(54000000);
      expect(result.contingency).toBe(5400000);
      expect(result.totalCost).toBe(59400000);
    });
  });
});
