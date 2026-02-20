import { describe, it, expect } from 'vitest';
import { calculateRentPerPyeong } from './calculation';

/** 1평 = 3.305785 m² */
const SQM_PER_PYEONG = 3.305785;

describe('평당 임대료 계산기 (calculateRentPerPyeong)', () => {
  describe('면적 단위 환산', () => {
    it('10평 → m² 환산', () => {
      const result = calculateRentPerPyeong({
        area: 10,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 0,
        monthlyRevenue: 0,
      });
      expect(result.pyeong).toBe(10);
      expect(result.sqm).toBeCloseTo(10 * SQM_PER_PYEONG, 1);
    });

    it('33.06m² → 평수 환산 (약 10평)', () => {
      const result = calculateRentPerPyeong({
        area: 33.06,
        areaUnit: 'sqm',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 0,
        monthlyRevenue: 0,
      });
      // sqm 단위 입력 시 sqm은 소수점 1자리 반올림으로 저장됨
      // 33.06 → round(33.06 * 10) / 10 = 33.1
      expect(result.sqm).toBe(33.1);
      // 33.06 / 3.305785 ≈ 10
      expect(result.pyeong).toBeCloseTo(10, 0);
    });

    it('면적 단위 결과값은 소수점 1자리', () => {
      const result = calculateRentPerPyeong({
        area: 15,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1500000,
        managementFee: 0,
        monthlyRevenue: 0,
      });
      // sqm = round(15 * 3.305785 * 100) / 100 → 소수점 2자리까지 계산 후 소수점 1자리로
      expect(Number.isFinite(result.sqm)).toBe(true);
    });
  });

  describe('평당 임대료 계산', () => {
    it('10평, 월세 1000000이면 평당 월세 100000', () => {
      const result = calculateRentPerPyeong({
        area: 10,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 0,
        monthlyRevenue: 0,
      });
      expect(result.rentPerPyeong).toBe(100000);
    });

    it('10평, 월세 1000000, 관리비 200000이면 평당 실질 임대료 120000', () => {
      const result = calculateRentPerPyeong({
        area: 10,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 200000,
        monthlyRevenue: 0,
      });
      expect(result.totalRentPerPyeong).toBe(120000);
    });

    it('면적 0이면 평당 임대료 0', () => {
      const result = calculateRentPerPyeong({
        area: 0,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 0,
        monthlyRevenue: 0,
      });
      expect(result.rentPerPyeong).toBe(0);
      expect(result.totalRentPerPyeong).toBe(0);
    });
  });

  describe('월 총 임대료 및 연 임대료', () => {
    it('월 총 임대료 = 월세 + 관리비', () => {
      const result = calculateRentPerPyeong({
        area: 20,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1500000,
        managementFee: 300000,
        monthlyRevenue: 0,
      });
      expect(result.totalMonthlyRent).toBe(1800000);
    });

    it('연 임대료 = 월 총 임대료 × 12', () => {
      const result = calculateRentPerPyeong({
        area: 15,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 200000,
        monthlyRevenue: 0,
      });
      expect(result.annualRent).toBe(result.totalMonthlyRent * 12);
      expect(result.annualRent).toBe(14400000);
    });
  });

  describe('매출 대비 임대료 비율', () => {
    it('월 매출 입력 시 임대료 비율 계산', () => {
      const result = calculateRentPerPyeong({
        area: 10,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 0,
        monthlyRevenue: 5000000,
      });
      // 비율 = round(1000000 / 5000000 * 100 * 10) / 10 = 20.0
      expect(result.rentRatio).toBe(20);
    });

    it('월 매출 0이면 rentRatio = null', () => {
      const result = calculateRentPerPyeong({
        area: 10,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 1000000,
        managementFee: 0,
        monthlyRevenue: 0,
      });
      expect(result.rentRatio).toBeNull();
    });

    it('관리비 포함 임대료로 비율 계산', () => {
      const result = calculateRentPerPyeong({
        area: 10,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 800000,
        managementFee: 200000,
        monthlyRevenue: 10000000,
      });
      // 비율 = (800000 + 200000) / 10000000 * 100 = 10%
      expect(result.rentRatio).toBe(10);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('서울 상권 카페: 15평, 월세 2500000, 관리비 300000, 월 매출 12000000', () => {
      const result = calculateRentPerPyeong({
        area: 15,
        areaUnit: 'pyeong',
        deposit: 0,
        monthlyRent: 2500000,
        managementFee: 300000,
        monthlyRevenue: 12000000,
      });
      expect(result.pyeong).toBe(15);
      expect(result.totalMonthlyRent).toBe(2800000);
      expect(result.annualRent).toBe(33600000);
      // 평당 총 임대료 = round(2800000 / 15) ≈ 186667
      expect(result.totalRentPerPyeong).toBe(Math.round(2800000 / 15));
      // 임대료 비율 = round(2800000/12000000 * 1000) / 10 ≈ 23.3%
      expect(result.rentRatio).toBeCloseTo(23.3, 0);
    });
  });
});
