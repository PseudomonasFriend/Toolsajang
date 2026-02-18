'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateDiscount } from './calculation';
import { formatNumber, parseNumber, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DiscountInput } from './types';

/** 초기 입력값 */
const initialInput: DiscountInput = {
  originalPrice: 0,
  costPrice: 0,
  discountRate: 0,
};

export default function DiscountCalculator() {
  const [input, setInput] = useState<DiscountInput>(initialInput);
  const [copied, setCopied] = useState(false);

  /** 표시용 문자열 (콤마 포맷) */
  const [displayValues, setDisplayValues] = useState({
    originalPrice: '',
    costPrice: '',
    discountRate: '',
  });

  /** 숫자 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof typeof displayValues, isPercent = false) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        if (isPercent) {
          // 퍼센트 필드는 소수점 허용
          const cleaned = raw.replace(/[^0-9.]/g, '');
          setDisplayValues((prev) => ({ ...prev, [field]: cleaned }));
          setInput((prev) => ({
            ...prev,
            [field]: parseFloat(cleaned) || 0,
          }));
        } else {
          // 원화 필드는 콤마 자동 포맷
          const num = parseNumber(raw);
          setDisplayValues((prev) => ({
            ...prev,
            [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
          }));
          setInput((prev) => ({ ...prev, [field]: num }));
        }
      },
    [],
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues({
      originalPrice: '',
      costPrice: '',
      discountRate: '',
    });
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) — 3개 필드 모두 입력 시 */
  const result = useMemo(() => {
    if (
      input.originalPrice <= 0 ||
      input.costPrice <= 0 ||
      input.discountRate <= 0
    ) {
      return null;
    }
    return calculateDiscount(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = `정상가 ₩${formatNumber(input.originalPrice)} (마진 ${formatPercent(result.originalMarginRate)}) → 할인 후 ₩${formatNumber(result.discountedPrice)} (마진 ${formatPercent(result.discountedMarginRate)}) / 마진 감소 ${formatPercent(result.marginDropRate)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.originalPrice]);

  /** 할인 후 마진이 마이너스인지 여부 */
  const isLoss = result !== null && result.discountedMargin <= 0;

  return (
    <div className="space-y-5">
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
              onChange={handleNumberChange('originalPrice')}
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
              onChange={handleNumberChange('costPrice')}
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
              onChange={handleNumberChange('discountRate', true)}
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
        onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 계산 결과 */}
      {result && (
        <>
          {/* 비교 카드: 정상가 vs 할인 후 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              마진 비교
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* 왼쪽: 정상가 */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-3 text-center text-sm font-semibold text-gray-500">
                  정상가
                </p>
                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-500">판매가</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₩{formatNumber(input.originalPrice)}
                  </p>
                  <p className="text-sm text-gray-500">마진</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₩{formatNumber(result.originalMargin)}
                  </p>
                  <p className="text-sm text-gray-500">마진율</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPercent(result.originalMarginRate)}
                  </p>
                </div>
              </div>

              {/* 오른쪽: 할인 후 */}
              <div
                className={cn(
                  'rounded-lg p-4',
                  isLoss ? 'bg-red-50' : 'bg-blue-50',
                )}
              >
                <p
                  className={cn(
                    'mb-3 text-center text-sm font-semibold',
                    isLoss ? 'text-red-500' : 'text-blue-600',
                  )}
                >
                  할인 후
                </p>
                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-500">할인판매가</p>
                  <p
                    className={cn(
                      'text-xl font-bold',
                      isLoss ? 'text-red-500' : 'text-gray-900',
                    )}
                  >
                    ₩{formatNumber(result.discountedPrice)}
                  </p>
                  <p className="text-sm text-gray-500">마진</p>
                  <p
                    className={cn(
                      'text-lg font-bold',
                      isLoss ? 'text-red-500' : 'text-gray-900',
                    )}
                  >
                    ₩{formatNumber(result.discountedMargin)}
                  </p>
                  <p className="text-sm text-gray-500">마진율</p>
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      isLoss ? 'text-red-500' : 'text-green-600',
                    )}
                  >
                    {formatPercent(result.discountedMarginRate)}
                  </p>
                </div>
              </div>
            </div>

            {/* 할인 금액 정보 */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm text-gray-500">할인 금액</span>
              <span className="text-sm font-medium text-gray-700">
                ₩{formatNumber(result.discountAmount)}
              </span>
            </div>
          </div>

          {/* 핵심 인사이트 카드 */}
          <div
            className={cn(
              'rounded-xl p-5 shadow-sm',
              isLoss ? 'bg-red-50' : 'bg-white',
            )}
          >
            <h2
              className={cn(
                'mb-4 text-base font-bold',
                isLoss ? 'text-red-600' : 'text-gray-900',
              )}
            >
              핵심 인사이트
            </h2>

            {isLoss ? (
              /* 적자 경고 */
              <div className="rounded-lg bg-red-100 p-4 text-center">
                <p className="text-lg font-bold text-red-600">
                  할인하면 적자입니다
                </p>
                <p className="mt-1 text-sm text-red-500">
                  마진 감소액 ₩{formatNumber(result.marginDrop)} (
                  {formatPercent(result.marginDropRate)} 감소)
                </p>
              </div>
            ) : (
              /* 마진 감소 정보 */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">마진 감소액</span>
                  <span className="text-xl font-bold text-red-500">
                    -₩{formatNumber(result.marginDrop)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">마진 감소율</span>
                  <span className="text-lg font-semibold text-red-500">
                    -{formatPercent(result.marginDropRate)}
                  </span>
                </div>

                {result.requiredSalesIncrease > 0 && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-800">
                      같은 이익을 내려면 판매량을{' '}
                      <span className="text-lg font-bold text-amber-600">
                        {formatPercent(result.requiredSalesIncrease)}
                      </span>{' '}
                      더 늘려야 합니다
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 결과 복사 버튼 */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
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
  );
}
