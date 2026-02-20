'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateRentPerPyeong } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { RentPerPyeongInput } from './types';

/** 초기 입력값 */
const initialInput: RentPerPyeongInput = {
  area: 0,
  areaUnit: 'pyeong',
  deposit: 0,
  monthlyRent: 0,
  managementFee: 0,
  monthlyRevenue: 0,
};

export default function RentPerPyeong() {
  const [input, setInput] = useState<RentPerPyeongInput>(initialInput);
  const [displayValues, setDisplayValues] = useState({
    area: '',
    deposit: '',
    monthlyRent: '',
    managementFee: '',
    monthlyRevenue: '',
  });

  /** 숫자 입력 핸들러 */
  const handleNumberChange =
    (field: keyof typeof displayValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseNumber(raw);
      setDisplayValues((prev) => ({
        ...prev,
        [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9.]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [field]: num }));
    };

  /** 단위 변경 */
  const handleUnitChange = useCallback(
    (unit: 'pyeong' | 'sqm') => {
      setInput((prev) => ({ ...prev, areaUnit: unit }));
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues({
      area: '',
      deposit: '',
      monthlyRent: '',
      managementFee: '',
      monthlyRevenue: '',
    });
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.area <= 0 || input.monthlyRent <= 0) return null;
    return calculateRentPerPyeong(input);
  }, [input]);

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 면적 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            매장 면적 <span className="text-red-500">*</span>
          </label>

          {/* 단위 토글 */}
          <div className="mb-2 flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => handleUnitChange('pyeong')}
              className={cn(
                'flex-1 py-2 text-sm font-medium transition-colors',
                input.areaUnit === 'pyeong'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
              aria-label="면적 단위 평으로 변경"
            >
              평
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('sqm')}
              className={cn(
                'flex-1 py-2 text-sm font-medium transition-colors',
                input.areaUnit === 'sqm'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
              aria-label="면적 단위 m²으로 변경"
            >
              m²
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={displayValues.area}
              onChange={handleNumberChange('area')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-12 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="매장 면적 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {input.areaUnit === 'pyeong' ? '평' : 'm²'}
            </span>
          </div>
        </div>

        {/* 보증금 */}
        <div>
          <label
            htmlFor="deposit"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            보증금
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="deposit"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.deposit}
              onChange={handleNumberChange('deposit')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="보증금 입력"
            />
          </div>
        </div>

        {/* 월세 */}
        <div>
          <label
            htmlFor="monthlyRent"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            월세 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="monthlyRent"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.monthlyRent}
              onChange={handleNumberChange('monthlyRent')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월세 입력"
            />
          </div>
        </div>

        {/* 관리비 */}
        <div>
          <label
            htmlFor="managementFee"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            관리비 (선택)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="managementFee"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.managementFee}
              onChange={handleNumberChange('managementFee')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="관리비 입력"
            />
          </div>
        </div>

        {/* 월 매출 (선택) */}
        <div>
          <label
            htmlFor="monthlyRevenue"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            월 매출 (선택)
            <span className="ml-1 text-xs font-normal text-gray-400">
              — 임대료 비율 계산용
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="monthlyRevenue"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.monthlyRevenue}
              onChange={handleNumberChange('monthlyRevenue')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 매출 입력"
            />
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
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">계산 결과</h2>

          {/* 면적 환산 */}
          <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">면적 환산</span>
            <span className="text-sm font-medium text-gray-900">
              {result.pyeong}평 = {result.sqm}m²
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">평당 월세</span>
              <span className="text-xl font-bold text-gray-900">
                ₩ {formatNumber(result.rentPerPyeong)}
              </span>
            </div>

            {input.managementFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">평당 실질 임대료</span>
                <span className="text-xl font-bold text-blue-600">
                  ₩ {formatNumber(result.totalRentPerPyeong)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">월 임대료 합계</span>
              <span className="text-lg font-semibold text-gray-900">
                ₩ {formatNumber(result.totalMonthlyRent)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">연 임대료 합계</span>
              <span className="text-lg font-semibold text-gray-900">
                ₩ {formatNumber(result.annualRent)}
              </span>
            </div>

            {result.rentRatio !== null && (
              <>
                <hr className="border-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">매출 대비 임대료 비율</span>
                  <span
                    className={cn(
                      'text-xl font-bold',
                      result.rentRatio <= 10
                        ? 'text-green-600'
                        : result.rentRatio <= 15
                          ? 'text-amber-500'
                          : 'text-red-500'
                    )}
                  >
                    {result.rentRatio}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {result.rentRatio <= 10
                    ? '적정 수준입니다 (10% 이하 권장)'
                    : result.rentRatio <= 15
                      ? '다소 높습니다. 매출 증대를 고민해 보세요.'
                      : '임대료 부담이 높습니다. 임대 조건 재협상을 고려하세요.'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 참고 기준 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-gray-900">적정 임대료 비율 기준</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>식음료·카페</span>
            <span className="font-medium text-gray-900">매출의 7~12%</span>
          </div>
          <div className="flex justify-between">
            <span>의류·잡화</span>
            <span className="font-medium text-gray-900">매출의 10~15%</span>
          </div>
          <div className="flex justify-between">
            <span>일반 소매</span>
            <span className="font-medium text-gray-900">매출의 10% 이하</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            * 일반적인 기준이며 업종, 상권, 매장 규모에 따라 다를 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
