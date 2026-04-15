import { describe, it, expect } from 'vitest';
import { calculateShutdownCost } from './calculation';

describe('폐업비용 계산기 (calculateShutdownCost)', () => {
  describe('기본 계산', () => {
    it('모든 항목 있을 때 totalCost 합산이 정확', () => {
      const result = calculateShutdownCost({
        deposit: 50000000,
        restorationRate: 10,
        premiumLoss: 20000000,
        inventoryBalance: 5000000,
        inventoryRecoveryRate: 0,
        demolitionCost: 3000000,
        employeeSalary: 2500000,
        employeeTenure: 2,
        leasePenalty: 1000000,
        miscCost: 500000,
      });
      // 원상복구비=5000000, 권리금=20000000, 재고손실=5000000, 철거=3000000,
      // 퇴직금=5000000, 위약금=1000000, 기타=500000
      expect(result.totalCost).toBe(5000000 + 20000000 + 5000000 + 3000000 + 5000000 + 1000000 + 500000);
    });
  });

  describe('원상복구비', () => {
    it('원상복구비 = deposit * restorationRate / 100', () => {
      const result = calculateShutdownCost({
        deposit: 40000000,
        restorationRate: 15,
        premiumLoss: 0,
        inventoryBalance: 0,
        inventoryRecoveryRate: 0,
        demolitionCost: 0,
        employeeSalary: 0,
        employeeTenure: 0,
        leasePenalty: 0,
        miscCost: 0,
      });
      // 원상복구비 = 40000000 * 0.15 = 6000000
      // items에는 원상복구비만 포함
      expect(result.items[0].label).toBe('원상복구비');
      expect(result.items[0].amount).toBe(6000000);
    });
  });

  describe('재고 처리 손실', () => {
    it('재고 처리 손실 = inventoryBalance * (1 - inventoryRecoveryRate/100)', () => {
      const result = calculateShutdownCost({
        deposit: 0,
        restorationRate: 0,
        premiumLoss: 0,
        inventoryBalance: 10000000,
        inventoryRecoveryRate: 40,
        demolitionCost: 0,
        employeeSalary: 0,
        employeeTenure: 0,
        leasePenalty: 0,
        miscCost: 0,
      });
      // 재고 손실 = 10000000 * 0.6 = 6000000
      const inventoryItem = result.items.find((i) => i.label === '재고 처리 손실');
      expect(inventoryItem?.amount).toBe(6000000);
    });
  });

  describe('퇴직금 계산', () => {
    it('근속 1년 미만이면 퇴직금 0', () => {
      const result = calculateShutdownCost({
        deposit: 0,
        restorationRate: 0,
        premiumLoss: 0,
        inventoryBalance: 0,
        inventoryRecoveryRate: 0,
        demolitionCost: 0,
        employeeSalary: 2500000,
        employeeTenure: 0.8,
        leasePenalty: 0,
        miscCost: 0,
      });
      const severanceItem = result.items.find((i) => i.label === '직원 퇴직금');
      expect(severanceItem).toBeUndefined();
    });

    it('근속 1년 이상이면 퇴직금 = 월급 * 근속연수', () => {
      const result = calculateShutdownCost({
        deposit: 0,
        restorationRate: 0,
        premiumLoss: 0,
        inventoryBalance: 0,
        inventoryRecoveryRate: 0,
        demolitionCost: 0,
        employeeSalary: 3000000,
        employeeTenure: 3,
        leasePenalty: 0,
        miscCost: 0,
      });
      const severanceItem = result.items.find((i) => i.label === '직원 퇴직금');
      expect(severanceItem?.amount).toBe(9000000);
    });
  });

  describe('보증금 반환액', () => {
    it('보증금 반환액 = max(0, deposit - restorationCost)', () => {
      const result = calculateShutdownCost({
        deposit: 30000000,
        restorationRate: 10,
        premiumLoss: 0,
        inventoryBalance: 0,
        inventoryRecoveryRate: 0,
        demolitionCost: 0,
        employeeSalary: 0,
        employeeTenure: 0,
        leasePenalty: 0,
        miscCost: 0,
      });
      // 원상복구비 = 30000000 * 0.1 = 3000000
      // 보증금 반환액 = 30000000 - 3000000 = 27000000
      expect(result.depositReturn).toBe(27000000);
    });

    it('원상복구비 > 보증금이면 반환액 0', () => {
      const result = calculateShutdownCost({
        deposit: 5000000,
        restorationRate: 100,
        premiumLoss: 0,
        inventoryBalance: 0,
        inventoryRecoveryRate: 0,
        demolitionCost: 0,
        employeeSalary: 0,
        employeeTenure: 0,
        leasePenalty: 0,
        miscCost: 0,
      });
      expect(result.depositReturn).toBe(0);
    });
  });

  describe('실질 손실액', () => {
    it('실질 손실액 = totalCost - depositReturn', () => {
      const result = calculateShutdownCost({
        deposit: 30000000,
        restorationRate: 10,
        premiumLoss: 5000000,
        inventoryBalance: 2000000,
        inventoryRecoveryRate: 50,
        demolitionCost: 1000000,
        employeeSalary: 2500000,
        employeeTenure: 2,
        leasePenalty: 0,
        miscCost: 0,
      });
      expect(result.netLoss).toBe(result.totalCost - result.depositReturn);
    });
  });

  describe('0인 항목 필터링', () => {
    it('0인 항목은 items에 포함되지 않음', () => {
      const result = calculateShutdownCost({
        deposit: 20000000,
        restorationRate: 10,
        premiumLoss: 0,
        inventoryBalance: 0,
        inventoryRecoveryRate: 30,
        demolitionCost: 0,
        employeeSalary: 0,
        employeeTenure: 0,
        leasePenalty: 0,
        miscCost: 0,
      });
      // 원상복구비만 > 0
      expect(result.items).toHaveLength(1);
      expect(result.items[0].label).toBe('원상복구비');
    });
  });

  describe('실제 시나리오', () => {
    it('소규모 카페 폐업: 보증금 3000만, 권리금 손실 1000만, 재고 200만(회수율 50%), 철거비 500만, 직원 250만 * 2년', () => {
      const result = calculateShutdownCost({
        deposit: 30000000,
        restorationRate: 10,
        premiumLoss: 10000000,
        inventoryBalance: 2000000,
        inventoryRecoveryRate: 50,
        demolitionCost: 5000000,
        employeeSalary: 2500000,
        employeeTenure: 2,
        leasePenalty: 0,
        miscCost: 500000,
      });
      // 원상복구비 = 3000000
      // 권리금 = 10000000
      // 재고손실 = 1000000
      // 철거비 = 5000000
      // 퇴직금 = 5000000
      // 기타 = 500000
      // totalCost = 24500000
      // depositReturn = 30000000 - 3000000 = 27000000
      // netLoss = 24500000 - 27000000 = -2500000 (이익)
      expect(result.totalCost).toBe(24500000);
      expect(result.depositReturn).toBe(27000000);
      expect(result.netLoss).toBe(-2500000);
    });
  });
});
