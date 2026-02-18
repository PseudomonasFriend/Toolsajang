import type { Tool } from '@/types';
import DeliveryFeeCalculator from './DeliveryFeeCalculator';

/** 배달앱 수수료 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'delivery-fee-calculator',
  name: '배달앱 수수료 계산기',
  description: '배달앱별 수수료 비교하고 실수령액 확인',
  icon: 'Bike',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

/** 배달앱 수수료 계산기 SEO 메타데이터 */
export const seo = {
  title: '배달앱 수수료 계산기 - 배민/쿠팡이츠/요기요 비교',
  description:
    '배달앱 플랫폼별 수수료를 비교하고 메뉴 하나 팔았을 때 실수령액과 순이익을 계산합니다.',
};

export const Component = DeliveryFeeCalculator;
