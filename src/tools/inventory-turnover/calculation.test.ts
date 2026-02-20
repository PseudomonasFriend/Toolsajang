import { describe, it, expect } from 'vitest';
import { calculateInventoryTurnover } from './calculation';

describe('재고 회전율 계산기 (calculateInventoryTurnover)', () => {
  describe('기본 재고 회전율 계산', () => {
    it('30일 기준 매출원가 3000000, 평균 재고 3000000이면 연환산 회전율 약 12회', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 3000000,
        beginningInventory: 3000000,
        endingInventory: 3000000,
      });
      // 연간 매출원가 = 3000000 * 365 / 30 = 36500000
      // 회전율 = 36500000 / 3000000 = 12.16...
      expect(result.turnoverRate).toBeCloseTo(12.2, 0);
    });

    it('평균 재고 = (기초 + 기말) / 2', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 1000000,
        beginningInventory: 2000000,
        endingInventory: 4000000,
      });
      expect(result.avgInventory).toBe(3000000);
    });

    it('재고 보유 일수 = round(365 / 회전율)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 365,
        costOfGoods: 12000000,
        beginningInventory: 1000000,
        endingInventory: 1000000,
      });
      // 회전율 = 12000000 / 1000000 = 12
      // 재고 보유 일수 = 365 / 12 ≈ 30
      expect(result.daysOnHand).toBe(Math.round(365 / result.turnoverRate));
    });
  });

  describe('진단 등급 (diagnosisLevel)', () => {
    it('회전율 >= 12이면 good (우수)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 3000000,
        beginningInventory: 3000000,
        endingInventory: 3000000,
      });
      // 약 12.2 → good
      expect(result.diagnosisLevel).toBe('good');
    });

    it('회전율 6~12이면 good (양호)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 1500000,
        beginningInventory: 3000000,
        endingInventory: 3000000,
      });
      // 연환산 = 18250000 / 3000000 ≈ 6.1 → good
      expect(result.diagnosisLevel).toBe('good');
    });

    it('회전율 3~6이면 warning (다소 과잉)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 90,
        costOfGoods: 1000000,
        beginningInventory: 2000000,
        endingInventory: 2000000,
      });
      // 연환산 = 1000000 * 365 / 90 = 4055555
      // 회전율 = 4055555 / 2000000 ≈ 2.03 → danger (3 미만)
      // 다른 케이스: periodDays=30, costOfGoods=400000, avg=1000000
      // 연환산 = 400000*365/30 = 4866666, 회전율 = 4.87 → warning
      const result2 = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 400000,
        beginningInventory: 1000000,
        endingInventory: 1000000,
      });
      expect(result2.diagnosisLevel).toBe('warning');
    });

    it('회전율 3 미만이면 danger (재고 과잉)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 200000,
        beginningInventory: 2000000,
        endingInventory: 2000000,
      });
      // 연환산 = 200000*365/30 = 2433333, 회전율 = 2433333/2000000 ≈ 1.2 → danger
      expect(result.diagnosisLevel).toBe('danger');
    });
  });

  describe('평균 재고 0 이하인 경우 (계산 불가)', () => {
    it('기초·기말 재고 모두 0이면 0 반환 및 warning', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 1000000,
        beginningInventory: 0,
        endingInventory: 0,
      });
      expect(result.avgInventory).toBe(0);
      expect(result.turnoverRate).toBe(0);
      expect(result.daysOnHand).toBe(0);
      expect(result.diagnosisLevel).toBe('warning');
    });
  });

  describe('다양한 기간 설정', () => {
    it('periodDays = 365 (연간 데이터)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 365,
        costOfGoods: 36500000,
        beginningInventory: 3000000,
        endingInventory: 3000000,
      });
      // 회전율 = 36500000 / 3000000 ≈ 12.2 → good
      expect(result.diagnosisLevel).toBe('good');
      expect(result.turnoverRate).toBeGreaterThan(0);
    });

    it('periodDays = 90 (분기 데이터)', () => {
      const result = calculateInventoryTurnover({
        periodDays: 90,
        costOfGoods: 9000000,
        beginningInventory: 3000000,
        endingInventory: 3000000,
      });
      expect(result.avgInventory).toBe(3000000);
      expect(result.turnoverRate).toBeGreaterThan(0);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('편의점: 30일 매출원가 10000000, 평균 재고 1000000 → 빠른 회전', () => {
      const result = calculateInventoryTurnover({
        periodDays: 30,
        costOfGoods: 10000000,
        beginningInventory: 1000000,
        endingInventory: 1000000,
      });
      expect(result.diagnosisLevel).toBe('good');
      expect(result.turnoverRate).toBeGreaterThan(12);
    });

    it('의류점: 90일 매출원가 3000000, 평균 재고 5000000 → 재고 많음', () => {
      const result = calculateInventoryTurnover({
        periodDays: 90,
        costOfGoods: 3000000,
        beginningInventory: 5000000,
        endingInventory: 5000000,
      });
      // 연환산 = 3000000 * 365/90 ≈ 12166666, 회전율 ≈ 2.43 → danger
      expect(result.diagnosisLevel).toBe('danger');
    });
  });
});
