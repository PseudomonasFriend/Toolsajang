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
    '목표일을 입력하면 오늘 기준 D-day와 요일을 즉시 계산합니다. 계약 만료일, 세금 신고 기한, 임대 갱신일 등 중요한 날짜 관리에 활용하세요.',
};

export const Component = DdayCalculator;
