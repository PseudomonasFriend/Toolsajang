'use client';

import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

/** 표시용 문자열 타입 */
export interface DeliveryFeeDisplayValues {
  menuPrice: string;
  menuCost: string;
  deliveryFee: string;
  additionalCost: string;
}

interface DeliveryFeeInputsProps {
  displayValues: DeliveryFeeDisplayValues;
  isExtraOpen: boolean;
  onNumberChange: (field: keyof DeliveryFeeDisplayValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExtra: () => void;
  onReset: () => void;
}

/** 배달앱 수수료 계산기 입력 UI */
export function DeliveryFeeInputs({
  displayValues,
  isExtraOpen,
  onNumberChange,
  onToggleExtra,
  onReset,
}: DeliveryFeeInputsProps) {
  return (
    <>
      {/* 필수 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 메뉴 판매가 */}
        <div>
          <label
            htmlFor="menuPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            메뉴 판매가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="menuPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.menuPrice}
              onChange={onNumberChange('menuPrice')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="메뉴 판매가 입력"
            />
          </div>
        </div>

        {/* 메뉴 원가 */}
        <div>
          <label
            htmlFor="menuCost"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            메뉴 원가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="menuCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.menuCost}
              onChange={onNumberChange('menuCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="메뉴 원가 입력"
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
            {/* 배달비 (고객 부담) */}
            <div>
              <label
                htmlFor="deliveryFee"
                className="mb-1.5 block text-sm text-gray-600"
              >
                배달비 (고객 부담)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                <input
                  id="deliveryFee"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayValues.deliveryFee}
                  onChange={onNumberChange('deliveryFee')}
                  className="h-11 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="배달비 입력"
                />
              </div>
            </div>

            {/* 추가 비용 (포장비 등) */}
            <div>
              <label
                htmlFor="additionalCost"
                className="mb-1.5 block text-sm text-gray-600"
              >
                추가 비용 (포장비 등)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                <input
                  id="additionalCost"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayValues.additionalCost}
                  onChange={onNumberChange('additionalCost')}
                  className="h-11 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="추가 비용 입력"
                />
              </div>
            </div>
          </div>
        )}
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
