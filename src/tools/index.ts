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
import * as shopNameIdeas from './shop-name-ideas';

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
  [shopNameIdeas.meta.slug]: shopNameIdeas,
};

/* === 외부에서 사용하는 함수들 === */

/** 전체 툴 메타 목록 */
export const tools: Tool[] = Object.values(toolModules).map((m) => m.meta);

/** 활성화된 툴만 */
export function getActiveTools(): Tool[] {
  return tools.filter((t) => t.isActive);
}

/** slug로 툴 모듈 조회 (비활성 툴은 제외) */
export function getToolModule(slug: string): ToolModule | undefined {
  const mod = toolModules[slug];
  if (!mod || !mod.meta.isActive) return undefined;
  return mod;
}

/** slug로 툴 메타만 조회 (비활성 툴은 제외) */
export function getToolBySlug(slug: string): Tool | undefined {
  const mod = toolModules[slug];
  if (!mod || !mod.meta.isActive) return undefined;
  return mod.meta;
}

/** 활성 slug 목록 (generateStaticParams용) */
export function getAllToolSlugs(): string[] {
  return Object.keys(toolModules).filter((slug) => toolModules[slug].meta.isActive);
}
