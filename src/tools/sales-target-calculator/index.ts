import type { Tool } from '@/types';
import SalesTargetCalculator from './SalesTargetCalculator';

export const meta: Tool = {
  slug: 'sales-target-calculator',
  name: '매출 목표 계산기',
  description: '목표 순이익 달성에 필요한 매출 역산',
  icon: 'Target',
  category: '재무/회계',
  isActive: true,
};

export const seo = {
  title: '매출 목표 계산기 - 필요 매출 역산',
  description:
    '고정비와 목표 순이익, 마진율을 입력하면 필요한 월 매출을 역산합니다. 소상공인·자영업자용 무료 계산기.',
};

export const Component = SalesTargetCalculator;
