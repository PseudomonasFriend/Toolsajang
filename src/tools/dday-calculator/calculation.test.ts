import { describe, it, expect } from 'vitest';
import { calculateDday, getTodayString } from './calculation';

describe('D-day 계산기 (calculateDday)', () => {
  describe('기본 D-day 계산', () => {
    it('목표일이 기준일보다 5일 후이면 dday = 5, D-5', () => {
      const result = calculateDday({
        targetDate: '2026-03-01',
        baseDate: '2026-02-24',
      });
      expect(result).not.toBeNull();
      expect(result!.dday).toBe(5);
      expect(result!.label).toContain('D-5');
      expect(result!.label).toContain('5일 남음');
    });

    it('목표일이 기준일보다 10일 전이면 dday = -10, D+10', () => {
      const result = calculateDday({
        targetDate: '2026-02-10',
        baseDate: '2026-02-20',
      });
      expect(result).not.toBeNull();
      expect(result!.dday).toBe(-10);
      expect(result!.label).toContain('D+10');
      expect(result!.label).toContain('10일 지남');
    });

    it('목표일 = 기준일이면 dday = 0, D-day (오늘)', () => {
      const result = calculateDday({
        targetDate: '2026-02-20',
        baseDate: '2026-02-20',
      });
      expect(result).not.toBeNull();
      expect(result!.dday).toBe(0);
      expect(result!.label).toBe('D-day (오늘)');
    });
  });

  describe('요일 계산', () => {
    it('2026-02-20(금요일)의 dayOfWeek = 금', () => {
      const result = calculateDday({
        targetDate: '2026-02-20',
        baseDate: '2026-02-20',
      });
      expect(result!.dayOfWeek).toBe('금');
    });

    it('2026-02-22(일요일)의 dayOfWeek = 일', () => {
      const result = calculateDday({
        targetDate: '2026-02-22',
        baseDate: '2026-02-20',
      });
      expect(result!.dayOfWeek).toBe('일');
    });

    it('2026-02-21(토요일)의 dayOfWeek = 토', () => {
      const result = calculateDday({
        targetDate: '2026-02-21',
        baseDate: '2026-02-20',
      });
      expect(result!.dayOfWeek).toBe('토');
    });
  });

  describe('기준일 미입력 시 오늘 기준 동작', () => {
    it('baseDate 미입력 시 null이 아닌 결과 반환', () => {
      const result = calculateDday({ targetDate: '2026-12-31' });
      expect(result).not.toBeNull();
    });

    it('baseDate 미입력 시 dday 타입이 number', () => {
      const result = calculateDday({ targetDate: '2026-12-31' });
      expect(typeof result!.dday).toBe('number');
    });
  });

  describe('유효하지 않은 날짜 처리', () => {
    it('잘못된 목표일이면 null 반환', () => {
      const result = calculateDday({ targetDate: 'invalid-date', baseDate: '2026-02-20' });
      expect(result).toBeNull();
    });

    it('빈 문자열 목표일이면 null 반환', () => {
      const result = calculateDday({ targetDate: '', baseDate: '2026-02-20' });
      expect(result).toBeNull();
    });

    it('잘못된 기준일이면 null 반환', () => {
      const result = calculateDday({ targetDate: '2026-02-20', baseDate: 'not-a-date' });
      expect(result).toBeNull();
    });
  });

  describe('큰 날짜 범위', () => {
    it('365일 차이 계산', () => {
      const result = calculateDday({
        targetDate: '2027-02-20',
        baseDate: '2026-02-20',
      });
      expect(result!.dday).toBe(365);
    });

    it('오래 지난 날짜 (과거 1년)', () => {
      const result = calculateDday({
        targetDate: '2025-02-20',
        baseDate: '2026-02-20',
      });
      expect(result!.dday).toBe(-365);
    });
  });
});

describe('getTodayString', () => {
  it('YYYY-MM-DD 형식 문자열 반환', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('오늘 날짜와 일치하는 문자열 반환', () => {
    const today = getTodayString();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    expect(today).toBe(`${year}-${month}-${day}`);
  });
});
