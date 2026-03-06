'use client';

import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { MarginInput } from './types';

/** 표시용 문자열 타입 */
export interface MarginDisplayValues {
  sellingPrice: string;
  costPrice: string;
  shippingCost: string;
  otherCost: string;
  commissionRate: string;
}

interface MarginInputsProps {
  input: MarginInput;
  displayValues: MarginDisplayValues;
  isExtraOpen: boolean;
  onNumberChange: (field: keyof MarginDisplayValues, isPercent?: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVATToggle: () => void;
  onToggleExtra: () => void;
  onReset: () => void;
}

/** 마진 계산기 입력 UI */
export function MarginInputs({
  input,
  displayValues,
  isExtraOpen,
  onNumberChange,
  onVATToggle,
  onToggleExtra,
  onReset,
}: MarginInputsProps) {
  return (
    <>
      {/* 필수 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 판매가 */}
        <div>
          <label
            htmlFor="sellingPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            판매가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="sellingPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.sellingPrice}
              onChange={onNumberChange('sellingPrice')}
              className="h-12 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-lg font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="판매가 입력"
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
              className="h-12 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-lg font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="매입 원가 입력"
            />
          </div>
        </div>
      </div>

      {/* 추가 비용 (접이식) */}
      <div className="rounded-xl bg-white shadow-sm">
        <button
          type="button"
          onClick={onToggleExtra}
          className="flex h-12 w-full items-center justify-between px-5 text-sm font-semibold text-gray-700"
          aria-expanded={isExtraOpen}
          aria-controls="extra-cost-section"
        >
          <span>추가 비용 (선택)</span>
          {isExtraOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExtraOpen && (
          <div
            id="extra-cost-section"
            className="space-y-4 border-t border-gray-100 px-5 pb-5 pt-4"
          >
            {/* 수수료율 */}
            <div>
              <label
                htmlFor="commissionRate"
                className="mb-1.5 block text-sm text-gray-600"
              >
                마켓/카드 수수료
              </label>
              <div className="relative">
                <input
                  id="commissionRate"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={displayValues.commissionRate}
                  onChange={onNumberChange('commissionRate', true)}
                  className="h-11 w-full rounded-xl border border-gray-200 pl-3 pr-8 text-base font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="수수료율 입력"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>

            {/* 배송비 */}
            <div>
              <label
                htmlFor="shippingCost"
                className="mb-1.5 block text-sm text-gray-600"
              >
                배송비
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                <input
                  id="shippingCost"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayValues.shippingCost}
                  onChange={onNumberChange('shippingCost')}
                  className="h-11 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-base font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="배송비 입력"
                />
              </div>
            </div>

            {/* 기타비용 */}
            <div>
              <label
                htmlFor="otherCost"
                className="mb-1.5 block text-sm text-gray-600"
              >
                포장비/기타 비용
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                <input
                  id="otherCost"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayValues.otherCost}
                  onChange={onNumberChange('otherCost')}
                  className="h-11 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-base font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="기타 비용 입력"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 부가세 토글 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={input.includeVAT}
            onChange={onVATToggle}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label="판매가에 부가세 10% 포함 여부"
          />
          <span className="text-sm text-gray-700">
            판매가에 부가세(10%) 포함
          </span>
        </label>
      </div>

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={onReset}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>
    </>
  );
}
