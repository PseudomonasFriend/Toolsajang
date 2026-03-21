'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateOptimalRent, INDUSTRY_BENCHMARKS } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { OptimalRentOutput } from './types';

/** 초기 입력 표시값 */
interface DisplayValues {
  monthlySales: string;
  laborCost: string;
  otherFixedCost: string;
  currentRent: string;
}

const initialDisplay: DisplayValues = {
  monthlySales: '',
  laborCost: '',
  otherFixedCost: '',
  currentRent: '',
};

export default function OptimalRentCalculator() {
  const [monthlySales, setMonthlySales] = useState(0);
  const [costRate, setCostRate] = useState(30);
  const [laborCost, setLaborCost] = useState(0);
  const [otherFixedCost, setOtherFixedCost] = useState(0);
  const [currentRent, setCurrentRent] = useState(0);
  const [display, setDisplay] = useState<DisplayValues>(initialDisplay);

  /** 금액 필드 변경 핸들러 */
  const handleAmountChange = useCallback(
    (
      setter: (v: number) => void,
      field: keyof DisplayValues,
    ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseNumber(e.target.value);
        setter(num);
        setDisplay((prev) => ({
          ...prev,
          [field]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
        }));
      },
    [],
  );

  /** 원가율 슬라이더 변경 */
  const handleCostRate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCostRate(Number(e.target.value));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setMonthlySales(0);
    setCostRate(30);
    setLaborCost(0);
    setOtherFixedCost(0);
    setCurrentRent(0);
    setDisplay(initialDisplay);
  }, []);

  /** 계산 결과 (monthlySales > 0 이면 실시간 계산) */
  const result = useMemo((): OptimalRentOutput | null => {
    if (monthlySales <= 0) return null;
    return calculateOptimalRent({
      monthlySales,
      costRate,
      laborCost,
      otherFixedCost,
      currentRent,
    });
  }, [monthlySales, costRate, laborCost, otherFixedCost, currentRent]);

  /** rentStatus 색상·텍스트 */
  const statusConfig = useMemo(() => {
    if (!result?.rentStatus) return null;
    switch (result.rentStatus) {
      case 'safe':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: '적정' };
      case 'caution':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '주의' };
      case 'danger':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '위험' };
    }
  }, [result?.rentStatus]);

  return (
    <div className="space-y-5">
      {/* 입력 섹션 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 월 매출 */}
        <div>
          <label htmlFor="monthlySales" className="mb-1.5 block text-sm font-semibold text-gray-700">
            월 매출 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="monthlySales"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={display.monthlySales}
              onChange={handleAmountChange(setMonthlySales, 'monthlySales')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 매출 입력"
            />
          </div>
        </div>

        {/* 원가율 슬라이더 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="costRate" className="text-sm font-semibold text-gray-700">
              원가율 (%)
            </label>
            <span className="text-base font-bold text-blue-600">{costRate}%</span>
          </div>
          <input
            id="costRate"
            type="range"
            min={0}
            max={90}
            step={1}
            value={costRate}
            onChange={handleCostRate}
            className="h-2 w-full cursor-pointer accent-blue-600"
            aria-label="원가율 슬라이더"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span className="text-gray-500">식당 30~40% / 카페 25~35%</span>
            <span>90%</span>
          </div>
        </div>

        {/* 인건비 */}
        <div>
          <label htmlFor="laborCost" className="mb-1.5 block text-sm font-semibold text-gray-700">
            인건비 월 합계 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="laborCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={display.laborCost}
              onChange={handleAmountChange(setLaborCost, 'laborCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="인건비 입력"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">본인 인건비 포함</p>
        </div>

        {/* 기타 고정비 */}
        <div>
          <label htmlFor="otherFixedCost" className="mb-1.5 block text-sm font-semibold text-gray-700">
            기타 고정비 (원)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="otherFixedCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={display.otherFixedCost}
              onChange={handleAmountChange(setOtherFixedCost, 'otherFixedCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="기타 고정비 입력"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">공과금·통신비·보험료 등 (임대료 제외)</p>
        </div>

        {/* 현재 임대료 (선택) */}
        <div>
          <label htmlFor="currentRent" className="mb-1.5 block text-sm font-semibold text-gray-700">
            현재 임대료 (원){' '}
            <span className="text-xs font-normal text-gray-400">선택 — 입력 시 비교 분석</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="currentRent"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={display.currentRent}
              onChange={handleAmountChange(setCurrentRent, 'currentRent')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="현재 임대료 입력"
            />
          </div>
        </div>

        {/* 초기화 */}
        <button
          type="button"
          onClick={handleReset}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
          aria-label="입력값 초기화"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>

      {/* 결과 섹션 */}
      {result && (
        <div className="space-y-4">
          {/* 비용 구조 요약 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-gray-900">비용 구조 요약</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">월 매출</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₩ {formatNumber(monthlySales)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">원가 ({costRate}%)</span>
                <span className="text-sm text-gray-700">− ₩ {formatNumber(result.costAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-sm font-medium text-gray-700">매출총이익</span>
                <span className="text-sm font-bold text-gray-900">
                  ₩ {formatNumber(result.grossProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">인건비 + 기타고정비</span>
                <span className="text-sm text-gray-700">− ₩ {formatNumber(result.totalOtherCost)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-sm font-medium text-gray-700">임대료·이익 가용 금액</span>
                <span className="text-base font-bold text-blue-600">
                  ₩ {formatNumber(result.maxAffordableRent)}
                </span>
              </div>
            </div>
          </div>

          {/* 적정 임대료 범위 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-gray-900">적정 임대료 범위</h2>
            <div className="space-y-3">
              {/* 권장 임대료 */}
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">권장 임대료</p>
                    <p className="text-xs text-blue-500">매출의 9% — 안전마진 확보</p>
                  </div>
                  <span className="text-xl font-bold text-blue-700">
                    ₩ {formatNumber(result.recommendedRent)}
                  </span>
                </div>
              </div>

              {/* 안정 임대료 */}
              <div className="rounded-lg bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">안정 임대료</p>
                    <p className="text-xs text-green-500">매출의 10% 이하</p>
                  </div>
                  <span className="text-xl font-bold text-green-700">
                    ₩ {formatNumber(result.stableRent)}
                  </span>
                </div>
              </div>

              {/* 최대 임대료 */}
              <div className="rounded-lg bg-red-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-700">최대 감당 가능 임대료</p>
                    <p className="text-xs text-red-400">이 금액 초과 시 적자</p>
                  </div>
                  <span className="text-xl font-bold text-red-700">
                    ₩ {formatNumber(result.maxAffordableRent)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 현재 임대료 비교 분석 */}
          {result.rentStatus && statusConfig && result.rentMargin !== null && (
            <div className={`rounded-xl border p-5 shadow-sm ${statusConfig.bg} ${statusConfig.border}`}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">현재 임대료 분석</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">현재 임대료</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₩ {formatNumber(currentRent)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">최대 한계까지 여유</span>
                  <span className={`text-sm font-semibold ${result.rentMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.rentMargin >= 0 ? '+' : ''}₩ {formatNumber(result.rentMargin)}
                  </span>
                </div>
                {result.operatingProfitWithCurrentRent !== null && (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm text-gray-600">임대료 차감 후 영업이익</span>
                    <span className={`text-base font-bold ${result.operatingProfitWithCurrentRent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.operatingProfitWithCurrentRent >= 0 ? '' : '− '}₩{' '}
                      {formatNumber(Math.abs(result.operatingProfitWithCurrentRent))}
                    </span>
                  </div>
                )}
                {result.breakEvenSales !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">손익분기 매출</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₩ {formatNumber(result.breakEvenSales)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 업종별 임대료 비율 참고표 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-gray-900">업종별 임대료 비율 참고</h2>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">업종</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">권장 비율</th>
                    {monthlySales > 0 && (
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">월 금액 기준</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {INDUSTRY_BENCHMARKS.map((b, i) => (
                    <tr key={b.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-gray-700">{b.name}</td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        {b.minRate}~{b.maxRate}%
                      </td>
                      {monthlySales > 0 && (
                        <td className="px-3 py-2 text-right text-gray-600">
                          ₩ {formatNumber(Math.round(monthlySales * b.minRate / 100))}
                          {' '}~{' '}
                          {formatNumber(Math.round(monthlySales * b.maxRate / 100))}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
