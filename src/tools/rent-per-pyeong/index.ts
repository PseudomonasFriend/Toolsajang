import type { Tool } from '@/types';
import RentPerPyeong from './RentPerPyeong';

/** 평당 임대료 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'rent-per-pyeong',
  name: '평당 임대료 계산기',
  description: '면적별 월세 단가와 임대료 비율 계산',
  icon: 'Building2',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

/** 평당 임대료 계산기 SEO 메타데이터 */
export const seo = {
  title: '평당 임대료 계산기 - 매장 임대료 무료 계산',
  description:
    '매장 면적(평·m²)과 월세를 입력하면 평당 임대료와 매출 대비 임대료 비율을 계산합니다. 상가 임대 계약 전 필수 확인 도구입니다.',
};

export const Component = RentPerPyeong;
