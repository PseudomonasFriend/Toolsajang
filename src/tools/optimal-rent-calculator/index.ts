import type { Tool } from '@/types';
import OptimalRentCalculator from './OptimalRentCalculator';

export const meta: Tool = {
  slug: 'optimal-rent-calculator',
  name: '적정 임대료 계산기',
  description: '매출·비용 기준으로 감당 가능한 최대 임대료 계산',
  icon: 'Building',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '적정 임대료 계산기 - 내 매출에 맞는 임대료는?',
  description:
    '월 매출, 원가율, 인건비를 입력하면 최대 감당 가능 임대료와 권장 임대료를 계산합니다. 현재 임대료가 적정한지도 바로 확인.',
};

export const Component = OptimalRentCalculator;
