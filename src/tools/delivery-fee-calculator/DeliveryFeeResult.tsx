'use client';

import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercent } from '@/lib/format';
import type { PlatformResult } from './types';

interface DeliveryFeeResultProps {
  results: PlatformResult[];
  bestIndex: number;
  customRateDisplay: string;
  copied: boolean;
  onCustomRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopy: () => void;
}

/** 배달앱 수수료 계산기 결과 UI */
export function DeliveryFeeResult({
  results,
  bestIndex,
  customRateDisplay,
  copied,
  onCustomRateChange,
  onCopy,
}: DeliveryFeeResultProps) {
  return (
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
                    onChange={onCustomRateChange}
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
        onClick={onCopy}
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
  );
}
