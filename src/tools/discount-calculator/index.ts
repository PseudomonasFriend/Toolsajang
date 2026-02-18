import type { Tool } from '@/types';
import DiscountCalculator from './DiscountCalculator';

/** 할인율 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'discount-calculator',
  name: '할인율 계산기',
  description: '할인하면 마진이 얼마나 줄어드는지 비교',
  icon: 'Tag',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 할인율 계산기 SEO 메타데이터 */
export const seo = {
  title: '할인율 계산기 - 할인 시 마진 변화 시뮬레이션',
  description:
    '할인 적용 시 마진이 얼마나 줄어드는지 원래 가격과 비교해 한눈에 확인합니다.',
};

export const Component = DiscountCalculator;
