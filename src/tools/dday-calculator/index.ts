import type { Tool } from '@/types';
import DdayCalculator from './DdayCalculator';

export const meta: Tool = {
  slug: 'dday-calculator',
  name: 'D-day / 기간 계산기',
  description: '목표일까지 며칠 남았는지 한눈에',
  icon: 'CalendarDays',
  category: '유틸리티',
  isActive: true,
};

export const seo = {
  title: 'D-day 기간 계산기 - 며칠 남았는지 계산',
  description:
    '목표일을 입력하면 오늘 기준 D-day(며칠 남았는지/지났는지)와 요일을 표시합니다.',
};

export const Component = DdayCalculator;
