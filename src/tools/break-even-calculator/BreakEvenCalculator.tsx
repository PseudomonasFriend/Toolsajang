'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateBreakEven } from './calculation';
import { formatNumber, parseNumber, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { BreakEvenInput } from './types';

/** 초기 입력값 */
const initialInput: BreakEvenInput = {
  sellingPrice: 0,
  variableCost: 0,
  fixedCost: 0,
};

/** 입력 필드 표시용 타입 */
interface DisplayValues {
  sellingPrice: string;
  variableCost: string;
  fixedCost: string;
}

/** 초기 표시값 */
const initialDisplay: DisplayValues = {
  sellingPrice: '',
  variableCost: '',
  fixedCost: '',
};

export default function BreakEvenCalculator() {
  const [input, setInput] = useState<BreakEvenInput>(initialInput);
  const [copied, setCopied] = useState(false);

  // 표시용 문자열 (콤마 포맷)
  const [displayValues, setDisplayValues] =
    useState<DisplayValues>(initialDisplay);

  /** 숫자 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof DisplayValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = parseNumber(raw);
        setDisplayValues((prev) => ({
          ...prev,
          [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
        }));
        setInput((prev) => ({ ...prev, [field]: num }));
      },
    [],
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues(initialDisplay);
    setCopied(false);
  }, []);

  /** 모든 필드가 입력되었는지 확인 */
  const isAllFilled =
    input.sellingPrice > 0 && input.variableCost > 0 && input.fixedCost > 0;

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (!isAllFilled) return null;
    return calculateBreakEven(input);
  }, [input, isAllFilled]);

  /** 공헌이익 경고 여부 */
  const isWarning = result !== null && result.contributionMargin <= 0;

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result || isWarning) return;
    const text = `손익분기점 ${formatNumber(result.breakEvenQuantity)}개 / BEP 매출 ₩${formatNumber(result.breakEvenRevenue)} / 공헌이익 ₩${formatNumber(result.contributionMargin)} (${formatPercent(result.contributionRate)})`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, isWarning]);

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 상품 판매가 */}
        <div>
          <label
            htmlFor="sellingPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            상품 판매가 <span className="text-red-500">*</span>
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
              onChange={handleNumberChange('sellingPrice')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="상품 판매가 입력"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">개당 판매 가격</p>
        </div>

        {/* 상품당 변동비 */}
        <div>
          <label
            htmlFor="variableCost"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            상품당 변동비 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="variableCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.variableCost}
              onChange={handleNumberChange('variableCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="상품당 변동비 입력"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            원가 + 수수료 + 포장비 등
          </p>
        </div>

        {/* 월 고정비 */}
        <div>
          <label
            htmlFor="fixedCost"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            월 고정비 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="fixedCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.fixedCost}
              onChange={handleNumberChange('fixedCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 고정비 입력"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            임대료 + 인건비 + 공과금 등 (월)
          </p>
        </div>
      </div>

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 계산 결과 */}
      {result && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            계산 결과
          </h2>

          {/* 공헌이익 경고 */}
          {isWarning && (
            <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              판매가가 변동비보다 높아야 합니다
            </div>
          )}

          {/* 정상 결과 */}
          {!isWarning && (
            <>
              {/* 주요 결과 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    손익분기점 수량
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatNumber(result.breakEvenQuantity)}
                    <span className="ml-1 text-base font-medium text-gray-500">
                      개
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">BEP 매출액</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₩ {formatNumber(result.breakEvenRevenue)}
                  </span>
                </div>

                <hr className="border-gray-100" />

                {/* 보조 정보 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">개당 공헌이익</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.contributionMargin)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">공헌이익률</span>
                  <span className="text-sm text-gray-700">
                    {formatPercent(result.contributionRate)}
                  </span>
                </div>
              </div>

              {/* 결과 복사 */}
              <button
                type="button"
                onClick={handleCopy}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                aria-label="계산 결과 클립보드에 복사"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사 완료
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    결과 복사
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
