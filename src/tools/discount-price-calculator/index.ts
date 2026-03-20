import type { Tool } from '@/types';
import DiscountPriceCalculator from './DiscountPriceCalculator';

export const meta: Tool = {
  slug: 'discount-price-calculator',
  name: '할인가 역산 계산기',
  description: '정가와 할인율로 할인가 한 번에',
  icon: 'Percent',
  category: '재무/회계',
  isActive: true,
};

export const seo = {
  title: '할인가 역산 계산기 - 할인율로 할인가 계산',
  description:
    '정가와 할인율(%)을 입력하면 할인 금액과 최종 할인가를 즉시 계산합니다. 시즌 세일, 행사 기획 시 가격표 작성과 태그 가격 산정에 바로 활용하세요.',
};

export const Component = DiscountPriceCalculator;
