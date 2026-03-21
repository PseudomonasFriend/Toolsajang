import type { Tool } from '@/types';
import HourlyWageCalculator from './HourlyWageCalculator';

/** 시급 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'hourly-wage-calculator',
  name: '시급 계산기',
  description: '시급으로 일급·월급·주휴수당·4대보험 한번에',
  icon: 'Clock',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 시급 계산기 SEO 메타데이터 */
export const seo = {
  title: '시급 계산기 - 월급·주휴수당·4대보험 자동 계산',
  description:
    '시급을 입력하면 일급, 주급, 월 통상임금, 주휴수당, 4대보험 공제액, 사업주 부담 총 인건비까지 자동으로 계산합니다.',
};

export const Component = HourlyWageCalculator;
