import type { Tool } from '@/types';
import RentRatioCalculator from './RentRatioCalculator';

export const meta: Tool = {
  slug: 'rent-ratio-calculator',
  name: '임대료 비율 계산기',
  description: '매출 대비 임대료가 몇 %인지 한눈에',
  icon: 'Building2',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '임대료 비율 계산기 - 매출 대비 임대료 %',
  description:
    '월 매출과 월 임대료를 입력하면 매출 대비 임대료 비율을 계산합니다. 적정 비율 안내.',
};

export const Component = RentRatioCalculator;
