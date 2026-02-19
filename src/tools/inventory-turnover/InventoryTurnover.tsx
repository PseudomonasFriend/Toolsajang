'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateInventoryTurnover } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { InventoryTurnoverInput } from './types';

/** 기간 옵션 */
const PERIOD_OPTIONS = [
  { label: '1개월', days: 30 },
  { label: '분기 (3개월)', days: 90 },
  { label: '반기 (6개월)', days: 180 },
  { label: '1년', days: 365 },
];

/** 초기 입력값 */
const initialInput: InventoryTurnoverInput = {
  periodDays: 30,
  costOfGoods: 0,
  beginningInventory: 0,
  endingInventory: 0,
};

export default function InventoryTurnover() {
  const [input, setInput] = useState<InventoryTurnoverInput>(initialInput);
  const [displayValues, setDisplayValues] = useState({
    costOfGoods: '',
    beginningInventory: '',
    endingInventory: '',
  });

  /** 숫자 입력 핸들러 */
  const handleNumberChange =
    (field: keyof typeof displayValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplayValues((prev) => ({
        ...prev,
        [field]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [field]: num }));
    };

  /** 기간 변경 핸들러 */
  const handlePeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInput((prev) => ({ ...prev, periodDays: Number(e.target.value) }));
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues({ costOfGoods: '', beginningInventory: '', endingInventory: '' });
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.costOfGoods <= 0) return null;
    return calculateInventoryTurnover(input);
  }, [input]);

  const diagnosisColors = {
    good: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 기간 선택 */}
        <div>
          <label
            htmlFor="period"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            계산 기간 <span className="text-red-500">*</span>
          </label>
          <select
            id="period"
            value={input.periodDays}
            onChange={handlePeriodChange}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="계산 기간 선택"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.days} value={opt.days}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 매출원가 */}
        <div>
          <label
            htmlFor="costOfGoods"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            매출원가 <span className="text-red-500">*</span>
          </label>
          <p className="mb-1 text-xs text-gray-500">해당 기간 동안 판매된 상품의 원가 합계</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="costOfGoods"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.costOfGoods}
              onChange={handleNumberChange('costOfGoods')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="매출원가 입력"
            />
          </div>
        </div>

        {/* 기초 재고 */}
        <div>
          <label
            htmlFor="beginningInventory"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            기초 재고금액
          </label>
          <p className="mb-1 text-xs text-gray-500">기간 시작 시점의 재고 금액</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="beginningInventory"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.beginningInventory}
              onChange={handleNumberChange('beginningInventory')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="기초 재고금액 입력"
            />
          </div>
        </div>

        {/* 기말 재고 */}
        <div>
          <label
            htmlFor="endingInventory"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            기말 재고금액
          </label>
          <p className="mb-1 text-xs text-gray-500">기간 종료 시점의 재고 금액</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="endingInventory"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.endingInventory}
              onChange={handleNumberChange('endingInventory')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="기말 재고금액 입력"
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">평균 재고금액</span>
              <span className="text-lg font-semibold text-gray-900">
                ₩ {formatNumber(result.avgInventory)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">재고 회전율 (연환산)</span>
              <span className="text-2xl font-bold text-blue-600">
                {result.turnoverRate}회
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">재고 보유 일수</span>
              <span className="text-2xl font-bold text-gray-900">
                {result.daysOnHand}일
              </span>
            </div>
          </div>

          {/* 진단 메시지 */}
          <div
            className={`mt-4 rounded-lg border p-3 text-sm font-medium ${diagnosisColors[result.diagnosisLevel]}`}
          >
            {result.diagnosis}
          </div>
        </div>
      )}

      {/* 업종별 참고 기준 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-gray-900">업종별 적정 재고 회전율</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>식음료·제과</span>
            <span className="font-medium text-gray-900">30회 이상 (12일 이하)</span>
          </div>
          <div className="flex justify-between">
            <span>의류·잡화</span>
            <span className="font-medium text-gray-900">4~8회 (45~90일)</span>
          </div>
          <div className="flex justify-between">
            <span>일반 소매</span>
            <span className="font-medium text-gray-900">6~12회 (30~60일)</span>
          </div>
          <div className="flex justify-between">
            <span>도매</span>
            <span className="font-medium text-gray-900">3~6회 (60~120일)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
