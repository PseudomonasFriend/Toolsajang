'use client';

import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';
import type { FoodCostResult as FoodCostResultType } from './types';

/** 진단 색상 맵 */
const diagnosisColors: Record<FoodCostResultType['diagnosisLevel'], string> = {
  good: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
};

interface FoodCostResultProps {
  result: FoodCostResultType;
  menuName: string;
  targetCostRate: number;
  copied: boolean;
  onCopy: () => void;
}

/** 원가율 계산기 결과 UI */
export function FoodCostResult({
  result,
  menuName,
  targetCostRate,
  copied,
  onCopy,
}: FoodCostResultProps) {
  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">
          {menuName ? `${menuName} ` : ''}계산 결과
        </h2>

        <div className="space-y-3">
          {/* 현재 원가율 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">현재 원가율</span>
            <span
              className={cn(
                'text-2xl font-bold',
                result.currentCostRate <= targetCostRate
                  ? 'text-green-600'
                  : result.currentCostRate <= targetCostRate + 10
                    ? 'text-amber-500'
                    : 'text-red-500'
              )}
            >
              {result.currentCostRate}%
            </span>
          </div>

          {/* 원가 이익 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">원가 이익</span>
            <span
              className={cn(
                'text-xl font-bold',
                result.grossProfit >= 0 ? 'text-gray-900' : 'text-red-500'
              )}
            >
              ₩ {formatNumber(result.grossProfit)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">총 이익률</span>
            <span className="text-base font-semibold text-gray-700">
              {result.grossProfitRate}%
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* 권장 판매가 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              권장 판매가 <span className="text-xs text-gray-400">(목표 {targetCostRate}%)</span>
            </span>
            <span className="text-xl font-bold text-blue-600">
              ₩ {formatNumber(result.recommendedPrice)}
            </span>
          </div>
        </div>

        {/* 진단 메시지 */}
        <div className={cn('mt-4 rounded-lg p-3 text-sm font-medium', diagnosisColors[result.diagnosisLevel])}>
          {result.diagnosis}
        </div>

        {/* 결과 복사 */}
        <button
          type="button"
          onClick={onCopy}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          aria-label="계산 결과 복사"
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

      {/* 업종별 적정 원가율 참고 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-gray-900">업종별 적정 원가율</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>일반 식당</span>
            <span className="font-medium text-gray-900">30~35%</span>
          </div>
          <div className="flex justify-between">
            <span>카페·음료</span>
            <span className="font-medium text-gray-900">20~30%</span>
          </div>
          <div className="flex justify-between">
            <span>패스트푸드</span>
            <span className="font-medium text-gray-900">25~35%</span>
          </div>
          <div className="flex justify-between">
            <span>베이커리·제과</span>
            <span className="font-medium text-gray-900">35~45%</span>
          </div>
        </div>
      </div>
    </>
  );
}
