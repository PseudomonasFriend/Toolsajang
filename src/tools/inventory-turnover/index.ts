import type { Tool } from '@/types';
import InventoryTurnover from './InventoryTurnover';

/** 재고 회전율 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'inventory-turnover',
  name: '재고 회전율 계산기',
  description: '재고가 얼마나 빨리 소진되는지 계산',
  icon: 'RefreshCw',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

/** 재고 회전율 계산기 SEO 메타데이터 */
export const seo = {
  title: '재고 회전율 계산기 - 재고 보유 일수 무료 계산',
  description:
    '매출원가와 평균 재고금액으로 재고 회전율과 재고 보유 일수를 계산합니다. 재고 과잉·부족 진단으로 소상공인 재고 관리를 돕습니다.',
};

export const Component = InventoryTurnover;
