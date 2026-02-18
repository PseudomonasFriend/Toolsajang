'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateRentRatio } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { RentRatioOutput } from './types';

export default function RentRatioCalculator() {
  const [sales, setSales] = useState(0);
  const [rent, setRent] = useState(0);
  const [dispSales, setDispSales] = useState('');
  const [dispRent, setDispRent] = useState('');

  const handleSales = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setSales(num);
    setDispSales(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
  }, []);
  const handleRent = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setRent(num);
    setDispRent(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
  }, []);

  const handleReset = useCallback(() => {
    setSales(0);
    setRent(0);
    setDispSales('');
    setDispRent('');
  }, []);

  const result = useMemo((): RentRatioOutput | null => {
    if (sales <= 0) return null;
    return calculateRentRatio({ monthlySales: sales, monthlyRent: rent });
  }, [sales, rent]);

  const statusText = result
    ? result.status === 'high'
      ? '⚠️ 비율이 높습니다 (보통 20% 이하 권장)'
      : result.status === 'low'
        ? '✅ 비율이 낮은 편입니다'
        : '✅ 적정 구간(10~20%)입니다'
    : '';

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            월 매출 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={dispSales}
              onChange={handleSales}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 매출 입력"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            월 임대료 (원)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={dispRent}
              onChange={handleRent}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 임대료 입력"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="초기화"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>

      {result && sales > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-gray-900">📊 계산 결과</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">임대료 비율</span>
              <span className="text-xl font-bold text-blue-600">
                {result.rentRatio}%
              </span>
            </div>
            {statusText && (
              <p className={result.status === 'high' ? 'text-sm text-red-600' : 'text-sm text-gray-600'}>
                {statusText}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
