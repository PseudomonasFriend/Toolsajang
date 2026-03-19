import { describe, it, expect } from 'vitest';
import { calculateLaborCost } from './calculation';

describe('인건비 비율 계산기 (calculateLaborCost)', () => {
  describe('월급제 직원 계산', () => {
    it('월급 200만원, 매출 1000만원 → 인건비 비율 20%, 적정 수준', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.totalSalary).toBe(2000000);
      expect(result.laborCostRatio).toBe(20);
      expect(result.diagnosisLevel).toBe('good');
      expect(result.insuranceCost).toBe(0);
    });

    it('직원 2명 월급 합산', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [
          { payType: 'monthly', pay: 2000000, weeklyHours: 40 },
          { payType: 'monthly', pay: 1500000, weeklyHours: 40 },
        ],
        includeInsurance: false,
      });
      expect(result.totalSalary).toBe(3500000);
      expect(result.employeeMonthlySalaries).toEqual([2000000, 1500000]);
    });
  });

  describe('시급제 직원 계산 (주휴수당 포함)', () => {
    it('시급 1만원, 주40시간 → 주휴수당 포함 월급 계산', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'hourly', pay: 10000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      // paidWeeklyHours = 40 + min(8, 40/5) = 40 + 8 = 48
      // monthlyHours = 48 * 4.345 = 208.56
      // monthlySalary = round(10000 * 208.56) = 2085600
      expect(result.employeeMonthlySalaries[0]).toBeGreaterThan(2000000);
    });

    it('주 14시간 미만이면 주휴수당 미포함', () => {
      const withoutJuHyu = calculateLaborCost({
        monthlySales: 5000000,
        employees: [{ payType: 'hourly', pay: 10000, weeklyHours: 10 }],
        includeInsurance: false,
      });
      const withJuHyu = calculateLaborCost({
        monthlySales: 5000000,
        employees: [{ payType: 'hourly', pay: 10000, weeklyHours: 20 }],
        includeInsurance: false,
      });
      expect(withoutJuHyu.employeeMonthlySalaries[0]).toBeLessThan(
        withJuHyu.employeeMonthlySalaries[0]
      );
    });
  });

  describe('4대보험 포함 계산', () => {
    it('4대보험 포함 시 총 인건비가 급여보다 많음', () => {
      const withoutInsurance = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      const withInsurance = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: true,
      });
      expect(withInsurance.totalLaborCost).toBeGreaterThan(withoutInsurance.totalLaborCost);
      expect(withInsurance.insuranceCost).toBeGreaterThan(0);
    });
  });

  describe('진단 레벨', () => {
    it('비율 25% 이하 → good', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 2000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.diagnosisLevel).toBe('good');
    });

    it('비율 25~35% → warning', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 3000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.diagnosisLevel).toBe('warning');
    });

    it('비율 35% 초과 → danger', () => {
      const result = calculateLaborCost({
        monthlySales: 10000000,
        employees: [{ payType: 'monthly', pay: 4000000, weeklyHours: 40 }],
        includeInsurance: false,
      });
      expect(result.diagnosisLevel).toBe('danger');
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
});
