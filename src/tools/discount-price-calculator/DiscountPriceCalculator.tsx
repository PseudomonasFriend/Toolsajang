'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateDiscountPrice } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';

export default function DiscountPriceCalculator() {
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [dispPrice, setDispPrice] = useState('');
  const [dispRate, setDispRate] = useState('');

  const handlePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setOriginalPrice(num);
    setDispPrice(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
  }, []);
  const handleRate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw) || 0;
    setDiscountRate(num);
    setDispRate(raw);
  }, []);

  const handleReset = useCallback(() => {
    setOriginalPrice(0);
    setDiscountRate(0);
    setDispPrice('');
    setDispRate('');
  }, []);

  const result = useMemo(() => {
    if (originalPrice <= 0) return null;
    return calculateDiscountPrice({ originalPrice, discountRate });
  }, [originalPrice, discountRate]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            정가 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={dispPrice}
              onChange={handlePrice}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="정가 입력"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            할인율 (%) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="예: 20"
              value={dispRate}
              onChange={handleRate}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="할인율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
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

      {result && originalPrice > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-gray-900">📊 계산 결과</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">할인 금액</span>
              <span className="font-semibold text-gray-900">
                -₩{formatNumber(result.discountAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">할인가</span>
              <span className="text-xl font-bold text-blue-600">
                ₩{formatNumber(result.discountedPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
