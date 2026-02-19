import type { Tool } from '@/types';
import type { ComponentType } from 'react';

/* === 툴 모듈 import — 새 툴 추가 시 여기에 한 줄 추가 === */
import * as marginCalculator from './margin-calculator';
import * as vatCalculator from './vat-calculator';
import * as breakEvenCalculator from './break-even-calculator';
import * as salaryCalculator from './salary-calculator';
import * as discountCalculator from './discount-calculator';
import * as loanCalculator from './loan-calculator';
import * as deliveryFeeCalculator from './delivery-fee-calculator';
import * as salesTargetCalculator from './sales-target-calculator';
import * as rentRatioCalculator from './rent-ratio-calculator';
import * as discountPriceCalculator from './discount-price-calculator';
import * as qrGenerator from './qr-generator';
import * as ddayCalculator from './dday-calculator';
import * as menuNameIdeas from './menu-name-ideas';
import * as characterCounter from './character-counter';
import * as inventoryTurnover from './inventory-turnover';
import * as unitPriceCalculator from './unit-price-calculator';
import * as rentPerPyeong from './rent-per-pyeong';
import * as foodCostCalculator from './food-cost-calculator';

/** 툴 모듈 타입 */
interface ToolModule {
  meta: Tool;
  seo: { title: string; description: string };
  Component: ComponentType;
}

/** slug → 모듈 맵 */
const toolModules: Record<string, ToolModule> = {
  [marginCalculator.meta.slug]: marginCalculator,
  [vatCalculator.meta.slug]: vatCalculator,
  [breakEvenCalculator.meta.slug]: breakEvenCalculator,
  [salaryCalculator.meta.slug]: salaryCalculator,
  [discountCalculator.meta.slug]: discountCalculator,
  [loanCalculator.meta.slug]: loanCalculator,
  [deliveryFeeCalculator.meta.slug]: deliveryFeeCalculator,
  [salesTargetCalculator.meta.slug]: salesTargetCalculator,
  [rentRatioCalculator.meta.slug]: rentRatioCalculator,
  [discountPriceCalculator.meta.slug]: discountPriceCalculator,
  [qrGenerator.meta.slug]: qrGenerator,
  [ddayCalculator.meta.slug]: ddayCalculator,
  [menuNameIdeas.meta.slug]: menuNameIdeas,
  [characterCounter.meta.slug]: characterCounter,
  [inventoryTurnover.meta.slug]: inventoryTurnover,
  [unitPriceCalculator.meta.slug]: unitPriceCalculator,
  [rentPerPyeong.meta.slug]: rentPerPyeong,
  [foodCostCalculator.meta.slug]: foodCostCalculator,
};

/* === 외부에서 사용하는 함수들 === */

/** 전체 툴 메타 목록 */
export const tools: Tool[] = Object.values(toolModules).map((m) => m.meta);

/** 활성화된 툴만 */
export function getActiveTools(): Tool[] {
  return tools.filter((t) => t.isActive);
}

/** slug로 툴 모듈 조회 */
export function getToolModule(slug: string): ToolModule | undefined {
  return toolModules[slug];
}

/** slug로 툴 메타만 조회 */
export function getToolBySlug(slug: string): Tool | undefined {
  return toolModules[slug]?.meta;
}

/** 모든 slug 목록 (generateStaticParams용) */
export function getAllToolSlugs(): string[] {
  return Object.keys(toolModules);
}
