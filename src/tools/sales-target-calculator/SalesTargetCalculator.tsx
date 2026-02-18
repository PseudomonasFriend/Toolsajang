'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateSalesTarget } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { SalesTargetInput } from './types';

const initialInput: SalesTargetInput = {
  fixedCost: 0,
  targetProfit: 0,
  marginRate: 0,
};

export default function SalesTargetCalculator() {
  const [fixedCost, setFixedCost] = useState(0);
  const [targetProfit, setTargetProfit] = useState(0);
  const [marginRate, setMarginRate] = useState(0);
  const [dispFixed, setDispFixed] = useState('');
  const [dispProfit, setDispProfit] = useState('');
  const [dispRate, setDispRate] = useState('');

  const handleFixed = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setFixedCost(num);
    setDispFixed(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
  }, []);
  const handleProfit = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setTargetProfit(num);
    setDispProfit(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
  }, []);
  const handleRate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw) || 0;
    setMarginRate(num);
    setDispRate(raw);
  }, []);

  const handleReset = useCallback(() => {
    setFixedCost(0);
    setTargetProfit(0);
    setMarginRate(0);
    setDispFixed('');
    setDispProfit('');
    setDispRate('');
  }, []);

  const result = useMemo(() => {
    if (marginRate <= 0 || marginRate > 100) return null;
    return calculateSalesTarget({ fixedCost, targetProfit, marginRate });
  }, [fixedCost, targetProfit, marginRate]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            월 고정비 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={dispFixed}
              onChange={handleFixed}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 고정비 입력"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            목표 순이익 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={dispProfit}
              onChange={handleProfit}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="목표 순이익 입력"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            마진율 (%) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 30"
              value={dispRate}
              onChange={handleRate}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="마진율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">매출 대비 순이익 비율 (예: 30이면 30%)</p>
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

      {result && result.requiredSales > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-gray-900">📊 계산 결과</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">필요 매출 (월)</span>
              <span className="text-xl font-bold text-blue-600">
                ₩{formatNumber(result.requiredSales)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">고정비 + 목표 순이익</span>
              <span className="font-semibold text-gray-900">
                ₩{formatNumber(result.breakEvenAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
