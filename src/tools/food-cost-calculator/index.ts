import type { Tool } from '@/types';
import FoodCostCalculator from './FoodCostCalculator';

/** 원가율 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'food-cost-calculator',
  name: '원가율 계산기',
  description: '메뉴 식재료 원가율과 권장 판매가 계산',
  icon: 'UtensilsCrossed',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

/** 원가율 계산기 SEO 메타데이터 */
export const seo = {
  title: '원가율 계산기 - 식음료 F&B 원가율 무료 계산',
  description:
    '메뉴별 식재료 원가와 판매가를 입력하면 원가율과 권장 판매가를 계산합니다. 음식점, 카페, 베이커리 사장님을 위한 필수 원가 관리 도구입니다.',
};

export const Component = FoodCostCalculator;
