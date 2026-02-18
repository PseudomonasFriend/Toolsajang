import type { DdayInput, DdayOutput } from './types';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function parseDate(s: string): Date | null {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * D-day 계산: 목표일 - 기준일 (일 단위)
 */
export function calculateDday(input: DdayInput): DdayOutput | null {
  const target = parseDate(input.targetDate);
  if (!target) return null;

  const base = input.baseDate
    ? parseDate(input.baseDate)
    : toDateOnly(new Date());
  if (!base) return null;

  const t = toDateOnly(target).getTime();
  const b = toDateOnly(base).getTime();
  const diffMs = t - b;
  const dday = Math.round(diffMs / (24 * 60 * 60 * 1000));

  const dayOfWeek = DAY_NAMES[target.getDay()];
  let label: string;
  if (dday > 0) label = `D-${dday} (${dday}일 남음)`;
  else if (dday < 0) label = `D+${Math.abs(dday)} (${Math.abs(dday)}일 지남)`;
  else label = 'D-day (오늘)';

  return { dday, dayOfWeek, label };
}

/** 오늘 날짜 YYYY-MM-DD */
export function getTodayString(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}
