'use client';

import { RotateCcw } from 'lucide-react';

/** 표시용 문자열 타입 */
export interface DiscountDisplayValues {
  originalPrice: string;
  costPrice: string;
  discountRate: string;
}

interface DiscountInputsProps {
  displayValues: DiscountDisplayValues;
  onNumberChange: (field: keyof DiscountDisplayValues, isPercent?: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

/** 할인율 계산기 입력 UI */
export function DiscountInputs({
  displayValues,
  onNumberChange,
  onReset,
}: DiscountInputsProps) {
  return (
    <>
      {/* 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 정상 판매가 */}
        <div>
          <label
            htmlFor="originalPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            정상 판매가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="originalPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.originalPrice}
              onChange={onNumberChange('originalPrice')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="정상 판매가 입력"
            />
          </div>
        </div>

        {/* 매입 원가 */}
        <div>
          <label
            htmlFor="costPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            매입 원가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="costPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.costPrice}
              onChange={onNumberChange('costPrice')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="매입 원가 입력"
            />
          </div>
        </div>

        {/* 할인율 */}
        <div>
          <label
            htmlFor="discountRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            할인율 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="discountRate"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={displayValues.discountRate}
              onChange={onNumberChange('discountRate', true)}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="할인율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              %
            </span>
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
