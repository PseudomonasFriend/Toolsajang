import type { Tool } from '@/types';
import LaborCostRatio from './LaborCostRatio';

/** 인건비 비율 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'labor-cost-ratio',
  name: '인건비 비율 계산기',
  description: '매출 대비 인건비 비율과 4대보험 부담금 계산',
  icon: 'Users',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 인건비 비율 계산기 SEO 메타데이터 */
export const seo = {
  title: '인건비 비율 계산기 - 매출 대비 인건비 비율 무료 계산',
  description:
    '월 매출과 직원 급여를 입력하면 인건비 비율, 4대보험 사업주 부담금, 업종별 적정 비율 비교를 즉시 확인합니다.',
};

export const Component = LaborCostRatio;
