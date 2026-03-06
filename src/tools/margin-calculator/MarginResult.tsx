'use client';

import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercent } from '@/lib/format';
import type { MarginOutput } from './types';

interface MarginResultProps {
  result: MarginOutput;
  isLoss: boolean;
  copied: boolean;
  onCopy: () => void;
}

/** 마진 계산기 결과 UI */
export function MarginResult({ result, isLoss, copied, onCopy }: MarginResultProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-gray-900">
        계산 결과
      </h2>

      {/* 적자 경고 */}
      {isLoss && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          적자입니다. 판매가 또는 비용을 조정해 보세요.
        </div>
      )}

      {/* 주요 결과 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">순이익</span>
          <span
            className={cn(
              'text-2xl font-bold',
              isLoss ? 'text-red-500' : 'text-gray-900'
            )}
          >
            ₩ {formatNumber(result.netProfit)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">마진율</span>
          <span
            className={cn(
              'text-lg font-semibold',
              isLoss ? 'text-red-500' : 'text-green-600'
            )}
          >
            {formatPercent(result.marginRate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">마크업률</span>
          <span
            className={cn(
              'text-lg font-semibold',
              isLoss ? 'text-red-500' : 'text-green-600'
            )}
          >
            {formatPercent(result.markupRate)}
          </span>
        </div>

        <hr className="border-gray-100" />

        {/* 보조 정보 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">수수료 금액</span>
          <span className="text-sm text-gray-700">
            ₩ {formatNumber(result.commissionAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">부가세</span>
          <span className="text-sm text-gray-700">
            ₩ {formatNumber(result.vatAmount)}
          </span>
        </div>
      </div>

      {/* 결과 복사 */}
      <button
        type="button"
        onClick={onCopy}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow active:scale-[0.98]"
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
