'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Copy, Check } from 'lucide-react';
import { calculateDeliveryFee, findBestPlatformIndex, PLATFORM_PRESETS } from './calculation';
import { formatNumber, parseNumber, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DeliveryFeeInput } from './types';

/** 초기 입력값 */
const initialInput: DeliveryFeeInput = {
  menuPrice: 0,
  menuCost: 0,
  deliveryFee: 0,
  additionalCost: 0,
};

/** 초기 표시 문자열 */
const initialDisplay = {
  menuPrice: '',
  menuCost: '',
  deliveryFee: '',
  additionalCost: '',
};

export default function DeliveryFeeCalculator() {
  const [input, setInput] = useState<DeliveryFeeInput>(initialInput);
  const [customRate, setCustomRate] = useState(0);
  const [customRateDisplay, setCustomRateDisplay] = useState('');
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // 표시용 문자열 (콤마 포맷)
  const [displayValues, setDisplayValues] = useState(initialDisplay);

  /** 원화 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof typeof initialDisplay) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = parseNumber(raw);
        setDisplayValues((prev) => ({
          ...prev,
          [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
        }));
        setInput((prev) => ({ ...prev, [field]: num }));
      },
    []
  );

  /** 직접 입력 수수료율 변경 핸들러 */
  const handleCustomRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.replace(/[^0-9.]/g, '');
      setCustomRateDisplay(cleaned);
      setCustomRate(parseFloat(cleaned) || 0);
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues(initialDisplay);
    setCustomRate(0);
    setCustomRateDisplay('');
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) */
  const results = useMemo(() => {
    if (input.menuPrice <= 0 && input.menuCost <= 0) return null;
    return calculateDeliveryFee(input, customRate);
  }, [input, customRate]);

  /** 가장 유리한 플랫폼 인덱스 */
  const bestIndex = useMemo(() => {
    if (!results) return -1;
    return findBestPlatformIndex(results);
  }, [results]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!results) return;

    // 배민, 쿠팡, 요기요 순이익만 포함 (직접 입력 제외)
    const platformTexts = results
      .filter((r) => r.platformId !== 'custom')
      .map((r) => {
        const shortName =
          r.platformId === 'baemin'
            ? '배민'
            : r.platformId === 'coupang'
              ? '쿠팡'
              : '요기요';
        return `${shortName} 순이익 ₩${formatNumber(r.netProfit)}`;
      });

    const text = `메뉴 ₩${formatNumber(input.menuPrice)} / ${platformTexts.join(' / ')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [results, input.menuPrice]);

  return (
    <div className="space-y-5">
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
              onChange={handleNumberChange('menuPrice')}
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
              onChange={handleNumberChange('menuCost')}
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
          onClick={() => setIsExtraOpen(!isExtraOpen)}
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
                  onChange={handleNumberChange('deliveryFee')}
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
                  onChange={handleNumberChange('additionalCost')}
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
        onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 플랫폼 비교 결과 */}
      {results && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">
            플랫폼별 비교 결과
          </h2>

          {results.map((result, index) => {
            const isBest = index === bestIndex;
            const isLoss = result.netProfit < 0;
            const isCustom = result.platformId === 'custom';

            return (
              <div
                key={result.platformId}
                className={cn(
                  'relative rounded-xl bg-white p-5 shadow-sm',
                  isBest
                    ? 'border-2 border-blue-500'
                    : 'border border-gray-200'
                )}
              >
                {/* 가장 유리 뱃지 */}
                {isBest && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-bold text-white">
                    가장 유리
                  </span>
                )}

                {/* 플랫폼명 + 수수료율 */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">
                    {result.platformName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    수수료 {formatPercent(result.commissionRate)}
                  </span>
                </div>

                {/* 직접 입력 카드에는 수수료율 입력 필드 */}
                {isCustom && (
                  <div className="mb-3">
                    <label
                      htmlFor="customRate"
                      className="mb-1 block text-xs text-gray-500"
                    >
                      수수료율 직접 입력
                    </label>
                    <div className="relative">
                      <input
                        id="customRate"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={customRateDisplay}
                        onChange={handleCustomRateChange}
                        className="h-10 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-base text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label="직접 입력 수수료율"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        %
                      </span>
                    </div>
                  </div>
                )}

                {/* 수수료 금액 */}
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-500">수수료 금액</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.commissionAmount)}
                  </span>
                </div>

                {/* 실수령액 */}
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-500">실수령액</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.netRevenue)}
                  </span>
                </div>

                <hr className="my-2 border-gray-100" />

                {/* 순이익 (가장 크게) */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    순이익
                  </span>
                  <span
                    className={cn(
                      'text-xl font-bold',
                      isLoss ? 'text-red-500' : 'text-gray-900'
                    )}
                  >
                    ₩ {formatNumber(result.netProfit)}
                  </span>
                </div>

                {/* 순이익률 */}
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">순이익률</span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      isLoss ? 'text-red-500' : 'text-green-600'
                    )}
                  >
                    {formatPercent(result.profitRate)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 안내 문구 */}
          <p className="text-xs text-gray-400">
            실제 수수료는 광고 상품, 계약 조건에 따라 다를 수 있습니다
          </p>

          {/* 결과 복사 */}
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
        </div>
      )}
    </div>
  );
}
