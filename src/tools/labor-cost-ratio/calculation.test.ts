import { describe, it, expect } from 'vitest';
import { calculateLaborCost } from './calculation';

describe('인건비 비율 계산기 (calculateLaborCost)', () => {
  describe('기본 인건비 비율', () => {
    it('월매출 1000만원, 월급 직원 1명 200만원이면 비율 20%', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.totalSalary).toBe(2000000);
      expect(result.laborCostRatio).toBe(20);
    });

    it('직원 2명이면 합산', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [
          { payType: 'monthly', pay: 2000000, weeklyHours: 40 },
          { payType: 'monthly', pay: 1500000, weeklyHours: 40 },
        ],
        includeInsurance: false,
      });
      expect(result.totalSalary).toBe(3500000);
      expect(result.laborCostRatio).toBe(35);
    });

    it('매출 0이면 비율 0 (ZeroDivision 방지)', () => {
      const result = calculateLaborCost({
        monthlySales: 0,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.laborCostRatio).toBe(0);
    });
  });

  describe('시급 → 월급 변환', () => {
    it('시급 9860원, 주 40시간이면 월급 계산 (주휴수당 포함)', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'hourly', pay: 9860, weeklyHours: 40 }],
        includeInsurance: false,
      });
      // 주휴포함 = 40 + min(8, 40/5) = 40 + 8 = 48시간
      // 월급 = round(9860 * 48 * 4.345)
      const expectedMonthly = Math.round(9860 * 48 * 4.345);
      expect(result.totalSalary).toBe(expectedMonthly);
    });

    it('주 15시간 미만이면 주휴수당 미포함', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'hourly', pay: 10000, weeklyHours: 12 }],
        includeInsurance: false,
      });
      // 주휴 없음 = 12시간
      const expectedMonthly = Math.round(10000 * 12 * 4.345);
      expect(result.totalSalary).toBe(expectedMonthly);
    });
  });

  describe('4대보험 포함', () => {
    it('보험 포함 시 totalLaborCost > totalSalary', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: true,
      });
      expect(result.insuranceCost).toBeGreaterThan(0);
      expect(result.totalLaborCost).toBe(result.totalSalary + result.insuranceCost);
      expect(result.totalLaborCost).toBeGreaterThan(result.totalSalary);
    });

    it('보험 미포함이면 insuranceCost 0', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.insuranceCost).toBe(0);
      expect(result.totalLaborCost).toBe(result.totalSalary);
    });
  });

  describe('진단 등급', () => {
    it('비율 25% 이하면 good', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.diagnosisLevel).toBe('good');
    });

    it('비율 35% 초과면 danger', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [
          { payType: 'monthly', pay: 2000000, weeklyHours: 40 },
          { payType: 'monthly', pay: 2000000, weeklyHours: 40 },
        ],
        includeInsurance: true,
      });
      expect(result.laborCostRatio).toBeGreaterThan(35);
      expect(result.diagnosisLevel).toBe('danger');
    });
  });

  describe('실제 사용 시나리오', () => {
    it('음식점: 월매출 2500만원, 주방장 280만원 + 알바 시급 1만원 주 30시간', () => {
      const result = calculateLaborCost({
        monthlySales: 25000000,
        employees: [
          { payType: 'monthly', pay: 2800000, weeklyHours: 40 },
          { payType: 'hourly', pay: 10000, weeklyHours: 30 },
        ],
        includeInsurance: true,
      });
      expect(result.employeeMonthlySalaries).toHaveLength(2);
      expect(result.totalLaborCost).toBeGreaterThan(0);
      expect(result.laborCostRatio).toBeGreaterThan(0);
    });
  });
});
