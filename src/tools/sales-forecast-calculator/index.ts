import type { Tool } from '@/types';
import SalesForecastCalculator from './SalesForecastCalculator';

/** 매출예측 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'sales-forecast-calculator',
  name: '매출예측 계산기',
  description: '좌석 회전율·유동인구·업종 평균 3가지 방식으로 예상 매출 계산',
  icon: 'TrendingUp',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

/** 매출예측 계산기 SEO 메타데이터 */
export const seo = {
  title: '매출예측 계산기 - 창업 예상 매출 무료 시뮬레이션',
  description:
    '좌석 회전율, 유동인구, 업종 평균 3가지 방식으로 일·월·연 예상 매출을 시뮬레이션합니다. 창업 전 매출 타당성 검증에 활용하세요.',
};

export const Component = SalesForecastCalculator;
