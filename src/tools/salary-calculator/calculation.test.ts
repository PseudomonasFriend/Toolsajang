import { describe, it, expect } from 'vitest';
import { calculateSalary } from './calculation';

describe('급여 계산기 (calculateSalary)', () => {
  // 2025년 기준 요율:
  // 국민연금: 4.5%, 건강보험: 3.545%, 장기요양: 건강보험의 12.95%
  // 고용보험: 0.9%, 소득세: 3%, 지방소득세: 소득세의 10%

  describe('기본 공제 계산', () => {
    it('월급 2000000원에 대한 공제 항목 계산', () => {
      const result = calculateSalary({ monthlySalary: 2000000, dependents: 1 });
      // 국민연금 = round(2000000 * 0.045) = 90000
      expect(result.nationalPensionEmployee).toBe(90000);
      // 건강보험 = round(2000000 * 0.03545) = 70900
      expect(result.healthInsuranceEmployee).toBe(70900);
      // 장기요양 = round(70900 * 0.1295) = 9182 (반올림)
      expect(result.longTermCareEmployee).toBe(Math.round(70900 * 0.1295));
      // 고용보험 = round(2000000 * 0.009) = 18000
      expect(result.employmentInsuranceEmployee).toBe(18000);
      // 소득세 = round(2000000 * 0.03) = 60000
      expect(result.incomeTax).toBe(60000);
      // 지방소득세 = round(60000 * 0.1) = 6000
      expect(result.localIncomeTax).toBe(6000);
    });

    it('공제 합계 = 모든 공제항목의 합', () => {
      const result = calculateSalary({ monthlySalary: 3000000, dependents: 1 });
      const expectedTotal =
        result.nationalPensionEmployee +
        result.healthInsuranceEmployee +
        result.longTermCareEmployee +
        result.employmentInsuranceEmployee +
        result.incomeTax +
        result.localIncomeTax;
      expect(result.totalDeduction).toBe(expectedTotal);
    });

    it('실수령액 = 세전 급여 - 공제 합계', () => {
      const monthlySalary = 2500000;
      const result = calculateSalary({ monthlySalary, dependents: 1 });
      expect(result.netSalary).toBe(monthlySalary - result.totalDeduction);
    });
  });

  describe('사업주 부담금 계산', () => {
    it('국민연금 사업주 부담 = 근로자 부담과 동일 (4.5%)', () => {
      const result = calculateSalary({ monthlySalary: 2000000, dependents: 1 });
      expect(result.nationalPensionEmployer).toBe(result.nationalPensionEmployee);
    });

    it('건강보험 사업주 부담 = 근로자 부담과 동일 (3.545%)', () => {
      const result = calculateSalary({ monthlySalary: 2000000, dependents: 1 });
      expect(result.healthInsuranceEmployer).toBe(result.healthInsuranceEmployee);
    });

    it('총 인건비 = 세전 급여 + 사업주 부담 합계', () => {
      const monthlySalary = 3000000;
      const result = calculateSalary({ monthlySalary, dependents: 1 });
      expect(result.totalLaborCost).toBe(monthlySalary + result.totalEmployerCost);
    });

    it('사업주 부담 합계는 양수', () => {
      const result = calculateSalary({ monthlySalary: 2000000, dependents: 1 });
      expect(result.totalEmployerCost).toBeGreaterThan(0);
    });
  });

  describe('엣지 케이스', () => {
    it('월급 0원이면 모든 항목 0', () => {
      const result = calculateSalary({ monthlySalary: 0, dependents: 1 });
      expect(result.nationalPensionEmployee).toBe(0);
      expect(result.healthInsuranceEmployee).toBe(0);
      expect(result.incomeTax).toBe(0);
      expect(result.totalDeduction).toBe(0);
      expect(result.netSalary).toBe(0);
      expect(result.totalLaborCost).toBe(0);
    });

    it('최저임금 수준 (2100000원) 계산', () => {
      const result = calculateSalary({ monthlySalary: 2100000, dependents: 1 });
      expect(result.netSalary).toBeGreaterThan(0);
      expect(result.netSalary).toBeLessThan(2100000);
      expect(result.totalLaborCost).toBeGreaterThan(2100000);
    });

    it('고액 연봉 (10000000원) 계산', () => {
      const result = calculateSalary({ monthlySalary: 10000000, dependents: 1 });
      // 국민연금 = round(10000000 * 0.045) = 450000
      expect(result.nationalPensionEmployee).toBe(450000);
      expect(result.netSalary).toBeGreaterThan(0);
      expect(result.netSalary).toBeLessThan(10000000);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('소규모 자영업자 직원: 월급 220만원', () => {
      const result = calculateSalary({ monthlySalary: 2200000, dependents: 1 });
      // 공제율 약 12~14% 수준
      const deductionRate = (result.totalDeduction / 2200000) * 100;
      expect(deductionRate).toBeGreaterThan(10);
      expect(deductionRate).toBeLessThan(20);
      expect(result.totalLaborCost).toBeGreaterThan(2200000);
    });

    it('실수령액이 세전보다 작고, 총 인건비보다 세전이 작다', () => {
      const result = calculateSalary({ monthlySalary: 3000000, dependents: 1 });
      expect(result.netSalary).toBeLessThan(3000000);
      expect(result.totalLaborCost).toBeGreaterThan(3000000);
    });
  });
});
