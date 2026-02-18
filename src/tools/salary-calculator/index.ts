import type { Tool } from '@/types';
import SalaryCalculator from './SalaryCalculator';

/** 직원 급여 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'salary-calculator',
  name: '직원 급여 계산기',
  description: '4대보험 포함 실수령액 계산',
  icon: 'Users',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 직원 급여 계산기 SEO 메타데이터 */
export const seo = {
  title: '직원 급여 계산기 - 4대보험 실수령액 계산',
  description:
    '월 급여를 입력하면 4대보험 공제 후 실수령액과 사업주 부담금을 즉시 계산합니다.',
};

export const Component = SalaryCalculator;
