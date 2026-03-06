import type { Tool } from '@/types';
import DeliveryProfitCalculator from './DeliveryProfitCalculator';

/** 배달 순이익 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'delivery-profit-calculator',
  name: '배달 순이익 계산기',
  description: '배달앱 주문의 수수료·원가 차감 후 순이익 계산',
  icon: 'Bike',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

/** 배달 순이익 계산기 SEO 메타데이터 */
export const seo = {
  title: '배달 순이익 계산기 - 배민·요기요·쿠팡이츠 순이익 무료 계산',
  description:
    '배달앱 주문금액에서 앱 수수료, 결제 수수료, 원가, 배달비를 차감한 실제 순이익과 순이익률을 계산합니다.',
};

export const Component = DeliveryProfitCalculator;
