'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/** 업종별 원가율 프리셋 */
export const PRESETS = [
  { label: '일반 식당', rate: 33 },
  { label: '카페·음료', rate: 25 },
  { label: '패스트푸드', rate: 30 },
  { label: '베이커리', rate: 40 },
];

/** 표시용 문자열 타입 */
export interface FoodCostDisplayValues {
  ingredientCost: string;
  sellingPrice: string;
  targetCostRate: string;
}

interface FoodCostInputsProps {
  menuName: string;
  targetCostRate: number;
  displayValues: FoodCostDisplayValues;
  onMenuNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (field: 'ingredientCost' | 'sellingPrice') => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTargetRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreset: (rate: number) => void;
  onReset: () => void;
}

/** 원가율 계산기 입력 UI */
export function FoodCostInputs({
  menuName,
  targetCostRate,
  displayValues,
  onMenuNameChange,
  onNumberChange,
  onTargetRateChange,
  onPreset,
  onReset,
}: FoodCostInputsProps) {
  return (
    <>
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 메뉴 이름 */}
        <div>
          <label
            htmlFor="menuName"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            메뉴 이름 (선택)
          </label>
          <input
            id="menuName"
            type="text"
            placeholder="예: 아메리카노"
            value={menuName}
            onChange={onMenuNameChange}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="메뉴 이름 입력"
            maxLength={30}
          />
        </div>

        {/* 식재료 원가 */}
        <div>
          <label
            htmlFor="ingredientCost"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            식재료 원가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="ingredientCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.ingredientCost}
              onChange={onNumberChange('ingredientCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="식재료 원가 입력"
            />
          </div>
        </div>

        {/* 판매가 */}
        <div>
          <label
            htmlFor="sellingPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            판매가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="sellingPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.sellingPrice}
              onChange={onNumberChange('sellingPrice')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="판매가 입력"
            />
          </div>
        </div>

        {/* 목표 원가율 */}
        <div>
          <label
            htmlFor="targetCostRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            목표 원가율
          </label>
          {/* 업종 프리셋 */}
          <div className="mb-2 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onPreset(preset.rate)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  targetCostRate === preset.rate
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`${preset.label} 원가율 ${preset.rate}% 적용`}
              >
                {preset.label} ({preset.rate}%)
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              id="targetCostRate"
              type="text"
              inputMode="decimal"
              placeholder="30"
              value={displayValues.targetCostRate}
              onChange={onTargetRateChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="목표 원가율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>
      </div>

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={onReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>
    </>
  );
}
