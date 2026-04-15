'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateShutdownCost } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { ShutdownCostInput } from './types';

/** 금액 입력 필드 정의 */
const AMOUNT_FIELDS: { key: keyof ShutdownCostInput; label: string; placeholder: string }[] = [
  { key: 'deposit', label: '보증금', placeholder: '5,000만원' },
  { key: 'premiumLoss', label: '권리금 손실', placeholder: '3,000만원' },
  { key: 'inventoryBalance', label: '재고 잔액', placeholder: '500만원' },
  { key: 'demolitionCost', label: '설비/인테리어 철거비', placeholder: '300만원' },
  { key: 'employeeSalary', label: '직원 월급', placeholder: '250만원' },
  { key: 'leasePenalty', label: '임대차 해지 위약금', placeholder: '200만원' },
  { key: 'miscCost', label: '기타 비용', placeholder: '100만원' },
];

/** 초기 입력값 */
const initialInput: ShutdownCostInput = {
  deposit: 0,
  restorationRate: 10,
  premiumLoss: 0,
  inventoryBalance: 0,
  inventoryRecoveryRate: 30,
  demolitionCost: 0,
  employeeSalary: 0,
  employeeTenure: 0,
  leasePenalty: 0,
  miscCost: 0,
};

export default function ShutdownCostCalculator() {
  const [input, setInput] = useState<ShutdownCostInput>(initialInput);
  const [displays, setDisplays] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  /** 금액 입력 핸들러 */
  const handleChange = useCallback(
    (key: keyof ShutdownCostInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplays((prev) => ({
        ...prev,
        [key]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [key]: num }));
    },
    []
  );

  /** 비율 입력 핸들러 */
  const handleRateChange = useCallback(
    (key: 'restorationRate' | 'inventoryRecoveryRate', max: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseNumber(e.target.value);
        setInput((prev) => ({ ...prev, [key]: Math.min(num, max) }));
      },
    []
  );

  /** 근속연수 입력 핸들러 */
  const handleTenureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setInput((prev) => ({ ...prev, employeeTenure: val }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplays({});
    setCopied(false);
  }, []);

  /** 계산 결과 */
  const result = useMemo(() => {
    const hasInput =
      input.deposit > 0 ||
      input.premiumLoss > 0 ||
      input.inventoryBalance > 0 ||
      input.demolitionCost > 0 ||
      input.employeeSalary > 0 ||
      input.leasePenalty > 0 ||
      input.miscCost > 0;
    if (!hasInput) return null;
    return calculateShutdownCost(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      '[ 폐업비용 계산 결과 ]',
      ...result.items.map((item) => `${item.label}: ${formatNumber(item.amount)}원`),
      `───────────`,
      `총 폐업비용: ${formatNumber(result.totalCost)}원`,
      `보증금 반환액: ${formatNumber(result.depositReturn)}원`,
      `실질 손실액: ${formatNumber(result.netLoss)}원`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result]);

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 금액 필드 */}
        {AMOUNT_FIELDS.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              {field.label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
              <input
                id={field.key}
                type="text"
                inputMode="numeric"
                placeholder={field.placeholder}
                value={displays[field.key] ?? ''}
                onChange={handleChange(field.key)}
                className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`${field.label} 입력`}
              />
            </div>
          </div>
        ))}

        {/* 원상복구 비율 */}
        <div>
          <label
            htmlFor="restorationRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            원상복구 비율
          </label>
          <div className="relative">
            <input
              id="restorationRate"
              type="number"
              min={0}
              max={100}
              value={input.restorationRate}
              onChange={handleRateChange('restorationRate', 100)}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-8 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="원상복구 비율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">보증금의 N%를 원상복구비로 공제 (기본 10%)</p>
        </div>

        {/* 재고 회수율 */}
        <div>
          <label
            htmlFor="inventoryRecoveryRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            재고 회수율
          </label>
          <div className="relative">
            <input
              id="inventoryRecoveryRate"
              type="number"
              min={0}
              max={100}
              value={input.inventoryRecoveryRate}
              onChange={handleRateChange('inventoryRecoveryRate', 100)}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-8 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="재고 회수율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">재고를 되팔 수 있는 비율 (기본 30%)</p>
        </div>

        {/* 직원 근속연수 */}
        <div>
          <label
            htmlFor="employeeTenure"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            직원 근속연수
          </label>
          <div className="relative">
            <input
              id="employeeTenure"
              type="number"
              min={0}
              step={0.5}
              value={input.employeeTenure || ''}
              onChange={handleTenureChange}
              placeholder="2.5"
              className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-10 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="직원 근속연수 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">년</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">1년 미만이면 퇴직금 발생 안 함</p>
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

      {/* 결과 영역 */}
      {result && (
        <>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">계산 결과</h2>

            <div className="space-y-2">
              {result.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">
                    ₩ {formatNumber(item.amount)}
                  </span>
                </div>
              ))}

              <hr className="border-gray-100" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">총 폐업비용</span>
                <span className="font-semibold text-gray-900">
                  ₩ {formatNumber(result.totalCost)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">보증금 반환액</span>
                <span className="font-medium text-green-600">
                  - ₩ {formatNumber(result.depositReturn)}
                </span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">실질 손실액</span>
                <span
                  className={`text-2xl font-bold ${
                    result.netLoss > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  ₩ {formatNumber(Math.abs(result.netLoss))}
                  {result.netLoss <= 0 && (
                    <span className="ml-1 text-sm font-normal">회수</span>
                  )}
                </span>
              </div>
            </div>

            {/* 결과 복사 */}
            <button
              type="button"
              onClick={handleCopy}
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

          {/* 폐업비용 절감 팁 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">폐업비용 절감 팁</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 원상복구 범위를 임대인과 협의해 최소화하세요.</p>
              <p>• 재고는 동종 업체나 중고마켓을 통해 최대한 처분하세요.</p>
              <p>• 폐업 전 직원에게 충분한 사전 통보로 위약금을 줄이세요.</p>
              <p>• 소상공인 폐업 지원금(희망리턴패키지)을 확인하세요.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
